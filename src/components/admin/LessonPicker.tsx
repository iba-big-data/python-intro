"use client";

import { useMemo, useState, useTransition } from "react";
import { Check, ChevronDown, Loader2, Save } from "lucide-react";
import { motion } from "motion/react";
import { saveLessonSelection } from "@/app/admin/actions";

export type PickerLesson = {
  id: string;
  title: string;
  summary: string;
  steps: number;
  exercises: number;
};

export type PickerChapter = {
  id: string;
  number: number;
  title: string;
  summary: string;
  icon: string;
  track: "basics" | "data" | "project";
  lessons: PickerLesson[];
};

const TRACK_LABEL = {
  basics: "Grundlagen",
  data: "Datenanalyse",
  project: "Projekt",
} as const;

export function LessonPicker({
  courseId,
  chapters,
  initialSelection,
  defaultSelection,
}: {
  courseId: string;
  chapters: PickerChapter[];
  initialSelection: string[];
  /** Die Must-have-Auswahl – Vorgabe für neue Kurse, hier per Klick abrufbar */
  defaultSelection: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelection));
  const [open, setOpen] = useState<Set<string>>(new Set(chapters.map((c) => c.id)));
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(() => {
    const initial = new Set(initialSelection);
    if (initial.size !== selected.size) return true;
    for (const id of selected) if (!initial.has(id)) return true;
    return false;
  }, [selected, initialSelection]);

  const allIds = useMemo(
    () => chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)),
    [chapters],
  );

  /** Welcher der drei Schalter beschreibt die aktuelle Auswahl? */
  const preset: "standard" | "alle" | "leer" | null = useMemo(() => {
    if (selected.size === 0) return "leer";
    if (selected.size === allIds.length) return "alle";
    if (
      selected.size === defaultSelection.length &&
      defaultSelection.every((id) => selected.has(id))
    ) {
      return "standard";
    }
    return null;
  }, [selected, allIds, defaultSelection]);

  function applyPreset(ids: string[]) {
    setSaved(false);
    setSelected(new Set(ids));
  }

  function toggleLesson(id: string) {
    setSaved(false);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleChapter(chapter: PickerChapter) {
    setSaved(false);
    const ids = chapter.lessons.map((lesson) => lesson.id);
    const allOn = ids.every((id) => selected.has(id));
    setSelected((current) => {
      const next = new Set(current);
      ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      await saveLessonSelection(courseId, [...selected]);
      setSaved(true);
    });
  }

  const totalSteps = chapters
    .flatMap((chapter) => chapter.lessons)
    .filter((lesson) => selected.has(lesson.id))
    .reduce((sum, lesson) => sum + lesson.steps, 0);

  return (
    <div>
      <div className="sticky top-[57px] z-20 -mx-6 mb-6 flex items-center justify-between gap-4 border-b border-line bg-void/90 px-6 py-3 backdrop-blur">
        <div className="text-sm">
          <span className="font-semibold text-cyan">{selected.size}</span>
          <span className="text-ink-dim"> Lektionen ausgewählt</span>
          <span className="ml-2 text-xs text-ink-faint">({totalSteps} Aufgaben)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-lg border border-line text-xs">
            {(
              [
                ["standard", "Standard", defaultSelection, "Nur die Must-have-Lektionen"],
                ["alle", "Alle", allIds, "Den kompletten Katalog auswählen"],
                ["leer", "Leeren", [], "Auswahl komplett leeren"],
              ] as const
            ).map(([key, label, ids, hint], position) => (
              <button
                key={key}
                onClick={() => applyPreset([...ids])}
                title={hint}
                aria-pressed={preset === key}
                className={`px-3 py-1.5 transition ${position > 0 ? "border-l border-line" : ""} ${
                  preset === key
                    ? "bg-cyan/15 font-medium text-cyan"
                    : "text-ink-faint hover:bg-surface/60 hover:text-ink-dim"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={save}
            disabled={pending || !dirty}
            className="flex items-center gap-2 rounded-xl bg-cyan px-4 py-2 text-sm font-semibold text-void transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : saved && !dirty ? (
              <Check className="size-3.5" />
            ) : (
              <Save className="size-3.5" />
            )}
            {saved && !dirty ? "Gespeichert" : "Speichern"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {chapters.map((chapter) => {
          const ids = chapter.lessons.map((lesson) => lesson.id);
          const chosen = ids.filter((id) => selected.has(id)).length;
          const isOpen = open.has(chapter.id);

          return (
            <div key={chapter.id} className="overflow-hidden rounded-2xl border border-line">
              <div className="flex items-center gap-3 bg-surface/50 px-4 py-3">
                <button
                  onClick={() => toggleChapter(chapter)}
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                    chosen === ids.length
                      ? "border-cyan bg-cyan text-void"
                      : chosen > 0
                        ? "border-cyan bg-cyan/20"
                        : "border-line-bright hover:border-cyan"
                  }`}
                  title={chosen === ids.length ? "Kapitel abwählen" : "Ganzes Kapitel auswählen"}
                >
                  {chosen === ids.length && <Check className="size-3.5" />}
                  {chosen > 0 && chosen < ids.length && <span className="size-2 rounded-sm bg-cyan" />}
                </button>

                <span className="text-xl">{chapter.icon}</span>

                <button
                  onClick={() =>
                    setOpen((current) => {
                      const next = new Set(current);
                      if (next.has(chapter.id)) next.delete(chapter.id);
                      else next.add(chapter.id);
                      return next;
                    })
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {chapter.number}. {chapter.title}
                    </div>
                    <div className="truncate text-xs text-ink-faint">
                      {TRACK_LABEL[chapter.track]} · {chosen}/{ids.length} Lektionen
                    </div>
                  </div>
                  <ChevronDown
                    className={`ml-auto size-4 shrink-0 text-ink-faint transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="divide-y divide-line border-t border-line"
                >
                  {chapter.lessons.map((lesson) => {
                    const on = selected.has(lesson.id);
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => toggleLesson(lesson.id)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                          on ? "bg-cyan/5" : "hover:bg-surface/40"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded border transition ${
                            on ? "border-cyan bg-cyan text-void" : "border-line-bright"
                          }`}
                          style={{ width: 18, height: 18 }}
                        >
                          {on && <Check className="size-3" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{lesson.title}</span>
                          <span className="block text-xs text-ink-dim">{lesson.summary}</span>
                        </span>
                        <span className="shrink-0 text-[11px] text-ink-faint">
                          {lesson.steps} Aufg.
                          {lesson.exercises > 0 && ` · ${lesson.exercises} Übungen`}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
