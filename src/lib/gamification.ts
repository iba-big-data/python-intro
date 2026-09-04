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
};

export const BADGES: BadgeDefinition[] = [
  {
    id: "erste-zeile",
    name: "Erste Zeile",
    description: "Du hast deine erste Aufgabe gelöst.",
    icon: "🌱",
    earned: (s) => s.solvedSteps >= 1,
  },
  {
    id: "warmgelaufen",
    name: "Warmgelaufen",
    description: "10 Aufgaben geschafft.",
    icon: "🔥",
    earned: (s) => s.solvedSteps >= 10,
  },
  {
    id: "halbmarathon",
    name: "Halbmarathon",
    description: "50 Aufgaben geschafft.",
    icon: "🏃",
    earned: (s) => s.solvedSteps >= 50,
  },
  {
    id: "hundert",
    name: "Dreistellig",
    description: "100 Aufgaben geschafft.",
    icon: "💯",
    earned: (s) => s.solvedSteps >= 100,
  },
  {
    id: "erste-lektion",
    name: "Kapitel eins",
    description: "Deine erste Lektion vollständig abgeschlossen.",
    icon: "📗",
    earned: (s) => s.completedLessons >= 1,
  },
  {
    id: "kapitelmeister",
    name: "Kapitelmeister",
    description: "Ein komplettes Kapitel durchgezogen.",
    icon: "🏅",
    earned: (s) => s.completedChapters >= 1,
  },
  {
    id: "durchmarsch",
    name: "Durchmarsch",
    description: "Fünf Kapitel abgeschlossen.",
    icon: "🎖️",
    earned: (s) => s.completedChapters >= 5,
  },
  {
    id: "treffer",
    name: "Volltreffer",
    description: "10 Aufgaben im ersten Versuch gelöst.",
    icon: "🎯",
    earned: (s) => s.firstTrySolves >= 10,
  },
  {
    id: "eigenstaendig",
    name: "Ohne Netz",
    description: "10 Übungen ganz ohne Tipp gelöst.",
    icon: "🧠",
    earned: (s) => s.noHintSolves >= 10,
  },
  {
    id: "problemloeserin",
    name: "Problemlöser:in",
    description: "25 echte Programmieraufgaben gemeistert.",
    icon: "🛠️",
    earned: (s) => s.solvedExercises >= 25,
  },
  {
    id: "streak-3",
    name: "Dranbleiber",
    description: "Drei Tage in Folge gelernt.",
    icon: "⚡",
    earned: (s) => s.streakDays >= 3,
  },
  {
    id: "streak-7",
    name: "Woche durchgezogen",
    description: "Sieben Tage in Folge gelernt.",
    icon: "🌟",
    earned: (s) => s.streakDays >= 7,
  },
  {
    id: "streak-30",
    name: "Unaufhaltsam",
    description: "30 Tage in Folge gelernt.",
    icon: "👑",
    earned: (s) => s.streakDays >= 30,
  },
  {
    id: "sprint",
    name: "Sprint",
    description: "20 Aufgaben an einem einzigen Tag.",
    icon: "🚀",
    earned: (s) => s.solvedToday >= 20,
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
export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Neue Streak-Länge nach einer gelösten Aufgabe. */
export function nextStreak(lastDay: string | null, current: number, today = todayKey()): number {
  if (lastDay === today) return Math.max(current, 1);
  if (!lastDay) return 1;

  const yesterday = new Date(Date.parse(today) - 86_400_000).toISOString().slice(0, 10);
  return lastDay === yesterday ? current + 1 : 1;
}
