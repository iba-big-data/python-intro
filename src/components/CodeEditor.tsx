"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, keymap } from "@codemirror/view";
import { githubDark } from "@uiw/codemirror-theme-github";
import { useMemo } from "react";

const baseTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", height: "100%" },
  ".cm-content": { padding: "12px 0", caretColor: "#22d3ee" },
  ".cm-line": { padding: "0 12px" },
});

export function CodeEditor({
  value,
  onChange,
  onRun,
  onPaste,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  /** Meldung, dass Code eingefügt wurde – für den Tipp „lieber selbst tippen“ */
  onPaste?: (text: string) => void;
  readOnly?: boolean;
}) {
  const extensions = useMemo(
    () => [
      python(),
      baseTheme,
      EditorView.lineWrapping,
      // Vier Leerzeichen, nicht die zwei aus der CodeMirror-Voreinstellung:
      // alle Codebeispiele im Kurs sind mit vier eingerückt, und PEP 8 auch.
      indentUnit.of("    "),
      // Damit rückt auch die Tab-Taste um vier ein statt um zwei.
      keymap.of([indentWithTab]),
      // Strg/Cmd + Enter führt aus, ohne die Maus zu brauchen
      EditorView.domEventHandlers({
        keydown: (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            onRun();
            return true;
          }
          return false;
        },
        paste: (event) => {
          const text = event.clipboardData?.getData("text") ?? "";
          if (text.trim()) onPaste?.(text);
          // Einfügen bleibt erlaubt – es gibt nur einen Hinweis dazu.
          return false;
        },
      }),
    ],
    [onRun, onPaste],
  );

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={githubDark}
      extensions={extensions}
      readOnly={readOnly}
      height="100%"
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: false,
        searchKeymap: false,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
      }}
      className="h-full text-sm"
    />
  );
}
