import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { progress, students } from "@/lib/db/schema";
import { getCourseCurriculum } from "@/lib/courses";
import { getLesson, getStep } from "@/content";
import { levelInfo } from "@/lib/gamification";

export type StudentRow = {
  id: string;
  nickname: string;
  avatar: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  solvedSteps: number;
  totalSteps: number;
  lastActiveAt: Date;
  /** Lektion, an der die Person gerade arbeitet */
  currentLesson: string | null;
};

export type StuckStep = {
  lessonId: string;
  lessonTitle: string;
  stepId: string;
  stepNumber: number;
  attempts: number;
  learners: number;
  solvedBy: number;
  /** Durchschnittliche Versuche pro Person */
  averageAttempts: number;
};

export type CourseDashboard = {
  students: StudentRow[];
  stuckSteps: StuckStep[];
  totalSteps: number;
  activeToday: number;
};

/**
 * Kennzahlen für die Lehrperson: Wer ist wo, und welche Aufgabe
 * kostet die Gruppe die meisten Versuche?
 */
export async function getCourseDashboard(courseId: string): Promise<CourseDashboard> {
  const curriculum = await getCourseCurriculum(courseId);

  const totalSteps = curriculum.reduce(
    (sum, chapter) => sum + chapter.lessons.reduce((s, lesson) => s + lesson.steps.length, 0),
    0,
  );

  const roster = await db.select().from(students).where(eq(students.courseId, courseId));

  // Fortschritt aller Kursmitglieder in einem Rutsch holen und zuordnen.
  const progressByStudent = new Map<string, (typeof progress.$inferSelect)[]>();
  if (roster.length > 0) {
    const entries = await db
      .select()
      .from(progress)
      .where(
        inArray(
          progress.studentId,
          roster.map((student) => student.id),
        ),
      );

    for (const entry of entries) {
      const list = progressByStudent.get(entry.studentId);
      if (list) list.push(entry);
      else progressByStudent.set(entry.studentId, [entry]);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  let activeToday = 0;

  const studentRows: StudentRow[] = roster
    .map((student) => {
      const entries = progressByStudent.get(student.id) ?? [];
      const solved = entries.filter((entry) => entry.solved);

      if (student.lastActiveAt.toISOString().slice(0, 10) === today) activeToday++;

      // aktuelle Lektion = die letzte, an der gearbeitet wurde
      const latest = [...entries].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      )[0];

      const info = levelInfo(student.xp);

      return {
        id: student.id,
        nickname: student.nickname,
        avatar: student.avatar,
        xp: student.xp,
        level: info.level,
        levelTitle: info.title,
        streakDays: student.streakDays,
        solvedSteps: solved.length,
        totalSteps,
        lastActiveAt: student.lastActiveAt,
        currentLesson: latest ? (getLesson(latest.lessonId)?.title ?? null) : null,
      };
    })
    .sort((a, b) => b.solvedSteps - a.solvedSteps || b.xp - a.xp);

  /* ---------------- Knackpunkte finden ---------------- */
  type Bucket = { attempts: number; learners: number; solvedBy: number; lessonId: string };
  const buckets = new Map<string, Bucket>();

  for (const entries of progressByStudent.values()) {
    for (const entry of entries) {
      const key = `${entry.lessonId}::${entry.stepId}`;
      const bucket = buckets.get(key) ?? {
        attempts: 0,
        learners: 0,
        solvedBy: 0,
        lessonId: entry.lessonId,
      };
      bucket.attempts += entry.attempts;
      bucket.learners += 1;
      if (entry.solved) bucket.solvedBy += 1;
      buckets.set(key, bucket);
    }
  }

  const stuckSteps: StuckStep[] = [...buckets.entries()]
    .map(([key, bucket]) => {
      const [lessonId, stepId] = key.split("::");
      const lesson = getLesson(lessonId);
      const stepIndex = lesson?.steps.findIndex((step) => step.id === stepId) ?? -1;

      return {
        lessonId,
        lessonTitle: lesson?.title ?? lessonId,
        stepId,
        stepNumber: stepIndex + 1,
        attempts: bucket.attempts,
        learners: bucket.learners,
        solvedBy: bucket.solvedBy,
        averageAttempts: bucket.attempts / bucket.learners,
      };
    })
    .filter((entry) => entry.learners >= 1 && entry.averageAttempts > 1.5)
    .sort((a, b) => b.averageAttempts - a.averageAttempts || b.learners - a.learners)
    .slice(0, 8);

  return { students: studentRows, stuckSteps, totalSteps, activeToday };
}

/** Prüft, ob eine Step-ID im Katalog eine Übung ist – für die Dashboard-Beschriftung. */
export function isExercise(lessonId: string, stepId: string): boolean {
  return getStep(lessonId, stepId)?.kind === "exercise";
}
