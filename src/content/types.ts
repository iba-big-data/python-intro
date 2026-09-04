/**
 * Datenmodell der Lerninhalte.
 *
 * Ein Kapitel bündelt Lektionen, eine Lektion besteht aus Steps.
 * Ein Step ist immer erst dann abgeschlossen, wenn seine Prüfung erfüllt ist –
 * dadurch bleibt der Kurs durchgehend interaktiv statt nur lesbar.
 */

/** Wo der Code eingegeben wird */
export type Surface = "shell" | "editor";

/** Multiple-Choice-Frage: „Was gibt dieses Programm aus?“ */
export type Prediction = {
  choices: string[];
  correctIndex: number;
};

export type StepCommon = {
  id: string;
  /** Lektionstext in Markdown (deutsch) */
  text: string;
  /** kurze Erinnerung, was zu tun ist – erscheint über dem Editor */
  task?: string;
};

/** Nur lesen, mit „Weiter“ bestätigen. */
export type ReadStep = StepCommon & {
  kind: "read";
};

/** Vorgegebenes Programm eintippen bzw. ausführen. */
export type RunStep = StepCommon & {
  kind: "run";
  program: string;
  surface: Surface;
  /** Programm im Lektionstext anzeigen (Standard: true) */
  showProgram?: boolean;
  /** Ausgabe vorher raten lassen */
  prediction?: Prediction;
  /**
   * Das Programm soll absichtlich einen Fehler auslösen – etwa um zu zeigen,
   * wie eine falsche Einrückung aussieht. Der Step gilt trotzdem als gelöst.
   */
  expectsError?: boolean;
  /**
   * Vorbelegte Antworten für `input()`. Der Browser kann keine echte Konsole
   * anbieten, deshalb legt die Lektion die Eingaben vorher fest – sie werden
   * beim Ausführen mit ausgegeben, damit der Ablauf nachvollziehbar bleibt.
   */
  stdin?: string[];
};

/** Freies Experimentieren mit einer Bedingung. */
export type ExperimentStep = StepCommon & {
  kind: "experiment";
  surface: Surface;
  /** Beispielprogramm, das die Bedingung erfüllt (für „Lösung zeigen“) */
  example?: string;
  /** Python-AST-Knoten, die im Code vorkommen müssen, z. B. ["For", "Mult"] */
  requireAst?: string[];
  /** eigene Rückmeldung, wenn requireAst nicht erfüllt ist */
  astMessage?: string;
  /** Ausgabe muss diesen Text enthalten */
  requireOutput?: string;
  /** eine Variable muss angelegt worden sein – inklusive Typprüfung */
  requireVariable?: {
    name: string;
    type?: "str" | "int" | "float" | "list" | "bool" | "dict";
    nonEmpty?: boolean;
    noLeadingSpace?: boolean;
    /** verhindert, dass einfach der Beispielwert übernommen wird */
    notEqualTo?: unknown;
  };
  /** genügt es, dass der Code fehlerfrei läuft? */
  anyValidCode?: boolean;
  hints?: string[];
};

export type TestCase = {
  args: unknown[];
  /** erwartete Ausgabe (mode "stdout") oder Rückgabewert (mode "return") */
  expected: unknown;
  /** vorbelegte Antworten für `input()`, in der Reihenfolge der Abfragen */
  stdin?: string[];
};

/** Echte Programmieraufgabe, die gegen Testfälle geprüft wird. */
export type ExerciseStep = StepCommon & {
  kind: "exercise";
  hints: string[];
  /** vollständige Musterlösung */
  solution: string;
  /**
   * Funktionsaufgabe: Name und Parameter der zu schreibenden Funktion.
   * Fehlt das Feld, schreibt die Studierende ein Skript, dessen Variablen
   * (params) vorbelegt werden und dessen Ausgabe geprüft wird.
   */
  functionName?: string;
  params: string[];
  tests: TestCase[];
  /** wird die Ausgabe (print) oder der Rückgabewert geprüft? */
  mode: "stdout" | "return";
  /** Startcode im Editor */
  starter?: string;
  /** verbotene Konstrukte, z. B. ["Break"] – erzwingt die gewünschte Technik */
  disallowedAst?: { nodes: string[]; message: string };
};

export type Step = ReadStep | RunStep | ExperimentStep | ExerciseStep;

export type Lesson = {
  id: string;
  title: string;
  /** Ein-Satz-Teaser für die Lernpfad-Karte */
  summary: string;
  steps: Step[];
  /** Abschlusstext nach dem letzten Step */
  outro: string;
};

export type Chapter = {
  id: string;
  number: number;
  title: string;
  /** Kurzbeschreibung für Admin-Auswahl und Lernpfad */
  summary: string;
  /** Emoji als visueller Anker */
  icon: string;
  track: "basics" | "data" | "project";
  lessons: Lesson[];
};

/* ------------------------------------------------------------------ *
 *  Hilfsfunktionen
 * ------------------------------------------------------------------ */

/** XP-Wert eines Steps – Übungen sind mehr wert als Lesen. */
export function stepXp(step: Step): number {
  switch (step.kind) {
    case "read":
      return 5;
    case "run":
      return step.prediction ? 20 : 10;
    case "experiment":
      return 15;
    case "exercise":
      return 40;
  }
}

export function lessonXp(lesson: Lesson): number {
  return lesson.steps.reduce((sum, s) => sum + stepXp(s), 0);
}

/** Vollständige Step-ID (eindeutig über alle Lektionen hinweg) */
export function stepKey(lessonId: string, stepId: string): string {
  return `${lessonId}::${stepId}`;
}
