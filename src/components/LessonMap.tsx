"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, Lock, Play, Zap } from "lucide-react";

export type MapLesson = {
  id: string;
  title: string;
  summary: string;
  totalSteps: number;
  solvedSteps: number;
  xp: number;
  unlocked: boolean;
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

export function LessonMap({ chapters }: { chapters: MapChapter[] }) {
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
    <div className="space-y-12">
      {chapters.map((chapter, chapterIndex) => {
        const done = chapter.lessons.every((lesson) => lesson.solvedSteps >= lesson.totalSteps);

        return (
          <motion.section
            key={chapter.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: chapterIndex * 0.06 }}
          >
            <div className="mb-5 flex items-center gap-4">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl border text-2xl ${
                  done ? "border-lime/40 bg-lime/10" : "border-line bg-surface"
                }`}
              >
                {done ? "✅" : chapter.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TRACK_COLOR[chapter.track]}`}
                  >
                    {TRACK_LABEL[chapter.track]}
                  </span>
                  <span className="text-xs text-ink-faint">Kapitel {chapter.number}</span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{chapter.title}</h2>
                <p className="text-sm text-ink-dim">{chapter.summary}</p>
              </div>
            </div>

            <div className="relative ml-7 space-y-3 border-l border-dashed border-line pl-8">
              {chapter.lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: MapLesson }) {
  const complete = lesson.solvedSteps >= lesson.totalSteps;
  const started = lesson.solvedSteps > 0 && !complete;
  const percent = lesson.totalSteps ? (lesson.solvedSteps / lesson.totalSteps) * 100 : 0;

  const content = (
    <div
      className={`relative rounded-2xl border p-5 transition ${
        lesson.unlocked
          ? "border-line bg-surface/60 hover:border-neon/50 hover:bg-surface"
          : "border-line/60 bg-surface/20"
      }`}
    >
      {/* Knoten auf der Pfadlinie */}
      <span
        className={`absolute -left-[41px] top-6 flex size-5 items-center justify-center rounded-full border-2 ${
          complete
            ? "border-lime bg-lime"
            : started
              ? "border-neon bg-void"
              : lesson.unlocked
                ? "border-line-bright bg-void"
                : "border-line bg-void"
        }`}
      >
        {complete && <CheckCircle2 className="size-3 text-void" />}
        {started && <span className="size-1.5 rounded-full bg-neon animate-pulse-ring" />}
      </span>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`font-semibold ${lesson.unlocked ? "text-ink" : "text-ink-faint"}`}
          >
            {lesson.title}
          </h3>
          <p className="mt-0.5 text-sm text-ink-dim">{lesson.summary}</p>
        </div>

        {!lesson.unlocked ? (
          <Lock className="mt-1 size-4 shrink-0 text-ink-faint" />
        ) : complete ? (
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
      </div>
    </div>
  );

  if (!lesson.unlocked) {
    return (
      <div title="Schließe zuerst die Lektion davor ab." className="cursor-not-allowed opacity-60">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/lernen/${lesson.id}`} className="block">
      {content}
    </Link>
  );
}
