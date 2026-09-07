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

/**
 * Standardauswahl: der Kern, den eine Einführung wirklich braucht.
 *
 * Der volle Katalog ist ein Semester lang. Diese Auswahl streicht rund ein
 * Drittel der Lektionen und die Hälfte der Zeit, ohne ein Thema ganz fallen zu
 * lassen: Was wegfällt, sind Übungsblöcke mit demselben Muster (Kapitel 4 und
 * 10), reiner Nachschlagestoff, Sonderfälle – und das Abschlussprojekt, das als
 * Kür ohnehin nur ganz oder gar nicht sinnvoll ist.
 *
 * Gestrichen heißt nicht gelöscht: im Lehrenden-Bereich holt „Alle" jede
 * Lektion mit einem Klick zurück.
 */
const DEFAULT_SELECTION = [
  // Kapitel 1–3: der Einstieg, praktisch unverändert
  "shell/einstieg",
  "strings/einstieg",
  "strings/addieren",
  "variablen/einfuehrung",
  "variablen/verwenden",
  "variablen/programme",
  "variablen/berechnungen-speichern",
  // Kapitel 4: Schleifen ohne den großen Muster-Übungsblock
  "schleifen/einfuehrung",
  "schleifen/einrueckung",
  "schleifen/erste-uebungen",
  "schleifen/strings-aufbauen",
  // Kapitel 5: vollständig – an Bedingungen ist nichts entbehrlich
  "bedingungen/einfuehrung",
  "bedingungen/verschachteln",
  "bedingungen/nachvollziehen",
  "bedingungen/else",
  "bedingungen/gleichheit",
  "bedingungen/elif",
  "bedingungen/vergleiche",
  // Kapitel 6: Kern der Listen, ohne Drill, Begriffskunde und Sonderfälle
  "listen/einfuehrung",
  "listen/neue-listen",
  "listen/break",
  "listen/index",
  "listen/methoden",
  "listen/mehr-funktionen",
  "listen/hilfe-finden",
  // Kapitel 7: f-Strings ja, Anführungszeichen-Sonderfälle nein
  "strings-fortgeschritten/f-strings",
  // Kapitel 8: definieren, aufrufen, zurückgeben
  "funktionen/definieren",
  "funktionen/verschachteln",
  "funktionen/rueckgabe",
  // Kapitel 9: and, or, not – ohne Vorrang- und Formatierungsfeinheiten
  "boolesche-operatoren/oder",
  "boolesche-operatoren/und",
  "boolesche-operatoren/nicht",
  // Kapitel 10–12: der Datenteil, ohne die beiden großen Übungsblöcke
  "numpy/grundlagen",
  "numpy/fortgeschritten",
  "numpy/matrizen",
  "pandas/grundlagen",
  "pandas/operationen",
  "pandas/echter-datensatz",
  "sklearn/erstes-modell",
];

export const defaultLessonIds: string[] = DEFAULT_SELECTION.filter((id) => lessonById.has(id));

// Wird eine Lektion umbenannt, fällt sie sonst stillschweigend aus der
// Standardauswahl – und niemand merkt es, bis ein Kurs sie vermisst.
if (process.env.NODE_ENV !== "production") {
  const unknown = DEFAULT_SELECTION.filter((id) => !lessonById.has(id));
  if (unknown.length > 0) {
    console.warn(`Standardauswahl kennt unbekannte Lektionen: ${unknown.join(", ")}`);
  }
}

export const totalSteps = allLessons.reduce((sum, lesson) => sum + lesson.steps.length, 0);

export * from "./types";
