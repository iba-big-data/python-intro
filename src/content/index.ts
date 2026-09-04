import type { Chapter, Lesson, Step } from "./types";
import { shell } from "./chapters/01-shell";
import { strings } from "./chapters/02-strings";
import { variablen } from "./chapters/03-variablen";
import { schleifen } from "./chapters/04-schleifen";
import { bedingungen } from "./chapters/05-bedingungen";
import { listen } from "./chapters/06-listen";
import { stringsFortgeschritten } from "./chapters/07-strings-fortgeschritten";
import { funktionen } from "./chapters/08-funktionen";
import { boolescheOperatoren } from "./chapters/09-boolesche-operatoren";
import { numpy } from "./chapters/10-numpy";
import { pandas } from "./chapters/11-pandas";
import { sklearn } from "./chapters/12-sklearn";
import { tictactoe } from "./chapters/13-tictactoe";

/**
 * Zentraler Katalog aller Lerninhalte.
 * Neue Kapitel hier importieren und in die Liste aufnehmen – mehr ist nicht nötig.
 */
export const chapters: Chapter[] = [
  shell,
  strings,
  variablen,
  schleifen,
  bedingungen,
  listen,
  stringsFortgeschritten,
  funktionen,
  boolescheOperatoren,
  numpy,
  pandas,
  sklearn,
  tictactoe,
].sort((a, b) => a.number - b.number);

export const allLessons: Lesson[] = chapters.flatMap((chapter) => chapter.lessons);

const lessonById = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
const chapterByLessonId = new Map(
  chapters.flatMap((chapter) => chapter.lessons.map((lesson) => [lesson.id, chapter] as const)),
);
const chapterById = new Map(chapters.map((chapter) => [chapter.id, chapter]));

export function getLesson(lessonId: string): Lesson | undefined {
  return lessonById.get(lessonId);
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapterById.get(chapterId);
}

export function getChapterOfLesson(lessonId: string): Chapter | undefined {
  return chapterByLessonId.get(lessonId);
}

export function getStep(lessonId: string, stepId: string): Step | undefined {
  return lessonById.get(lessonId)?.steps.find((step) => step.id === stepId);
}

/** Alle gültigen Lektions-IDs – für die Admin-Auswahl und zum Validieren. */
export const lessonIds: string[] = allLessons.map((lesson) => lesson.id);

export const totalSteps = allLessons.reduce((sum, lesson) => sum + lesson.steps.length, 0);

export * from "./types";
