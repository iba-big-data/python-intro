"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, Play } from "lucide-react";

export type Suggestion = {
  lessonId: string;
  title: string;
  chapterTitle: string;
  solvedSteps: number;
  totalSteps: number;
  minutes: number;
  /** true, wenn hier zuletzt wirklich gearbeitet wurde */
  resumed: boolean;
};

/**
 * Der Einstiegspunkt oben auf dem Lernpfad.
 *
 * Seit alle Lektionen offen sind, braucht die Seite einen Anker – sonst steht
 * man vor 63 gleichwertigen Karten. Die Empfehlung ersetzt die frühere Sperre:
 * sie zeigt, wo es weitergeht, hält aber niemanden auf.
 */
export function ContinueCard({ suggestion }: { suggestion: Suggestion }) {
  const started = suggestion.solvedSteps > 0;
  const percent = suggestion.totalSteps
    ? (suggestion.solvedSteps / suggestion.totalSteps) * 100
    : 0;
  const remaining = Math.max(
    1,
    Math.round(suggestion.minutes * (1 - suggestion.solvedSteps / suggestion.totalSteps)),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <Link
        href={`/lernen/${suggestion.lessonId}`}
        className="group block rounded-2xl border border-neon/40 bg-neon/5 p-5 transition hover:border-neon/70 hover:bg-neon/10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-medium uppercase tracking-wide text-neon">
              {suggestion.resumed && started ? "Zuletzt hier gewesen" : "Vorschlag"}
            </div>
            <h2 className="mt-1 truncate text-lg font-bold tracking-tight">{suggestion.title}</h2>
            <p className="truncate text-sm text-ink-dim">{suggestion.chapterTitle}</p>
          </div>

          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-void">
            <Play className="size-3.5" />
            {started ? "Weiter" : "Starten"}
            <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-neon transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-ink-faint">
            {suggestion.solvedSteps}/{suggestion.totalSteps}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-ink-faint">
            <Clock className="size-3" />
            noch ca. {remaining} Min
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
