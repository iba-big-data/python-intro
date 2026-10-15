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
  /**
   * Überschreibt die XP, die dieser Step wert ist. Ohne Angabe zählt der
   * Standardwert der Step-Art. Gedacht für Ausreißer: eine Aufgabe, die ein
   * ganzes Programm verlangt, ist nicht so viel wert wie ein Dreizeiler.
   */
  xp?: number;
  /**
   * Den Editor mit dem Code des vorherigen Schritts füllen.
   *
   * Für Schritte, die ausdrücklich auf dem vorherigen Programm aufbauen
   * („Häng die folgenden zwei Zeilen an“, „Ändere jetzt `begeistert` zu
   * `False`“, „Der Code bleibt fast gleich“). Ohne das stand dort ein leeres
   * Feld und die Aufgabe war nicht mehr nachvollziehbar – in Kapitel 12 war
   * sie ohne Abtippen des Vorgängercodes gar nicht lösbar.
   *
   * Ein gesetztes `starter` hat Vorrang.
   */
  carryOver?: boolean;
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

/**
 * Wie viel Substanz steckt in einer Übung? Die Musterlösung ist dafür der
 * ehrlichste verfügbare Maßstab: ein Einzeiler und eine komplette Spielschleife
 * waren vorher beide 40 XP wert, was das ganze System entwertet hat.
 */
function exerciseXp(step: ExerciseStep): number {
  const lines = step.solution
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0).length;

  if (lines <= 2) return 20;
  if (lines <= 9) return 40;
  if (lines <= 19) return 70;
  if (lines <= 34) return 100;
  return 140;
}

/** Standard-XP je Step-Art – Übungen sind mehr wert als Lesen. */
function defaultStepXp(step: Step): number {
  switch (step.kind) {
    case "read":
      return 5;
    case "run":
      return step.prediction ? 20 : 10;
    case "experiment":
      return 15;
    case "exercise":
      return exerciseXp(step);
  }
}

/** XP-Wert eines Steps – `step.xp` schlägt den Standard der Step-Art. */
export function stepXp(step: Step): number {
  return step.xp ?? defaultStepXp(step);
}

export function lessonXp(lesson: Lesson): number {
  return lesson.steps.reduce((sum, s) => sum + stepXp(s), 0);
}

/**
 * Grobe Schätzung, wie lange eine Lektion dauert – damit sich eine Lernsession
 * planen lässt. Die Minutenwerte kommen aus Beobachtung, nicht aus Messung:
 * Lesen geht schnell, eine echte Aufgabe kostet ein Vielfaches davon.
 */
const MINUTES_PER_KIND: Record<Step["kind"], number> = {
  read: 1,
  run: 2,
  experiment: 3,
  exercise: 8,
};

/**
 * Die Rohwerte oben lagen durchweg zu hoch.
 *
 * Eine Studentin hat jede Lektion gestoppt: 510 Minuten veranschlagt gegenüber
 * 175 Minuten tatsächlich, also Faktor 2,9 – und das gleichmäßig über alle
 * zwölf Kapitel. Eine zweite Rückmeldung bestätigt die Richtung für Kapitel 2.
 *
 * Trotzdem wird hier nicht durch 2,9 geteilt, sondern durch 1,5: beide
 * Messungen stammen von schnellen Personen, und eine Schätzung, die niemand
 * einhält, demotiviert in die andere Richtung. Der Wert ist bewusst
 * konservativ und darf nachgezogen werden, wenn mehr Messungen vorliegen.
 */
const PACE_FACTOR = 1.5;

export function lessonMinutes(lesson: Lesson): number {
  const raw = lesson.steps.reduce((sum, step) => sum + MINUTES_PER_KIND[step.kind], 0);
  // auf 5 Minuten runden – eine Schätzung soll nicht nach Stoppuhr aussehen
  return Math.max(5, Math.round(raw / PACE_FACTOR / 5) * 5);
}

/** Vollständige Step-ID (eindeutig über alle Lektionen hinweg) */
export function stepKey(lessonId: string, stepId: string): string {
  return `${lessonId}::${stepId}`;
}
