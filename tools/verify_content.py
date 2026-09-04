"""
Qualitätssicherung für die Lerninhalte.

Prüft mit derselben Laufzeit, die auch im Browser läuft:

  * Löst jede Musterlösung tatsächlich alle ihre Testfälle?
  * Läuft jedes vorgegebene Programm fehlerfrei (außer es ist als
    expectsError markiert)?
  * Erfüllt jedes Beispiel eines experiment-Steps dessen eigene Bedingung?
  * Stimmt bei jeder Vorhersage-Frage die als richtig markierte Antwort
    mit der echten Ausgabe überein?
  * Sind alle IDs eindeutig?

    npm run content:check
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "public"))

import python_intro_runtime as R  # noqa: E402

CONTENT = ROOT / "tools" / "content.json"

# Im Browser liegen die Übungsdatensätze im Arbeitsverzeichnis von Pyodide.
# Damit `pd.read_csv('cereals.csv')` auch hier funktioniert, wechseln wir dorthin.
os.chdir(ROOT / "public" / "data")

problems: list[str] = []
warnings: list[str] = []
checked = {"exercise": 0, "run": 0, "experiment": 0, "prediction": 0, "read": 0}


def problem(where: str, message: str) -> None:
    problems.append(f"{where}\n    {message}")


def warn(where: str, message: str) -> None:
    warnings.append(f"{where}\n    {message}")


def check_exercise(where: str, step: dict) -> None:
    checked["exercise"] += 1
    spec = {
        "kind": "exercise",
        "mode": step.get("mode", "stdout"),
        "params": step.get("params", []),
        "tests": step.get("tests", []),
        "functionName": step.get("functionName"),
        "disallowedAst": step.get("disallowedAst"),
    }

    if not spec["tests"]:
        problem(where, "Übung ohne Testfälle.")
        return
    if not step.get("solution"):
        problem(where, "Übung ohne Musterlösung.")
        return

    result = R.check_exercise(step["solution"], spec)
    if not result["passed"]:
        detail = result.get("detail")
        message = result.get("message", "")
        if detail:
            message += (
                f"\n    Eingabe:  {detail['inputs']}"
                f"\n    Erwartet: {detail['expected']!r}"
                f"\n    Bekommen: {detail['actual']!r}"
            )
        error = result.get("error")
        if error:
            message += f"\n    {error['text']}"
        problem(where, f"Musterlösung besteht die eigenen Tests nicht.\n    {message}")

    if not step.get("hints"):
        warn(where, "Übung ohne Tipps – Studierende können hier hängen bleiben.")


def run_like_student(code: str, surface: str, namespace: dict, stdin=None):
    """
    Führt Code so aus, wie es die Studierende täte: In der Shell wird der Wert
    des letzten Ausdrucks angezeigt, im Editor nicht.
    """
    if surface == "shell":
        output, error = R.run_shell(code, namespace)
        return namespace, output, error
    return R.execute(code, namespace, stdin=stdin)


def check_run(where: str, step: dict, namespace: dict) -> None:
    checked["run"] += 1
    program = step.get("program", "")
    expects_error = step.get("expectsError", False)

    _, output, error = run_like_student(
        program, step.get("surface", "editor"), namespace, step.get("stdin")
    )

    if error and not expects_error:
        problem(
            where,
            f"Vorgegebenes Programm läuft auf einen Fehler:\n    {error['text'].splitlines()[-1]}",
        )
    if not error and expects_error:
        problem(where, "Als expectsError markiert, läuft aber fehlerfrei.")

    prediction = step.get("prediction")
    if prediction:
        checked["prediction"] += 1
        choices = prediction["choices"]
        index = prediction["correctIndex"]

        if not 0 <= index < len(choices):
            problem(where, f"correctIndex {index} liegt außerhalb der {len(choices)} Antworten.")
            return

        # Bei absichtlichen Fehlern kann die Ausgabe nicht verglichen werden.
        if error:
            if "fehler" not in choices[index].lower():
                warn(
                    where,
                    "Programm erzeugt einen Fehler, die richtige Antwort erwähnt das aber nicht: "
                    f"{choices[index]!r}",
                )
            return

        actual = R.normalise_output(output)
        expected = R.normalise_output(choices[index])
        if actual != expected:
            problem(
                where,
                "Als richtig markierte Antwort passt nicht zur echten Ausgabe."
                f"\n    Markiert: {choices[index]!r}"
                f"\n    Echt:     {actual!r}",
            )

        for other, choice in enumerate(choices):
            if other != index and R.normalise_output(choice) == actual:
                problem(where, f"Antwort {other} ist genauso richtig wie {index}: {choice!r}")


def check_experiment(where: str, step: dict, namespace: dict) -> None:
    checked["experiment"] += 1
    example = step.get("example")

    if not example:
        if not step.get("anyValidCode"):
            warn(where, "experiment-Step ohne Beispiellösung – 'Lösung zeigen' bleibt leer.")
        return

    # Das Beispiel wirkt auf die Lektion weiter – spätere Steps bauen darauf auf.
    result_namespace, output, error = run_like_student(
        example, step.get("surface", "editor"), namespace
    )
    if error:
        problem(where, f"Beispiel läuft auf einen Fehler:\n    {error['text'].splitlines()[-1]}")
        return

    result = R.check_experiment(example, output, error, step, result_namespace)
    if not result["passed"]:
        problem(where, f"Beispiel erfüllt die eigene Bedingung nicht: {result['message']}")


def main() -> int:
    if not CONTENT.exists():
        print("tools/content.json fehlt. Führe zuerst 'npm run content:export' aus.")
        return 1

    chapters = json.loads(CONTENT.read_text(encoding="utf-8"))

    chapter_ids: set[str] = set()
    lesson_ids: set[str] = set()

    for chapter in chapters:
        if chapter["id"] in chapter_ids:
            problem(f"Kapitel {chapter['id']}", "Kapitel-ID doppelt vergeben.")
        chapter_ids.add(chapter["id"])

        for lesson in chapter["lessons"]:
            if lesson["id"] in lesson_ids:
                problem(f"Lektion {lesson['id']}", "Lektions-ID doppelt vergeben.")
            lesson_ids.add(lesson["id"])

            # Eine Lektion wird der Reihe nach durchgearbeitet – Variablen aus
            # früheren Steps stehen später zur Verfügung.
            namespace: dict = {"__name__": "__main__"}
            step_ids: set[str] = set()

            for position, step in enumerate(lesson["steps"], start=1):
                where = f"{lesson['id']} › Schritt {position} ({step['id']})"

                if step["id"] in step_ids:
                    problem(where, "Step-ID innerhalb der Lektion doppelt vergeben.")
                step_ids.add(step["id"])

                if not step.get("text", "").strip():
                    problem(where, "Step ohne Lektionstext.")

                kind = step["kind"]
                if kind == "exercise":
                    check_exercise(where, step)
                    # Die Musterlösung fortschreiben, damit spätere Steps darauf aufbauen können.
                    R.execute(step.get("solution", ""), namespace)
                elif kind == "run":
                    check_run(where, step, namespace)
                elif kind == "experiment":
                    check_experiment(where, step, namespace)
                else:
                    checked["read"] += 1

            if not lesson.get("outro", "").strip():
                warn(f"Lektion {lesson['id']}", "Kein Abschlusstext (outro).")

    total = sum(checked.values())
    print(
        f"Geprüft: {total} Steps "
        f"({checked['exercise']} Übungen, {checked['run']} Programme, "
        f"{checked['experiment']} Experimente, {checked['prediction']} Vorhersagen)\n"
    )

    if warnings:
        print(f"⚠ {len(warnings)} Hinweise:")
        for entry in warnings:
            print(f"  {entry}")
        print()

    if problems:
        print(f"✗ {len(problems)} Probleme:")
        for entry in problems:
            print(f"  {entry}")
        return 1

    print("✓ Keine Probleme gefunden.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
