"use client";

import { AnimatePresence, motion } from "motion/react";
import { Eye, Lightbulb } from "lucide-react";
import { Markdown } from "./Markdown";

/**
 * Tipps werden einzeln aufgedeckt – so bekommt man genau so viel Hilfe
 * wie nötig und nicht die ganze Lösung auf einmal.
 */
export function HintBox({
  hints,
  revealed,
  onReveal,
  solution,
  solutionShown,
  onShowSolution,
}: {
  hints: string[];
  revealed: number;
  onReveal: () => void;
  solution?: string;
  solutionShown: boolean;
  onShowSolution: () => void;
}) {
  const hasHints = hints.length > 0;
  const allRevealed = revealed >= hints.length;

  if (!hasHints && !solution) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {hints.slice(0, revealed).map((hint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            className="overflow-hidden rounded-xl border border-amber/30 bg-amber/5 px-4 py-3"
          >
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-amber">
              <Lightbulb className="size-3.5" />
              Tipp {index + 1} von {hints.length}
            </div>
            <div className="text-sm text-ink-dim [&_*]:!text-sm">
              <Markdown>{hint}</Markdown>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2">
        {hasHints && !allRevealed && (
          <button
            onClick={onReveal}
            className="flex items-center gap-1.5 rounded-full border border-amber/40 px-4 py-2 text-sm text-amber transition hover:bg-amber/10"
          >
            <Lightbulb className="size-3.5" />
            {revealed === 0 ? "Ich brauche einen Tipp" : "Noch ein Tipp"}
          </button>
        )}

        {solution && allRevealed && !solutionShown && (
          <button
            onClick={onShowSolution}
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-faint transition hover:border-line-bright hover:text-ink-dim"
          >
            <Eye className="size-3.5" />
            Lösung zeigen
          </button>
        )}
      </div>

      {solution && solutionShown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-line bg-surface/50 p-4"
        >
          <p className="mb-2 text-xs text-ink-faint">
            Eine mögliche Lösung – schreib sie ab, aber lies sie vorher Zeile für Zeile durch:
          </p>
          <Markdown>{"```python\n" + solution + "\n```"}</Markdown>
        </motion.div>
      )}
    </div>
  );
}
