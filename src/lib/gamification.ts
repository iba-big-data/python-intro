/**
 * XP, Level und Abzeichen.
 *
 * Die Kurve ist bewusst flach am Anfang: die ersten Level kommen schnell,
 * damit sich der Einstieg belohnend anfühlt, und ziehen dann sanft an.
 */

export const LEVEL_TITLES = [
  "Hello World",
  "Erste Zeilen",
  "Schleifendreher",
  "Bug-Jäger",
  "Logik-Lotse",
  "Listenmeister",
  "String-Schmied",
  "Funktionsarchitekt",
  "Datenflüsterer",
  "Code-Alchemist",
  "Python-Pilot",
  "Algorithmus-Wanderin",
  "Refactor-Ritter",
  "Compiler-Charmeur",
  "Legende der Laufzeit",
];

/** Gesamt-XP, die für das Erreichen von Level n nötig sind. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return 120 * n + 40 * n * n;
}

export type LevelInfo = {
  level: number;
  title: string;
  xp: number;
  /** XP innerhalb des aktuellen Levels */
  intoLevel: number;
  /** XP-Bedarf für dieses Level insgesamt */
  levelSpan: number;
  /** 0 … 1 */
  progress: number;
  nextTitle: string | null;
};

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;

  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;

  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xp,
    intoLevel: xp - base,
    levelSpan: span,
    progress: span > 0 ? (xp - base) / span : 1,
    nextTitle: level < LEVEL_TITLES.length ? LEVEL_TITLES[level] : null,
  };
}

/* ------------------------------------------------------------------ *
 *  XP-Abzug für Tipps
 * ------------------------------------------------------------------ */

/**
 * Tipps kosten XP – aber gestaffelt statt pauschal.
 *
 * Vorher kostete der erste Tipp genauso viel wie der neunte (pauschal 25 %).
 * Das hat bestraft, wer einmal kurz nachschaut, und niemanden gebremst, der
 * sich durchreichen lässt. Jetzt kostet jeder Tipp 10 %, gedeckelt bei 50 %:
 * Hilfe bleibt bezahlbar, aber sie summiert sich spürbar.
 */
export const HINT_COST = 0.1;
export const MAX_HINT_PENALTY = 0.5;

export function xpAfterHints(baseXp: number, hintsUsed: number): number {
  const penalty = Math.min(MAX_HINT_PENALTY, Math.max(0, hintsUsed) * HINT_COST);
  return Math.max(2, Math.round(baseXp * (1 - penalty)));
}

/* ------------------------------------------------------------------ *
 *  Abzeichen
 * ------------------------------------------------------------------ */
export type BadgeStats = {
  /** insgesamt gelöste Steps */
  solvedSteps: number;
  /** gelöste Übungen (kind === "exercise") */
  solvedExercises: number;
  /** im ersten Versuch gelöst */
  firstTrySolves: number;
  /** Übungen ohne einen einzigen Tipp gelöst */
  noHintSolves: number;
  /** vollständig abgeschlossene Lektionen */
  completedLessons: number;
  /** vollständig abgeschlossene Kapitel */
  completedChapters: number;
  /** aktuelle Streak in Tagen */
  streakDays: number;
  /** heute gelöste Steps */
  solvedToday: number;
  /** Stunde der letzten Lösung, 0–23 (Ortszeit der Studierenden) */
  hourOfDay: number;
};

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** "secret" wird erst nach dem Freischalten angezeigt */
  secret?: boolean;
  earned: (stats: BadgeStats) => boolean;
  /**
   * Woran man ablesen kann, wie weit man ist – z. B. 7 von 10.
   * Ohne dieses Feld ist das Abzeichen ein reines Ja/Nein (etwa die
   * Uhrzeit-Abzeichen, bei denen ein Fortschrittsbalken keinen Sinn ergäbe).
   */
  goal?: { target: number; current: (stats: BadgeStats) => number; unit: string };
};

export const BADGES: BadgeDefinition[] = [
  {
    id: "erste-zeile",
    name: "Erste Zeile",
    description: "Du hast deine erste Aufgabe gelöst.",
    icon: "🌱",
    earned: (s) => s.solvedSteps >= 1,
    goal: { target: 1, current: (s) => s.solvedSteps, unit: "Aufgaben" },
  },
  {
    id: "warmgelaufen",
    name: "Warmgelaufen",
    description: "10 Aufgaben geschafft.",
    icon: "🔥",
    earned: (s) => s.solvedSteps >= 10,
    goal: { target: 10, current: (s) => s.solvedSteps, unit: "Aufgaben" },
  },
  {
    id: "halbmarathon",
    name: "Halbmarathon",
    description: "50 Aufgaben geschafft.",
    icon: "🏃",
    earned: (s) => s.solvedSteps >= 50,
    goal: { target: 50, current: (s) => s.solvedSteps, unit: "Aufgaben" },
  },
  {
    id: "hundert",
    name: "Dreistellig",
    description: "100 Aufgaben geschafft.",
    icon: "💯",
    earned: (s) => s.solvedSteps >= 100,
    goal: { target: 100, current: (s) => s.solvedSteps, unit: "Aufgaben" },
  },
  {
    id: "erste-lektion",
    name: "Kapitel eins",
    description: "Deine erste Lektion vollständig abgeschlossen.",
    icon: "📗",
    earned: (s) => s.completedLessons >= 1,
    goal: { target: 1, current: (s) => s.completedLessons, unit: "Lektionen" },
  },
  {
    id: "kapitelmeister",
    name: "Kapitelmeister",
    description: "Ein komplettes Kapitel durchgezogen.",
    icon: "🏅",
    earned: (s) => s.completedChapters >= 1,
    goal: { target: 1, current: (s) => s.completedChapters, unit: "Kapitel" },
  },
  {
    id: "durchmarsch",
    name: "Durchmarsch",
    description: "Fünf Kapitel abgeschlossen.",
    icon: "🎖️",
    earned: (s) => s.completedChapters >= 5,
    goal: { target: 5, current: (s) => s.completedChapters, unit: "Kapitel" },
  },
  {
    id: "treffer",
    name: "Volltreffer",
    description: "10 Aufgaben im ersten Versuch gelöst.",
    icon: "🎯",
    earned: (s) => s.firstTrySolves >= 10,
    goal: { target: 10, current: (s) => s.firstTrySolves, unit: "Treffer" },
  },
  {
    id: "eigenstaendig",
    name: "Ohne Netz",
    description: "10 Übungen ganz ohne Tipp gelöst.",
    icon: "🧠",
    earned: (s) => s.noHintSolves >= 10,
    goal: { target: 10, current: (s) => s.noHintSolves, unit: "Übungen" },
  },
  {
    id: "problemloeserin",
    name: "Problemlöser:in",
    description: "25 echte Programmieraufgaben gemeistert.",
    icon: "🛠️",
    earned: (s) => s.solvedExercises >= 25,
    goal: { target: 25, current: (s) => s.solvedExercises, unit: "Aufgaben" },
  },
  {
    id: "streak-3",
    name: "Dranbleiber",
    description: "Drei Tage in Folge gelernt.",
    icon: "⚡",
    earned: (s) => s.streakDays >= 3,
    goal: { target: 3, current: (s) => s.streakDays, unit: "Tage" },
  },
  {
    id: "streak-7",
    name: "Woche durchgezogen",
    description: "Sieben Tage in Folge gelernt.",
    icon: "🌟",
    earned: (s) => s.streakDays >= 7,
    goal: { target: 7, current: (s) => s.streakDays, unit: "Tage" },
  },
  {
    id: "streak-30",
    name: "Unaufhaltsam",
    description: "30 Tage in Folge gelernt.",
    icon: "👑",
    earned: (s) => s.streakDays >= 30,
    goal: { target: 30, current: (s) => s.streakDays, unit: "Tage" },
  },
  {
    id: "sprint",
    name: "Sprint",
    description: "20 Aufgaben an einem einzigen Tag.",
    icon: "🚀",
    earned: (s) => s.solvedToday >= 20,
    goal: { target: 20, current: (s) => s.solvedToday, unit: "heute" },
  },
  {
    id: "nachteule",
    name: "Nachteule",
    description: "Nach Mitternacht programmiert.",
    icon: "🦉",
    secret: true,
    earned: (s) => s.hourOfDay >= 0 && s.hourOfDay < 5 && s.solvedSteps >= 1,
  },
  {
    id: "fruehaufsteher",
    name: "Früher Vogel",
    description: "Vor 7 Uhr morgens programmiert.",
    icon: "🐦",
    secret: true,
    earned: (s) => s.hourOfDay >= 5 && s.hourOfDay < 7 && s.solvedSteps >= 1,
  },
];

export const BADGES_BY_ID = new Map(BADGES.map((badge) => [badge.id, badge]));

/** Liefert die IDs aller Abzeichen, die mit diesen Werten (neu) verdient sind. */
export function earnedBadgeIds(stats: BadgeStats): string[] {
  return BADGES.filter((badge) => badge.earned(stats)).map((badge) => badge.id);
}

/* ------------------------------------------------------------------ *
 *  Streak
 * ------------------------------------------------------------------ */
/**
 * Tagesschlüssel in **Ortszeit**, nicht in UTC.
 *
 * `toISOString()` hätte für alle östlich von Greenwich den Tageswechsel
 * verschoben: Wer um 01:00 MESZ eine Aufgabe löst, wäre auf den Vortag
 * gebucht worden – ausgerechnet die Zielgruppe des „Nachteule"-Abzeichens.
 */
export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Neue Streak-Länge nach einer gelösten Aufgabe. */
export function nextStreak(lastDay: string | null, current: number, today = todayKey()): number {
  if (lastDay === today) return Math.max(current, 1);
  if (!lastDay) return 1;

  // Über den Mittag rechnen, damit die Sommerzeitumstellung (23- bzw. 25-Stunden-
  // Tage) den Vortag nicht um einen Tag verfehlt.
  const noon = new Date(`${today}T12:00:00`);
  const yesterday = todayKey(new Date(noon.getTime() - 86_400_000));
  return lastDay === yesterday ? current + 1 : 1;
}
