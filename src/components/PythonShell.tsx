"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";

export type ShellEntry = {
  input: string;
  output: string;
  isError: boolean;
};

/**
 * Interaktive Python-Konsole.
 * Pfeiltasten hoch/runter blättern durch den Verlauf – genau wie im echten Terminal.
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
  const inputRef = useRef<HTMLInputElement>(null);

  const history = entries.map((entry) => entry.input);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, busy]);

  function handleKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && draft.trim() && !busy) {
      onSubmit(draft);
      setDraft("");
      setHistoryIndex(null);
      return;
    }

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
            Tippe Python-Code ein und drück Enter. Probier ruhig herum – kaputt geht nichts.
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
          <div className="flex gap-1.5">
            <ChevronRight className="mt-[3px] size-3.5 shrink-0 text-lime" />
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKey}
              disabled={busy}
              spellCheck={false}
              autoComplete="off"
              className="flex-1 bg-transparent text-ink outline-none disabled:opacity-50"
              placeholder={busy ? "läuft …" : ""}
            />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
