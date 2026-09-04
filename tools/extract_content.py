"""
Extrahiert die Lektionsinhalte aus den futurecoder-Kapiteldateien (core/chapters/*.py)
in ein neutrales JSON-Format, das als Vorlage für die deutschen Inhalte dient.

Reines AST-Parsing – keine futurecoder-Abhängigkeiten, kein Import der Module.

    python3 python-intro/tools/extract_content.py

Ergebnis: python-intro/tools/extracted/<chapter>.json  +  extracted/_index.json
"""

from __future__ import annotations

import ast
import json
import os
import re
from pathlib import Path
from textwrap import dedent

HERE = Path(__file__).resolve().parent
OUT_DIR = HERE / "extracted"

# Die futurecoder-Quellen sind nur für dieses einmalige Werkzeug nötig und
# gehören nicht ins Repository. Über PYTHON_INTRO_FUTURECODER lässt sich ein
# beliebiger Pfad angeben.
_CANDIDATES = [
    Path(os.environ["PYTHON_INTRO_FUTURECODER"]) / "core" / "chapters"
    if os.environ.get("PYTHON_INTRO_FUTURECODER")
    else None,
    HERE.parent.parent / "core" / "chapters",  # python-intro liegt im futurecoder-Ordner
    HERE.parent / "futurecoder" / "core" / "chapters",
]
CHAPTERS_DIR = next(
    (path for path in _CANDIDATES if path and path.is_dir()),
    HERE.parent.parent / "core" / "chapters",
)

STEP_BASES = {"Step", "VerbatimStep", "ExerciseStep", "MessageStep", "ExerciseStepBase"}


def clean_doc(doc: str | None) -> str:
    if not doc:
        return ""
    return dedent(doc).strip("\n").rstrip()


def source_of(node: ast.AST, lines: list[str]) -> str:
    start = node.lineno - 1
    end = node.end_lineno
    return dedent("\n".join(lines[start:end])).rstrip()


def body_source(node: ast.FunctionDef, lines: list[str]) -> str:
    """Rumpf einer Funktion ohne Signatur und ohne Docstring."""
    body = node.body
    if body and isinstance(body[0], ast.Expr) and isinstance(body[0].value, ast.Constant) \
            and isinstance(body[0].value.value, str):
        body = body[1:]
    if not body:
        return ""
    start = body[0].lineno - 1
    end = body[-1].end_lineno
    return dedent("\n".join(lines[start:end])).rstrip()


def literal(node: ast.AST):
    try:
        return ast.literal_eval(node)
    except (ValueError, SyntaxError, TypeError):
        return None


def extract_copyable(text: str) -> list[str]:
    """Findet `__copyable__`-Codeblöcke im Lektionstext (eingerückte Blöcke)."""
    blocks: list[str] = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        if lines[i].strip() == "__copyable__":
            indent = len(lines[i]) - len(lines[i].lstrip())
            i += 1
            block: list[str] = []
            while i < len(lines):
                line = lines[i]
                if line.strip() == "":
                    block.append("")
                elif (len(line) - len(line.lstrip())) >= indent:
                    block.append(line[indent:])
                else:
                    break
                i += 1
            blocks.append("\n".join(block).strip("\n"))
        else:
            i += 1
    return blocks


def jsonable(value):
    """Macht literal_eval-Ergebnisse JSON-tauglich (Tupel/Sets als Listen)."""
    if isinstance(value, (list, tuple, set)):
        return [jsonable(v) for v in value]
    if isinstance(value, dict):
        return {repr(k) if not isinstance(k, str) else k: jsonable(v)
                for k, v in value.items()}
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    return repr(value)


def normalise_tests(val) -> list[dict]:
    """
    futurecoder kennt zwei Test-Formate:
      tests = [(eingabe, erwartet), ...]
      tests = {eingabe: erwartet, ...}   (Schlüssel ggf. Tupel = mehrere Argumente)
    Beides wird zu [{"args": [...], "expected": ...}] vereinheitlicht.
    """
    out: list[dict] = []
    items = val.items() if isinstance(val, dict) else [
        (t[0], t[1]) for t in val if isinstance(t, (list, tuple)) and len(t) == 2
    ]
    for args, expected in items:
        args_list = list(args) if isinstance(args, tuple) else [args]
        out.append({"args": jsonable(args_list), "expected": jsonable(expected)})
    return out


def parse_step(node: ast.ClassDef, lines: list[str], depth: int = 0) -> dict:
    bases = [b.id for b in node.bases if isinstance(b, ast.Name)]
    step: dict = {
        "name": node.name,
        "kind": bases[0] if bases else "Step",
        "text": clean_doc(ast.get_docstring(node, clean=False)),
        "program": None,
        "programInText": True,
        "hints": [],
        "requirements": None,
        "tests": None,
        "solution": None,
        "solutionSignature": None,
        "predictedOutputChoices": None,
        "correctOutput": None,
        "disallowed": None,
        "messageSteps": [],
        "checkSource": None,
    }

    for item in node.body:
        # --- einfache Zuweisungen -------------------------------------------
        if isinstance(item, ast.Assign) and len(item.targets) == 1 \
                and isinstance(item.targets[0], ast.Name):
            key = item.targets[0].id
            val = literal(item.value)

            if key == "program" and isinstance(val, str):
                step["program"] = dedent(val).strip("\n")
            elif key == "program_in_text":
                step["programInText"] = bool(val)
            elif key == "hints":
                if isinstance(val, str):
                    parts = [h.strip() for h in dedent(val).strip().split("\n\n") if h.strip()]
                    step["hints"] = parts
                elif isinstance(val, list):
                    step["hints"] = [dedent(str(h)).strip() for h in val]
            elif key == "requirements" and isinstance(val, str):
                step["requirements"] = dedent(val).strip()
            elif key == "tests":
                step["tests"] = normalise_tests(val) if val is not None \
                    else source_of(item.value, lines)
            elif key == "predicted_output_choices" and isinstance(val, list):
                step["predictedOutputChoices"] = val
            elif key == "correct_output" and isinstance(val, str):
                step["correctOutput"] = val
            elif key == "disallowed":
                step["disallowed"] = source_of(item.value, lines)

        # --- Methoden --------------------------------------------------------
        elif isinstance(item, ast.FunctionDef):
            if item.name == "program":
                step["program"] = body_source(item, lines)
            elif item.name == "solution":
                step["solution"] = source_of(item, lines)
                args = [a.arg for a in item.args.args if a.arg != "self"]
                step["solutionSignature"] = {"name": item.name, "args": args}
            elif item.name == "check":
                step["checkSource"] = source_of(item, lines)

        # --- verschachtelte Klassen (MessageStep, special_messages, tests) ---
        elif isinstance(item, ast.ClassDef) and depth < 2:
            nested_bases = [b.id for b in item.bases if isinstance(b, ast.Name)]
            if set(nested_bases) & STEP_BASES:
                step["messageSteps"].append(parse_step(item, lines, depth + 1))

    if not step["program"]:
        copyable = extract_copyable(step["text"])
        if copyable:
            step["program"] = copyable[0]
            step["programInText"] = True

    return step


def parse_page(node: ast.ClassDef, lines: list[str]) -> dict:
    page: dict = {
        "name": node.name,
        "title": None,
        "finalText": "",
        "steps": [],
    }
    for item in node.body:
        if isinstance(item, ast.Assign) and len(item.targets) == 1 \
                and isinstance(item.targets[0], ast.Name):
            key = item.targets[0].id
            val = literal(item.value)
            if key == "title" and isinstance(val, str):
                page["title"] = val
            elif key == "final_text" and isinstance(val, str):
                page["finalText"] = dedent(val).strip("\n").rstrip()
        elif isinstance(item, ast.ClassDef):
            bases = [b.id for b in item.bases if isinstance(b, ast.Name)]
            if set(bases) & STEP_BASES:
                page["steps"].append(parse_step(item, lines))

    if not page["title"]:
        page["title"] = re.sub(r"(?<!^)(?=[A-Z])", " ", node.name)
    return page


def parse_chapter(path: Path) -> dict:
    source = path.read_text(encoding="utf-8")
    lines = source.split("\n")
    tree = ast.parse(source)

    pages = []
    for node in tree.body:
        if isinstance(node, ast.ClassDef):
            bases = [b.id for b in node.bases if isinstance(b, ast.Name)]
            if "Page" in bases:
                pages.append(parse_page(node, lines))

    stem = path.stem
    slug = re.sub(r"[^a-z0-9]+", "_", stem.lower()).strip("_")
    m = re.match(r"c(\d+)", stem)
    return {
        "id": slug,
        "number": int(m.group(1)) if m else 0,
        "file": path.name,
        "title": re.sub(r"^c\d+_", "", stem).replace("_", " ").strip(),
        "pages": pages,
    }


def main() -> None:
    if not CHAPTERS_DIR.is_dir():
        print(
            "Die futurecoder-Kapitel wurden nicht gefunden.\n"
            f"Gesucht in: {CHAPTERS_DIR}\n\n"
            "Dieses Werkzeug wird nur gebraucht, wenn du Inhalte erneut aus dem\n"
            "Original übernehmen willst. Gib den Pfad zum futurecoder-Ordner an:\n"
            "    PYTHON_INTRO_FUTURECODER=/pfad/zu/futurecoder python3 tools/extract_content.py"
        )
        raise SystemExit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    index = []

    for path in sorted(CHAPTERS_DIR.glob("c*.py")):
        chapter = parse_chapter(path)
        out = OUT_DIR / f"{chapter['id']}.json"
        out.write_text(json.dumps(chapter, indent=2, ensure_ascii=False), encoding="utf-8")

        n_steps = sum(len(p["steps"]) for p in chapter["pages"])
        n_ex = sum(1 for p in chapter["pages"] for s in p["steps"] if s["kind"] == "ExerciseStep")
        index.append({
            "id": chapter["id"],
            "number": chapter["number"],
            "title": chapter["title"],
            "pages": len(chapter["pages"]),
            "steps": n_steps,
            "exercises": n_ex,
        })
        print(f"{chapter['number']:>3}  {len(chapter['pages']):>3} Seiten  "
              f"{n_steps:>4} Steps ({n_ex} Übungen)  {chapter['title']}")

    (OUT_DIR / "_index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nGesamt: {sum(i['steps'] for i in index)} Steps in {len(index)} Kapiteln")
    print(f"Geschrieben nach {OUT_DIR}")


if __name__ == "__main__":
    main()
