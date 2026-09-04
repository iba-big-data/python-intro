import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, progress, students } from "@/lib/db/schema";
import { getStudentSession } from "@/lib/auth";
import { computeBadgeStats, courseHasLesson } from "@/lib/courses";
import { getLesson, getStep, stepXp } from "@/content";
import { BADGES_BY_ID, earnedBadgeIds, levelInfo, nextStreak, todayKey } from "@/lib/gamification";

export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: {
    lessonId?: string;
    stepId?: string;
    solved?: boolean;
    hintsUsed?: number;
    code?: string;
    hourOfDay?: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { lessonId, stepId } = body;
  if (!lessonId || !stepId) {
    return NextResponse.json({ error: "lessonId und stepId fehlen." }, { status: 400 });
  }

  const lesson = getLesson(lessonId);
  const step = getStep(lessonId, stepId);
  if (!lesson || !step) {
    return NextResponse.json({ error: "Unbekannte Lektion." }, { status: 404 });
  }

  if (!(await courseHasLesson(session.courseId, lessonId))) {
    return NextResponse.json({ error: "Diese Lektion gehört nicht zu deinem Kurs." }, { status: 403 });
  }

  const solved = Boolean(body.solved);
  const hintsUsed = Math.max(0, Math.min(20, body.hintsUsed ?? 0));
  const code = typeof body.code === "string" ? body.code.slice(0, 8000) : null;
  const hourOfDay = Number.isInteger(body.hourOfDay)
    ? Math.max(0, Math.min(23, body.hourOfDay as number))
    : new Date().getHours();

  const [existing] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.studentId, session.studentId), eq(progress.stepId, stepId)))
    .limit(1);

  const newlySolved = solved && !existing?.solved;
  const now = new Date();

  if (existing) {
    await db
      .update(progress)
      .set({
        attempts: existing.attempts + 1,
        solved: existing.solved || solved,
        hintsUsed: Math.max(existing.hintsUsed, hintsUsed),
        lastCode: code ?? existing.lastCode,
        solvedAt: existing.solvedAt ?? (solved ? now : null),
        updatedAt: now,
      })
      .where(eq(progress.id, existing.id));
  } else {
    await db.insert(progress).values({
      studentId: session.studentId,
      lessonId,
      stepId,
      solved,
      attempts: 1,
      hintsUsed,
      lastCode: code,
      solvedAt: solved ? now : null,
      updatedAt: now,
    });
  }

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, session.studentId))
    .limit(1);

  if (!student) {
    return NextResponse.json({ error: "Profil nicht gefunden." }, { status: 404 });
  }

  let xp = student.xp;
  let streakDays = student.streakDays;
  let leveledUp = false;

  if (newlySolved) {
    // Tipps kosten ein Viertel der XP – Hilfe ist erlaubt, aber nicht gratis.
    const base = stepXp(step);
    const earned = Math.max(2, Math.round(base * (hintsUsed > 0 ? 0.75 : 1)));

    const before = levelInfo(xp).level;
    xp += earned;
    leveledUp = levelInfo(xp).level > before;

    const today = todayKey();
    streakDays = nextStreak(student.lastStreakDay, student.streakDays, today);

    await db
      .update(students)
      .set({ xp, streakDays, lastStreakDay: today, lastActiveAt: now })
      .where(eq(students.id, student.id));
  } else {
    await db.update(students).set({ lastActiveAt: now }).where(eq(students.id, student.id));
  }

  // Abzeichen prüfen
  const stats = await computeBadgeStats(session.studentId, session.courseId, hourOfDay);
  const deserved = earnedBadgeIds({ ...stats, streakDays });

  const owned = new Set(
    (await db.select({ badgeId: badges.badgeId }).from(badges).where(eq(badges.studentId, student.id)))
      .map((row) => row.badgeId),
  );

  const fresh = deserved.filter((id) => !owned.has(id));
  if (fresh.length > 0) {
    await db
      .insert(badges)
      .values(fresh.map((badgeId) => ({ studentId: student.id, badgeId })))
      .onConflictDoNothing();
  }

  return NextResponse.json({
    ok: true,
    newlySolved,
    xp,
    level: levelInfo(xp),
    leveledUp,
    streakDays,
    newBadges: fresh.map((id) => {
      const badge = BADGES_BY_ID.get(id)!;
      return { id, name: badge.name, description: badge.description, icon: badge.icon };
    }),
  });
}
