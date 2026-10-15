"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, CornerDownLeft, RotateCcw } from "lucide-react";

export type ShellEntry = {
  input: string;
  output: string;
  isError: boolean;
};

const NEWLINE = "\n";

/**
 * Entscheidet, ob eine Eingabe schon vollständig ist.
 *
 * Wie im echten Interpreter: Ein Doppelpunkt am Zeilenende oder eine
 * eingerückte Zeile eröffnen einen Block, der erst mit einer Leerzeile endet.
 */
function isComplete(draft: string): boolean {
  const lines = draft.split(NEWLINE);
  if (lines.length === 1) return !lines[0].trimEnd().endsWith(":");

  const last = lines[lines.length - 1];
  // Leerzeile am Ende schließt den Block ab – so macht es die echte Konsole.
  if (last.trim() === "") return true;
  if (last.trimEnd().endsWith(":")) return false;
  // Noch eingerückt: es geht vermutlich weiter.
  return !/^\s/.test(last);
}

/** Einrückung, mit der die nächste Zeile eines offenen Blocks beginnt. */
function nextIndent(draft: string): string {
  const lines = draft.split(NEWLINE);
  const last = lines[lines.length - 1];
  const indent = (last.match(/^\s*/) ?? [""])[0];
  return last.trimEnd().endsWith(":") ? indent + "    " : indent;
}

/**
 * Interaktive Python-Konsole.
 *
 * Mehrzeilige Eingabe ist ausdrücklich möglich: vorher saß hier ein
 * einzeiliges Eingabefeld, und ein hineinkopierter Dreizeiler wurde beim
 * Einfügen zu einer Zeile zusammengezogen – mit `SyntaxError` als Ergebnis.
 * Als Ausweg blieb nur das Trennen mit Semikolon, was im Testlauf als
 * verwirrend für Neueinsteiger:innen aufgefallen ist.
 *
 * Pfeiltasten hoch/runter blättern durch den Verlauf – genau wie im echten
 * Terminal, aber nur solange die Eingabe einzeilig ist.
 */
export function PythonShell({
  entries,
  onSubmit,
  onReset,
  busy,
  disabled,
}: {
  entries: ShellEntry[];
  onSubmit: (code: string) => void;
  onReset: () => void;
  busy: boolean;
  disabled: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const history = entries.map((entry) => entry.input);
  const lineCount = draft.split(NEWLINE).length;
  const multiline = lineCount > 1;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, busy]);

  function submit() {
    const code = draft.replace(/\s+$/, "");
    if (!code.trim() || busy) return;
    onSubmit(code);
    setDraft("");
    setHistoryIndex(null);
  }

  function handleKey(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      // Umschalt+Enter erzwingt immer eine neue Zeile.
      if (event.shiftKey) return;
      event.preventDefault();
      if (!draft.trim() || busy) return;

      if (isComplete(draft)) {
        submit();
      } else {
        setDraft(draft + NEWLINE + nextIndent(draft));
      }
      return;
    }

    // Im Mehrzeiler gehören die Pfeiltasten zum Navigieren im Text.
    if (multiline) return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setDraft(history[next]);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setDraft("");
      } else {
        setHistoryIndex(next);
        setDraft(history[next]);
      }
    }
  }

  return (
    <div
      className="flex h-full flex-col bg-[#08080f] font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
        <span className="text-[11px] uppercase tracking-wider text-ink-faint">Python-Shell</span>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onReset();
          }}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-ink-faint transition hover:text-ink-dim"
          title="Shell zurücksetzen – alle Variablen werden vergessen"
        >
          <RotateCcw className="size-3" />
          Zurücksetzen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {entries.length === 0 && (
          <p className="text-ink-faint">
            Tippe Python-Code ein und drück Enter. Mehrere Zeilen gehen auch – kaputt geht nichts.
          </p>
        )}

        {entries.map((entry, index) => (
          <div key={index} className="mb-1">
            <div className="flex gap-1.5">
              <ChevronRight className="mt-[3px] size-3.5 shrink-0 text-neon" />
              <span className="whitespace-pre-wrap break-words text-ink">{entry.input}</span>
            </div>
            {entry.output && (
              <pre
                className={`whitespace-pre-wrap break-words pl-5 ${
                  entry.isError ? "text-rose" : "text-cyan"
                }`}
              >
                {entry.output.replace(/\n+$/, "")}
              </pre>
            )}
          </div>
        ))}

        {!disabled && (
          <>
            <div className="flex gap-1.5">
              <ChevronRight className="mt-[3px] size-3.5 shrink-0 text-lime" />
              <textarea
                ref={inputRef}
                value={draft}
                rows={Math.min(lineCount, 12)}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKey}
                disabled={busy}
                spellCheck={false}
                autoComplete="off"
                className="flex-1 resize-none bg-transparent font-mono text-[13px] leading-relaxed text-ink outline-none disabled:opacity-50"
                placeholder={busy ? "läuft …" : ""}
              />
            </div>

            {multiline && (
              <p className="mt-1 flex items-center gap-1.5 pl-5 text-[11px] text-ink-faint">
                <CornerDownLeft className="size-3" />
                Leere Zeile und Enter führt aus. Umschalt+Enter macht immer eine neue Zeile.
              </p>
            )}
          </>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
