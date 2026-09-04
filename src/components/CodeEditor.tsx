"use client";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { EditorView } from "@codemirror/view";
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
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  readOnly?: boolean;
}) {
  const extensions = useMemo(
    () => [
      python(),
      baseTheme,
      EditorView.lineWrapping,
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
      }),
    ],
    [onRun],
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
