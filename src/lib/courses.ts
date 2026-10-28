import { and, asc, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, courseLessons, courses, progress, students } from "@/lib/db/schema";
import type { Course } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth";
import { chapters, getChapterOfLesson, getLesson } from "@/content";
import { stepXp } from "@/content/types";
import type { Chapter, Lesson } from "@/content/types";
import {
  BADGES_BY_ID,
  type BadgeStats,
  levelInfo,
  levelScale,
  todayKey,
  xpAfterHints,
} from "@/lib/gamification";

/** Reihenfolge, in der ein Kapitel im Katalog steht – für stabile Sortierung. */
const catalogOrder = new Map<string, number>();
chapters.forEach((chapter, chapterIndex) => {
  chapter.lessons.forEach((lesson, lessonIndex) => {
    catalogOrder.set(lesson.id, chapterIndex * 1000 + lessonIndex);
  });
});

/**
 * Findet den Kurs zu einem Kennwort – ohne Kursnamen, denn den geben
 * Studierende nicht mehr ein.
 *
 * Die Kennwörter sind gesalzen gehasht, man kann also nicht danach suchen,
 * sondern muss sie der Reihe nach prüfen. Bei der Größenordnung eines
 * Lehrstuhls (eine Handvoll Kurse) ist das nur beim Anmelden spürbar.
 *
 * `includeArchived` ist für die Dublettenprüfung im Admin gedacht: dort soll
 * auch ein pausierter Kurs ein Kennwort blockieren.
 */
export async function findCourseByPassword(
  password: string,
  { includeArchived = false } = {},
): Promise<Course | null> {
  if (!password) return null;

  const candidates = await db
    .select()
    .from(courses)
    .where(includeArchived ? undefined : eq(courses.archived, false));

  for (const course of candidates) {
    if (await verifyPassword(password, course.passwordHash)) return course;
  }
  return null;
}

/** Gibt es den (normalisierten) Namen im Kurs schon – außer bei `exceptId`? */
export async function nicknameTaken(
  courseId: string,
  nicknameKey: string,
  exceptId?: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.courseId, courseId), eq(students.nicknameKey, nicknameKey)))
    .limit(2);
  return rows.some((row) => row.id !== exceptId);
}

export type CourseChapter = Chapter & { lessons: Lesson[] };

/**
 * Die für einen Kurs freigeschalteten Lektionen, nach Kapiteln gruppiert.
 * Lektions-IDs, die es im Katalog nicht (mehr) gibt, werden still übergangen.
 */
export async function getCourseCurriculum(courseId: string): Promise<CourseChapter[]> {
  const rows = await db
    .select()
    .from(courseLessons)
    .where(eq(courseLessons.courseId, courseId))
    .orderBy(asc(courseLessons.position));

  const lessons = rows
    .map((row) => getLesson(row.lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson))
    .sort((a, b) => (catalogOrder.get(a.id) ?? 0) - (catalogOrder.get(b.id) ?? 0));

  const grouped = new Map<string, CourseChapter>();
  for (const lesson of lessons) {
    const chapter = getChapterOfLesson(lesson.id);
    if (!chapter) continue;
    const entry = grouped.get(chapter.id) ?? { ...chapter, lessons: [] };
    entry.lessons.push(lesson);
    grouped.set(chapter.id, entry);
  }

  return [...grouped.values()].sort((a, b) => a.number - b.number);
}

export async function getCourseLessonIds(courseId: string): Promise<string[]> {
  const rows = await db
    .select({ lessonId: courseLessons.lessonId })
    .from(courseLessons)
    .where(eq(courseLessons.courseId, courseId));
  return rows.map((row) => row.lessonId);
}

/** Ersetzt die Lektionsauswahl eines Kurses vollständig. */
export async function setCourseLessons(courseId: string, lessonIds: string[]): Promise<void> {
  const valid = lessonIds.filter((id) => getLesson(id));
  const ordered = [...new Set(valid)].sort(
    (a, b) => (catalogOrder.get(a) ?? 0) - (catalogOrder.get(b) ?? 0),
  );

  await db.transaction(async (tx) => {
    await tx.delete(courseLessons).where(eq(courseLessons.courseId, courseId));
    if (ordered.length === 0) return;
    await tx.insert(courseLessons).values(
      ordered.map((lessonId, position) => ({ courseId, lessonId, position })),
    );
  });
}

/* ------------------------------------------------------------------ *
 *  Kursumfang – Bezugsgröße für die Level-Kurve
 * ------------------------------------------------------------------ */

/** Alle XP, die in den freigeschalteten Lektionen zu holen sind. */
export function curriculumXp(curriculum: CourseChapter[]): number {
  return curriculum.reduce(
    (sum, chapter) =>
      sum +
      chapter.lessons.reduce(
        (lessonSum, lesson) =>
          lessonSum + lesson.steps.reduce((stepSum, step) => stepSum + stepXp(step), 0),
        0,
      ),
    0,
  );
}

/** Streckfaktor der Level-Kurve für diesen Kurs – siehe `levelScale`. */
export async function getCourseLevelScale(courseId: string): Promise<number> {
  return levelScale(curriculumXp(await getCourseCurriculum(courseId)));
}

/* ------------------------------------------------------------------ *
 *  Fortschritt einer studierenden Person
 * ------------------------------------------------------------------ */
export type StepProgress = {
  solved: boolean;
  attempts: number;
  hintsUsed: number;
};

export type StudentOverview = {
  student: typeof students.$inferSelect;
  course: typeof courses.$inferSelect;
  curriculum: CourseChapter[];
  /** Schlüssel: "lessonId::stepId" */
  progressByStep: Record<string, StepProgress>;
  solvedByLesson: Record<string, number>;
  earnedBadges: string[];
  level: ReturnType<typeof levelInfo>;
  /** Streckfaktor der Level-Kurve – der Client rechnet damit weiter */
  levelScale: number;
  /** zuletzt bearbeitete Lektion – der Einstiegspunkt für „weitermachen" */
  lastLessonId: string | null;
};

export async function getStudentOverview(
  studentId: string,
): Promise<StudentOverview | null> {
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  if (!student) return null;

  const [course] = await db.select().from(courses).where(eq(courses.id, student.courseId)).limit(1);
  if (!course) return null;

  const [curriculum, rows, badgeRows, recent] = await Promise.all([
    getCourseCurriculum(course.id),
    db.select().from(progress).where(eq(progress.studentId, studentId)),
    db.select().from(badges).where(eq(badges.studentId, studentId)),
    db
      .select({ lessonId: progress.lessonId })
      .from(progress)
      .where(eq(progress.studentId, studentId))
      .orderBy(desc(progress.updatedAt))
      .limit(1),
  ]);

  const progressByStep: Record<string, StepProgress> = {};
  const solvedByLesson: Record<string, number> = {};

  for (const row of rows) {
    progressByStep[`${row.lessonId}::${row.stepId}`] = {
      solved: row.solved,
      attempts: row.attempts,
      hintsUsed: row.hintsUsed,
    };
    if (row.solved) {
      solvedByLesson[row.lessonId] = (solvedByLesson[row.lessonId] ?? 0) + 1;
    }
  }

  // Nur auf Lektionen zeigen, die auch (noch) zum Kurs gehören.
  const inCourse = new Set(curriculum.flatMap((c) => c.lessons.map((l) => l.id)));
  const lastLessonId =
    recent[0] && inCourse.has(recent[0].lessonId) ? recent[0].lessonId : null;

  const scale = levelScale(curriculumXp(curriculum));

  return {
    student,
    course,
    curriculum,
    progressByStep,
    solvedByLesson,
    // Abzeichen, die es nicht mehr gibt, bleiben als Zeile in der Datenbank
    // stehen. Ungefiltert zählte das Profil sie mit und zeigte „13 von 12
    // freigeschaltet“.
    earnedBadges: badgeRows.map((row) => row.badgeId).filter((id) => BADGES_BY_ID.has(id)),
    level: levelInfo(student.xp, scale),
    levelScale: scale,
    lastLessonId,
  };
}

/** Kennzahlen für die Abzeichen-Prüfung. */
export async function computeBadgeStats(
  studentId: string,
  courseId: string,
  hourOfDay: number,
  today: string = todayKey(),
): Promise<BadgeStats> {
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  const rows = await db.select().from(progress).where(eq(progress.studentId, studentId));
  const curriculum = await getCourseCurriculum(courseId);

  const solvedKeys = new Set(
    rows.filter((row) => row.solved).map((row) => `${row.lessonId}::${row.stepId}`),
  );

  let solvedExercises = 0;
  let noHintSolves = 0;
  let solvedPredictions = 0;
  const hintsByKey = new Map<string, number>(
    rows.map((row) => [`${row.lessonId}::${row.stepId}`, row.hintsUsed]),
  );

  let completedLessons = 0;
  let completedChapters = 0;

  for (const chapter of curriculum) {
    let chapterDone = true;
    for (const lesson of chapter.lessons) {
      const lessonDone = lesson.steps.every((step) => solvedKeys.has(`${lesson.id}::${step.id}`));
      if (lessonDone) completedLessons++;
      else chapterDone = false;

      for (const step of lesson.steps) {
        const key = `${lesson.id}::${step.id}`;
        if (step.kind === "exercise" && solvedKeys.has(key)) {
          solvedExercises++;
          if ((hintsByKey.get(key) ?? 0) === 0) noHintSolves++;
        }
        // Die Rate-Frage sperrt den Ausführen-Knopf, bis sie richtig
        // beantwortet ist – gelöst heißt hier also richtig geraten.
        if (step.kind === "run" && step.prediction && solvedKeys.has(key)) {
          solvedPredictions++;
        }
      }
    }
    if (chapterDone && chapter.lessons.length > 0) completedChapters++;
  }

  return {
    solvedSteps: solvedKeys.size,
    solvedExercises,
    solvedPredictions,
    firstTrySolves: rows.filter((row) => row.solved && row.attempts <= 1).length,
    noHintSolves,
    completedLessons,
    completedChapters,
    streakDays: student?.streakDays ?? 0,
    solvedToday: rows.filter(
      (row) => row.solved && row.solvedAt && todayKey(row.solvedAt) === today,
    ).length,
    hourOfDay,
  };
}

/* ------------------------------------------------------------------ *
 *  Profil
 * ------------------------------------------------------------------ */
export type ProfileStats = {
  badgeStats: BadgeStats;
  /** tatsächlich in diesem Kurs eingesammelte XP (nach Tipp-Abzug) */
  earnedXp: number;
  /** maximal erreichbare XP im freigeschalteten Kurs */
  possibleXp: number;
  solvedSteps: number;
  totalSteps: number;
  totalLessons: number;
  totalChapters: number;
  /**
   * Wo man im Kurs steht, in Prozent – 90 heißt „besser als 90 % der anderen".
   * Bewusst kein Ranglistenplatz: die Zahl motiviert, ohne jemanden
   * namentlich ans Ende einer öffentlichen Liste zu stellen.
   */
  percentile: number | null;
  /** wie viele Personen im Kurs überhaupt schon angefangen haben */
  courseSize: number;
};

export async function getProfileStats(
  studentId: string,
  courseId: string,
): Promise<ProfileStats> {
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  const [rows, curriculum, badgeStats] = await Promise.all([
    db.select().from(progress).where(eq(progress.studentId, studentId)),
    getCourseCurriculum(courseId),
    computeBadgeStats(studentId, courseId, new Date().getHours()),
  ]);

  const byKey = new Map(rows.map((row) => [`${row.lessonId}::${row.stepId}`, row]));

  let earnedXp = 0;
  let possibleXp = 0;
  let solvedSteps = 0;
  let totalSteps = 0;
  let totalLessons = 0;

  for (const chapter of curriculum) {
    for (const lesson of chapter.lessons) {
      totalLessons++;
      for (const step of lesson.steps) {
        totalSteps++;
        const base = stepXp(step);
        possibleXp += base;

        const row = byKey.get(`${lesson.id}::${step.id}`);
        if (row?.solved) {
          solvedSteps++;
          earnedXp += xpAfterHints(base, row.hintsUsed);
        }
      }
    }
  }

  // Perzentil innerhalb des Kurses, nur unter denen, die schon XP gesammelt haben.
  const [{ started = 0 } = {}] = await db
    .select({ started: sql<number>`count(*)::int` })
    .from(students)
    .where(and(eq(students.courseId, courseId), gt(students.xp, 0)));

  const [{ below = 0 } = {}] = await db
    .select({ below: sql<number>`count(*)::int` })
    .from(students)
    .where(
      and(
        eq(students.courseId, courseId),
        gt(students.xp, 0),
        sql`${students.xp} < ${student?.xp ?? 0}`,
      ),
    );

  // Unter fünf aktiven Personen ist ein Perzentil eher entlarvend als hilfreich.
  const percentile =
    started >= 5 && (student?.xp ?? 0) > 0 ? Math.round((below / started) * 100) : null;

  return {
    badgeStats,
    earnedXp,
    possibleXp,
    solvedSteps,
    totalSteps,
    totalLessons,
    totalChapters: curriculum.length,
    percentile,
    courseSize: started,
  };
}

/** Prüft, ob eine Lektion für diesen Kurs überhaupt freigeschaltet ist. */
export async function courseHasLesson(courseId: string, lessonId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: courseLessons.id })
    .from(courseLessons)
    .where(and(eq(courseLessons.courseId, courseId), eq(courseLessons.lessonId, lessonId)))
    .limit(1);
  return Boolean(row);
}
