"""
Python Intro-Laufzeit – läuft vollständig im Browser (Pyodide).

Zuständig für:
  * Ausführen von Studierenden-Code mit abgefangener Ausgabe
  * Prüfen der vier Step-Typen (read / run / experiment / exercise)
  * verständliche, deutschsprachige Fehlermeldungen
"""

import ast
import io
import re
import sys
import time
import traceback
from contextlib import redirect_stderr, redirect_stdout

MAX_OUTPUT = 40_000
MAX_STEPS_MESSAGE = "Dein Code lief zu lange – steckt da vielleicht eine Endlosschleife drin?"


# --------------------------------------------------------------------------- #
#  Ausgabe einfangen
# --------------------------------------------------------------------------- #
class _Capture(io.StringIO):
    def __init__(self):
        super().__init__()
        self.truncated = False

    def write(self, s):
        if self.tell() > MAX_OUTPUT:
            if not self.truncated:
                self.truncated = True
                super().write("\n… Ausgabe gekürzt (zu viele Zeilen).")
            raise _OutputTooLong()
        return super().write(s)


class _OutputTooLong(Exception):
    pass


# --------------------------------------------------------------------------- #
#  Endlosschleifen abfangen
# --------------------------------------------------------------------------- #
TIME_LIMIT_SECONDS = 8.0
_CHECK_EVERY = 2_000

_OWN_FILES = ("<code>", "<shell>", "<lösung>")


class _TookTooLong(Exception):
    pass


class _Watchdog:
    """
    Zählt ausgeführte Zeilen im Studierenden-Code und bricht ab, wenn das
    Zeitbudget überschritten ist. Nur eigene Dateien werden verfolgt, damit
    Bibliotheken wie pandas nicht ausgebremst werden.
    """

    def __init__(self):
        self.deadline = 0.0
        self.counter = 0

    def _line(self, frame, event, arg):
        self.counter += 1
        if self.counter >= _CHECK_EVERY:
            self.counter = 0
            if time.monotonic() > self.deadline:
                raise _TookTooLong()
        return self._line

    def _call(self, frame, event, arg):
        if frame.f_code.co_filename in _OWN_FILES:
            return self._line
        return None

    def __enter__(self):
        self.deadline = time.monotonic() + TIME_LIMIT_SECONDS
        self.counter = 0
        sys.settrace(self._call)
        return self

    def __exit__(self, *exc):
        sys.settrace(None)
        return False


# --------------------------------------------------------------------------- #
#  Fehlermeldungen eindeutschen
# --------------------------------------------------------------------------- #
_ERROR_HINTS = [
    (
        r"name '(?P<name>\w+)' is not defined",
        "Python kennt den Namen `{name}` nicht. Hast du dich vertippt, "
        "oder die Variable noch gar nicht angelegt?",
    ),
    (
        r"unsupported operand type\(s\) for \+: 'int' and 'str'",
        "Du versuchst, eine Zahl und einen Text mit `+` zu verbinden. "
        "Wandle die Zahl mit `str(...)` in Text um.",
    ),
    (
        r"can only concatenate str \(not \"(?P<t>\w+)\"\) to str",
        "Du versuchst, Text mit etwas anderem (`{t}`) zu verketten. "
        "Wandle es vorher mit `str(...)` um.",
    ),
    (
        r"'(?P<t>\w+)' object is not subscriptable",
        "Ein Objekt vom Typ `{t}` lässt sich nicht mit eckigen Klammern indizieren.",
    ),
    (
        r"list index out of range",
        "Du greifst auf einen Index zu, den es in der Liste nicht gibt. "
        "Denk daran: das erste Element hat den Index 0.",
    ),
    (
        r"string index out of range",
        "Du greifst auf eine Position im Text zu, die es nicht gibt.",
    ),
    (
        r"'(?P<t>\w+)' object has no attribute '(?P<a>\w+)'",
        "Ein Objekt vom Typ `{t}` hat keine Methode oder Eigenschaft namens `{a}`. "
        "Tippfehler?",
    ),
    (
        r"division by zero",
        "Durch null teilen geht in der Mathematik nicht – und in Python auch nicht.",
    ),
    (
        r"invalid syntax",
        "Python kann diese Zeile nicht lesen. Fehlt ein Doppelpunkt, "
        "eine Klammer oder ein Anführungszeichen?",
    ),
    (
        r"expected ':'",
        "Hier fehlt ein Doppelpunkt `:` am Zeilenende.",
    ),
    (
        r"unexpected indent",
        "Diese Zeile ist zu weit eingerückt.",
    ),
    (
        r"expected an indented block",
        "Nach einem Doppelpunkt muss die nächste Zeile eingerückt sein "
        "(vier Leerzeichen).",
    ),
    (
        r"unterminated string literal",
        "Ein Anführungszeichen wurde nicht geschlossen.",
    ),
    (
        r"takes (?P<n>\d+) positional arguments? but (?P<m>\d+) (was|were) given",
        "Die Funktion erwartet {n} Argument(e), du hast aber {m} übergeben.",
    ),
    (
        r"missing (?P<n>\d+) required positional argument",
        "Der Funktion fehlen {n} Argument(e).",
    ),
    (
        r"object of type '(?P<t>\w+)' has no len\(\)",
        "`len(...)` funktioniert nicht mit dem Typ `{t}`.",
    ),
    (
        r"invalid literal for int\(\) with base 10",
        "Dieser Text lässt sich nicht in eine ganze Zahl umwandeln.",
    ),
]


def friendly_error(exc_type, message):
    for pattern, template in _ERROR_HINTS:
        match = re.search(pattern, message)
        if match:
            return template.format(**match.groupdict())
    if exc_type == "IndentationError":
        return "Die Einrückung stimmt nicht. Verwende überall vier Leerzeichen pro Ebene."
    if exc_type == "SyntaxError":
        return "Python kann diesen Code nicht lesen – schau nochmal auf Klammern, Doppelpunkte und Anführungszeichen."
    return None


def format_exception(exc):
    """Traceback ohne die internen Runtime-Zeilen."""
    exc_type = type(exc).__name__
    message = str(exc)

    if isinstance(exc, SyntaxError):
        lines = [f"{exc_type}: {message}"]
        if exc.text:
            lines.append(f"  Zeile {exc.lineno}: {exc.text.rstrip()}")
            if exc.offset:
                lines.append("  " + " " * (7 + len(str(exc.lineno)) + exc.offset - 1) + "^")
        text = "\n".join(lines)
    else:
        tb = exc.__traceback__
        frames = traceback.extract_tb(tb)
        frames = [f for f in frames if f.filename in ("<code>", "<lösung>")]
        parts = []
        if frames:
            parts.append("Traceback:")
            for frame in frames:
                parts.append(f"  Zeile {frame.lineno}: {(frame.line or '').strip()}")
        parts.append(f"{exc_type}: {message}")
        text = "\n".join(parts)

    return {"type": exc_type, "message": message, "text": text, "hint": friendly_error(exc_type, message)}


# --------------------------------------------------------------------------- #
#  Code ausführen
# --------------------------------------------------------------------------- #
def assert_equal(actual, expected):
    """
    Kleine Testhilfe, die in jedem Programm zur Verfügung steht.

    Studierende lernen damit früh, ihre eigenen Funktionen zu prüfen, ohne dass
    sie schon ein Test-Framework verstehen müssen.
    """
    if actual == expected:
        print("OK")
    else:
        print(f"Fehler! {actual!r} != {expected!r}")


def new_namespace():
    """Frischer globaler Namensraum inklusive der Lernhilfen."""
    return {"__name__": "__main__", "assert_equal": assert_equal}


def make_input(values):
    """
    Ersatz für `input()`, der vorher festgelegte Eingaben abarbeitet.

    Die gelesene Eingabe wird mitausgegeben – so sieht man im Protokoll,
    was eingetippt wurde, genau wie in einer echten Konsole.
    """
    queue = list(values or [])

    def _input(prompt=""):
        if prompt:
            print(prompt, end="")
        if not queue:
            raise EOFError("Es sind keine Eingaben mehr übrig.")
        value = str(queue.pop(0))
        print(f"<Eingabe: {value}>")
        return value

    return _input


def execute(code, namespace=None, filename="<code>", stdin=None):
    """Führt Code aus und liefert (namespace, ausgabe, fehler_oder_None)."""
    namespace = namespace if namespace is not None else new_namespace()
    namespace.setdefault("assert_equal", assert_equal)
    if stdin is not None:
        namespace["input"] = make_input(stdin)
    buffer = _Capture()
    error = None
    try:
        compiled = compile(code, filename, "exec")
        with redirect_stdout(buffer), redirect_stderr(buffer), _Watchdog():
            exec(compiled, namespace)
    except _OutputTooLong:
        error = {"type": "OutputError", "message": "zu viel Ausgabe",
                 "text": "Dein Programm gibt sehr viel aus – vermutlich eine Endlosschleife.",
                 "hint": MAX_STEPS_MESSAGE}
    except _TookTooLong:
        error = {"type": "TimeoutError", "message": "Zeitlimit überschritten",
                 "text": f"Abgebrochen nach {TIME_LIMIT_SECONDS:.0f} Sekunden.",
                 "hint": MAX_STEPS_MESSAGE}
    except SystemExit:
        pass
    except BaseException as exc:  # noqa: BLE001 – wir wollen wirklich alles zeigen
        error = format_exception(exc)
    return namespace, buffer.getvalue(), error


def run_shell(source, namespace):
    """Wie die Python-Konsole: der Wert des letzten Ausdrucks wird angezeigt."""
    buffer = _Capture()
    error = None
    try:
        tree = ast.parse(source, "<shell>", "exec")
    except SyntaxError as exc:
        return "", format_exception(exc)

    try:
        with redirect_stdout(buffer), redirect_stderr(buffer), _Watchdog():
            if tree.body and isinstance(tree.body[-1], ast.Expr):
                *head, last = tree.body
                if head:
                    exec(compile(ast.Module(body=head, type_ignores=[]), "<shell>", "exec"), namespace)
                value = eval(  # noqa: S307 – gewollt: interaktive Konsole
                    compile(ast.Expression(body=last.value), "<shell>", "eval"), namespace
                )
                if value is not None:
                    print(repr(value))
            else:
                exec(compile(tree, "<shell>", "exec"), namespace)
    except _OutputTooLong:
        error = {"type": "OutputError", "message": "zu viel Ausgabe",
                 "text": "Sehr viel Ausgabe – vermutlich eine Endlosschleife.", "hint": MAX_STEPS_MESSAGE}
    except _TookTooLong:
        error = {"type": "TimeoutError", "message": "Zeitlimit überschritten",
                 "text": f"Abgebrochen nach {TIME_LIMIT_SECONDS:.0f} Sekunden.",
                 "hint": MAX_STEPS_MESSAGE}
    except SystemExit:
        pass
    except BaseException as exc:  # noqa: BLE001
        error = format_exception(exc)
    return buffer.getvalue(), error


# --------------------------------------------------------------------------- #
#  AST-Vergleich
# --------------------------------------------------------------------------- #
class _Normalise(ast.NodeTransformer):
    """Entfernt Formatierungs- und Benennungsrauschen aus dem Syntaxbaum."""

    def visit_Constant(self, node):
        # Anführungszeichen-Stil ist egal, der Wert zählt
        return ast.copy_location(ast.Constant(value=node.value, kind=None), node)


def ast_signature(code):
    """Kanonische Darstellung eines Programms – unabhängig von Leerzeichen und Kommentaren."""
    tree = ast.parse(code.strip())
    tree = _Normalise().visit(tree)
    ast.fix_missing_locations(tree)
    return ast.dump(tree, annotate_fields=True, include_attributes=False)


def same_program(user_code, expected_code):
    try:
        return ast_signature(user_code) == ast_signature(expected_code)
    except SyntaxError:
        return False


def ast_node_names(code):
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return set()
    return {type(node).__name__ for node in ast.walk(tree)}


def uses_nodes(code, names):
    present = ast_node_names(code)
    return all(name in present for name in names)


def any_node(code, names):
    present = ast_node_names(code)
    return any(name in present for name in names)


# --------------------------------------------------------------------------- #
#  Ausgabe vergleichen
# --------------------------------------------------------------------------- #
def normalise_output(text):
    if not isinstance(text, str):
        return text
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").split("\n")]
    while lines and lines[-1] == "":
        lines.pop()
    return "\n".join(lines)


def outputs_match(actual, expected):
    return normalise_output(actual) == normalise_output(expected)


# --------------------------------------------------------------------------- #
#  Prüfungen der Step-Typen
# --------------------------------------------------------------------------- #
def ok(message=None, **extra):
    return {"passed": True, "message": message, **extra}


def fail(message, **extra):
    return {"passed": False, "message": message, **extra}


def same_text(a, b):
    """Zeilenweiser Vergleich – für Programme, die absichtlich nicht parsen."""
    def tidy(text):
        lines = [line.rstrip() for line in text.strip("\n").split("\n")]
        while lines and not lines[0]:
            lines.pop(0)
        while lines and not lines[-1]:
            lines.pop()
        return "\n".join(lines)

    return tidy(a) == tidy(b)


def check_run(user_code, expected_program, error, expects_error=False):
    """run-Step: das vorgegebene Programm muss (sinngemäß) ausgeführt worden sein."""
    if error and not expects_error:
        return fail("Das Programm läuft noch nicht fehlerfrei – schau dir die Fehlermeldung an.")

    # Manche Beispiele sind absichtlich kaputt und lassen sich gar nicht parsen.
    # Dann bleibt nur der wörtliche Vergleich.
    try:
        ast.parse(expected_program)
    except SyntaxError:
        if same_text(user_code, expected_program):
            return ok()
        return fail("Vergleiche deinen Code Zeichen für Zeichen mit der Vorlage – auch die Einrückung.")

    if same_program(user_code, expected_program):
        return ok()

    try:
        ast.parse(user_code)
    except SyntaxError:
        return fail("Der Code lässt sich nicht lesen. Vergleiche ihn nochmal Zeichen für Zeichen mit der Vorlage.")

    expected_names = ast_node_names(expected_program)
    user_names = ast_node_names(user_code)
    missing = expected_names - user_names
    if missing:
        return fail(
            "Das ist noch nicht ganz das vorgegebene Programm. "
            "Vergleiche deinen Code Zeile für Zeile mit der Vorlage."
        )
    return fail(
        "Fast! Der Code weicht noch von der Vorlage ab – "
        "achte auf Namen, Anführungszeichen und Reihenfolge."
    )


TYPE_NAMES = {
    "str": (str, "ein Text (String)"),
    "int": (int, "eine ganze Zahl"),
    "float": (float, "eine Kommazahl"),
    "list": (list, "eine Liste"),
    "bool": (bool, "ein Wahrheitswert"),
    "dict": (dict, "ein Dictionary"),
}


def check_variable(namespace, spec):
    """Prüft, ob eine Variable existiert und den geforderten Inhalt hat."""
    name = spec["name"]

    if name not in namespace:
        return fail(f"Es gibt noch keine Variable namens `{name}`.")

    value = namespace[name]
    wanted = spec.get("type")

    if wanted and wanted in TYPE_NAMES:
        python_type, label = TYPE_NAMES[wanted]
        # bool ist in Python ein Sonderfall von int – hier wollen wir sie trennen.
        if python_type is int and isinstance(value, bool):
            return fail(f"`{name}` sollte {label} sein, ist aber ein Wahrheitswert.")
        if not isinstance(value, python_type):
            actual = TYPE_NAMES.get(type(value).__name__, (None, type(value).__name__))[1]
            return fail(f"`{name}` sollte {label} sein, ist aber {actual}.")

    if spec.get("nonEmpty") and not value:
        return fail(f"`{name}` ist noch leer – gib ihr einen richtigen Inhalt.")

    if spec.get("noLeadingSpace") and isinstance(value, str) and value[:1] == " ":
        return fail(f"`{name}` fängt mit einem Leerzeichen an. Nimm etwas ohne Leerzeichen davor.")

    if "notEqualTo" in spec and value == spec["notEqualTo"]:
        return fail(
            f"`{name}` hat noch genau den Wert aus dem Beispiel. Nimm einen eigenen Wert."
        )

    return ok()


def check_experiment(user_code, output, error, spec, namespace=None):
    if error:
        return fail("Der Code läuft noch nicht fehlerfrei.")
    if not user_code.strip():
        return fail("Schreib zuerst etwas Code.")

    require_variable = spec.get("requireVariable")
    if require_variable:
        result = check_variable(namespace or {}, require_variable)
        if not result["passed"]:
            return result

    require_ast = spec.get("requireAst") or []
    if require_ast and not any_node(user_code, require_ast):
        return fail(spec.get("astMessage") or "Der Code enthält noch nicht das Gesuchte – lies die Aufgabe nochmal.")

    require_output = spec.get("requireOutput")
    if require_output and normalise_output(require_output) not in normalise_output(output):
        return fail("Die Ausgabe passt noch nicht zur Aufgabe.")

    return ok()


def _compare(actual, expected, mode):
    if mode == "stdout":
        return outputs_match(actual, expected)
    return actual == expected


def _describe(value, mode):
    if mode == "stdout":
        return normalise_output(value) if isinstance(value, str) else repr(value)
    return repr(value)


def check_exercise(user_code, spec):
    """
    Prüft eine Übung gegen Testfälle.

    functionName gesetzt  -> Studierende schreiben eine Funktion
    sonst                 -> Skript; params werden als Variablen vorbelegt
    """
    if not user_code.strip():
        return fail("Der Editor ist noch leer.")

    disallowed = spec.get("disallowedAst")
    if disallowed and any_node(user_code, disallowed["nodes"]):
        return fail(disallowed["message"])

    mode = spec.get("mode", "stdout")
    params = spec.get("params") or []
    tests = spec.get("tests") or []
    function_name = spec.get("functionName")

    # Ausgabe, die die Studierende zu sehen bekommt: der Lauf mit dem ersten Testfall.
    shown = {"output": "", "error": None}
    func = None

    if function_name:
        namespace, definition_output, error = execute(user_code)
        shown["output"] = definition_output
        if error:
            shown["error"] = error
            return fail("Dein Code hat einen Fehler – schau dir die Meldung unten an.", **shown)

        func = namespace.get(function_name)
        if func is None:
            return fail(f"Definiere eine Funktion namens `{function_name}`.", **shown)
        if not callable(func):
            return fail(f"`{function_name}` ist keine Funktion.", **shown)

        import inspect

        try:
            actual_params = list(inspect.signature(func).parameters)
        except (TypeError, ValueError):
            actual_params = list(params)
        if len(actual_params) != len(params):
            return fail(
                f"`{function_name}` sollte {len(params)} Parameter entgegennehmen "
                f"({', '.join(params) or 'keine'}), hat aber {len(actual_params)}.",
                **shown,
            )

    for index, test in enumerate(tests):
        args = test["args"]
        expected = test["expected"]
        call_label = (
            f"{function_name}({_args_repr(args)})" if function_name else _inputs_repr(params, args)
        )

        if function_name:
            buffer = _Capture()
            if test.get("stdin") is not None:
                func.__globals__["input"] = make_input(test["stdin"])
            try:
                with redirect_stdout(buffer), redirect_stderr(buffer):
                    returned = func(*[_copy(a) for a in args])
            except _OutputTooLong:
                return fail(MAX_STEPS_MESSAGE, **shown)
            except BaseException as exc:  # noqa: BLE001
                error = format_exception(exc)
                if index == 0:
                    shown["error"] = error
                return fail(f"`{call_label}` löst einen Fehler aus.", **shown)
            output = buffer.getvalue()
            actual = output if mode == "stdout" else returned
        else:
            namespace = new_namespace()
            for name, value in zip(params, args):
                namespace[name] = _copy(value)
            _, output, error = execute(user_code, namespace, stdin=test.get("stdin"))
            if index == 0:
                shown["output"] = output
                shown["error"] = error
            if error:
                return fail(f"Mit {call_label} läuft dein Code auf einen Fehler.", **shown)
            actual = output

        if index == 0 and function_name and mode == "stdout":
            shown["output"] = output

        if not _compare(actual, expected, mode):
            return fail(
                "Noch nicht ganz – vergleich mal Soll und Ist.",
                detail={
                    "inputs": call_label,
                    "expected": _describe(expected, mode),
                    "actual": _describe(actual, mode),
                    "mode": mode,
                },
                **shown,
            )

    return ok(**shown)


def _copy(value):
    if isinstance(value, list):
        return [_copy(v) for v in value]
    if isinstance(value, dict):
        return {k: _copy(v) for k, v in value.items()}
    return value


def _args_repr(args):
    return ", ".join(repr(a) for a in args)


def _inputs_repr(params, args):
    if not params:
        return "diesen Eingaben"
    return ", ".join(f"{name} = {value!r}" for name, value in zip(params, args))


# --------------------------------------------------------------------------- #
#  Einstiegspunkt, den der Worker aufruft
# --------------------------------------------------------------------------- #
_SHELL_NAMESPACE = new_namespace()


def reset_shell():
    _SHELL_NAMESPACE.clear()
    _SHELL_NAMESPACE.update(new_namespace())


def run(payload):
    """
    payload = {
      "code": str,
      "surface": "editor" | "shell",
      "step": { "kind": ..., weitere Prüfangaben }
    }
    """
    code = payload.get("code", "")
    surface = payload.get("surface", "editor")
    step = payload.get("step") or {}
    kind = step.get("kind", "read")

    # Übungen führen den Code selbst aus – einmal je Testfall, mit belegten Eingaben.
    if kind == "exercise":
        result = {"output": "", "error": None, "passed": False, "message": None}
        result.update(check_exercise(code, step))
        return result

    if surface == "shell":
        output, error = run_shell(code, _SHELL_NAMESPACE)
        namespace = _SHELL_NAMESPACE
    else:
        namespace, output, error = execute(code, stdin=step.get("stdin"))

    result = {"output": output, "error": error, "passed": False, "message": None}

    if kind == "run":
        result.update(
            check_run(code, step.get("program", ""), error, step.get("expectsError", False))
        )
    elif kind == "experiment":
        if step.get("anyValidCode"):
            result.update(ok() if not error else fail("Der Code läuft noch nicht fehlerfrei."))
        else:
            result.update(check_experiment(code, output, error, step, namespace))
    else:
        result.update(ok())

    return result
