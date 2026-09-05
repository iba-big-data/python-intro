"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, ChevronDown, Clock, Play, Zap } from "lucide-react";

export type MapLesson = {
  id: string;
  title: string;
  summary: string;
  totalSteps: number;
  solvedSteps: number;
  xp: number;
  /** grobe Dauer in Minuten – damit sich eine Lernsession planen lässt */
  minutes: number;
};

export type MapChapter = {
  id: string;
  number: number;
  title: string;
  summary: string;
  icon: string;
  track: "basics" | "data" | "project";
  lessons: MapLesson[];
};

const TRACK_LABEL: Record<MapChapter["track"], string> = {
  basics: "Grundlagen",
  data: "Datenanalyse",
  project: "Projekt",
};

const TRACK_COLOR: Record<MapChapter["track"], string> = {
  basics: "text-neon border-neon/30 bg-neon/10",
  data: "text-cyan border-cyan/30 bg-cyan/10",
  project: "text-amber border-amber/30 bg-amber/10",
};

export function LessonMap({
  chapters,
  currentLessonId = null,
}: {
  chapters: MapChapter[];
  /** Lektion, die oben als „weiter hier" vorgeschlagen wird */
  currentLessonId?: string | null;
}) {
  if (chapters.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <div className="mb-3 text-4xl">🌱</div>
        <h2 className="text-lg font-semibold">Noch keine Lektionen freigeschaltet</h2>
        <p className="mt-2 text-sm text-ink-dim">
          Deine Lehrperson hat für diesen Kurs noch keine Inhalte ausgewählt. Schau später nochmal
          vorbei.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chapters.map((chapter, chapterIndex) => (
        <ChapterSection
          key={chapter.id}
          chapter={chapter}
          index={chapterIndex}
          currentLessonId={currentLessonId}
        />
      ))}
    </div>
  );
}

function ChapterSection({
  chapter,
  index,
  currentLessonId,
}: {
  chapter: MapChapter;
  index: number;
  currentLessonId: string | null;
}) {
  const done = chapter.lessons.every((lesson) => lesson.solvedSteps >= lesson.totalSteps);
  const solved = chapter.lessons.reduce((sum, lesson) => sum + lesson.solvedSteps, 0);
  const total = chapter.lessons.reduce((sum, lesson) => sum + lesson.totalSteps, 0);
  const minutes = chapter.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0);
  const holdsCurrent = chapter.lessons.some((lesson) => lesson.id === currentLessonId);

  // Fertige Kapitel starten eingeklappt – bei 13 Kapiteln ist die Seite sonst
  // eine endlose Kette, in der man das Aktuelle nicht wiederfindet.
  const [open, setOpen] = useState(!done || holdsCurrent);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04 }}
    >
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 rounded-2xl p-1 text-left transition hover:bg-surface/40"
      >
        <div
          className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border text-2xl ${
            done ? "border-lime/40 bg-lime/10" : "border-line bg-surface"
          }`}
        >
          {done ? "✅" : chapter.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TRACK_COLOR[chapter.track]}`}
            >
              {TRACK_LABEL[chapter.track]}
            </span>
            <span className="text-xs text-ink-faint">Kapitel {chapter.number}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">{chapter.title}</h2>
          <p className="truncate text-sm text-ink-dim">{chapter.summary}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 pr-2">
          <div className="hidden text-right sm:block">
            <div className="text-xs tabular-nums text-ink-dim">
              {solved}/{total} Aufgaben
            </div>
            <div className="flex items-center justify-end gap-1 text-[11px] text-ink-faint">
              <Clock className="size-3" />
              ca. {minutes} Min
            </div>
          </div>
          <ChevronDown
            className={`size-4 text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="relative ml-7 mt-4 space-y-3 border-l border-dashed border-line pl-8">
          {chapter.lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCurrent={lesson.id === currentLessonId}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}

function LessonCard({ lesson, isCurrent }: { lesson: MapLesson; isCurrent: boolean }) {
  const complete = lesson.solvedSteps >= lesson.totalSteps;
  const started = lesson.solvedSteps > 0 && !complete;
  const percent = lesson.totalSteps ? (lesson.solvedSteps / lesson.totalSteps) * 100 : 0;

  return (
    <Link href={`/lernen/${lesson.id}`} className="block">
      <div
        className={`relative rounded-2xl border p-5 transition ${
          isCurrent
            ? "border-neon/60 bg-neon/5 hover:bg-neon/10"
            : "border-line bg-surface/60 hover:border-neon/50 hover:bg-surface"
        }`}
      >
        {/* Knoten auf der Pfadlinie */}
        <span
          className={`absolute -left-[41px] top-6 flex size-5 items-center justify-center rounded-full border-2 ${
            complete
              ? "border-lime bg-lime"
              : started
                ? "border-neon bg-void"
                : "border-line-bright bg-void"
          }`}
        >
          {complete && <CheckCircle2 className="size-3 text-void" />}
          {started && <span className="size-1.5 rounded-full bg-neon animate-pulse-ring" />}
        </span>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-ink">{lesson.title}</h3>
            <p className="mt-0.5 text-sm text-ink-dim">{lesson.summary}</p>
          </div>

          {complete ? (
            <span className="shrink-0 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-medium text-lime">
              fertig
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-neon/15 px-3 py-1.5 text-xs font-medium text-neon">
              <Play className="size-3" />
              {started ? "weiter" : "starten"}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className={`h-full rounded-full transition-all ${complete ? "bg-lime" : "bg-neon"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-ink-faint">
            {lesson.solvedSteps}/{lesson.totalSteps}
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-ink-faint">
            <Zap className="size-3" />
            {lesson.xp}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-ink-faint">
            <Clock className="size-3" />
            {lesson.minutes} Min
          </span>
        </div>
      </div>
    </Link>
  );
}
