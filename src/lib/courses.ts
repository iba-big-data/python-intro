import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, courseLessons, courses, progress, students } from "@/lib/db/schema";
import { chapters, getChapterOfLesson, getLesson } from "@/content";
import type { Chapter, Lesson } from "@/content/types";
import { type BadgeStats, levelInfo } from "@/lib/gamification";

/** Reihenfolge, in der ein Kapitel im Katalog steht – für stabile Sortierung. */
const catalogOrder = new Map<string, number>();
chapters.forEach((chapter, chapterIndex) => {
  chapter.lessons.forEach((lesson, lessonIndex) => {
    catalogOrder.set(lesson.id, chapterIndex * 1000 + lessonIndex);
  });
});

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
};

export async function getStudentOverview(
  studentId: string,
): Promise<StudentOverview | null> {
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  if (!student) return null;

  const [course] = await db.select().from(courses).where(eq(courses.id, student.courseId)).limit(1);
  if (!course) return null;

  const [curriculum, rows, badgeRows] = await Promise.all([
    getCourseCurriculum(course.id),
    db.select().from(progress).where(eq(progress.studentId, studentId)),
    db.select().from(badges).where(eq(badges.studentId, studentId)),
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

  return {
    student,
    course,
    curriculum,
    progressByStep,
    solvedByLesson,
    earnedBadges: badgeRows.map((row) => row.badgeId),
    level: levelInfo(student.xp),
  };
}

/** Kennzahlen für die Abzeichen-Prüfung. */
export async function computeBadgeStats(
  studentId: string,
  courseId: string,
  hourOfDay: number,
): Promise<BadgeStats> {
  const [student] = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  const rows = await db.select().from(progress).where(eq(progress.studentId, studentId));
  const curriculum = await getCourseCurriculum(courseId);

  const solvedKeys = new Set(
    rows.filter((row) => row.solved).map((row) => `${row.lessonId}::${row.stepId}`),
  );

  let solvedExercises = 0;
  let noHintSolves = 0;
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
      }
    }
    if (chapterDone && chapter.lessons.length > 0) completedChapters++;
  }

  const today = new Date().toISOString().slice(0, 10);

  return {
    solvedSteps: solvedKeys.size,
    solvedExercises,
    firstTrySolves: rows.filter((row) => row.solved && row.attempts <= 1).length,
    noHintSolves,
    completedLessons,
    completedChapters,
    streakDays: student?.streakDays ?? 0,
    solvedToday: rows.filter(
      (row) => row.solved && row.solvedAt && row.solvedAt.toISOString().slice(0, 10) === today,
    ).length,
    hourOfDay,
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
