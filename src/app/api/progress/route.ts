import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { badges, progress, students } from "@/lib/db/schema";
import { getStudentSession } from "@/lib/auth";
import { computeBadgeStats, courseHasLesson, getCourseLevelScale } from "@/lib/courses";
import { getLesson, getStep, stepXp } from "@/content";
import {
  BADGES_BY_ID,
  earnedBadgeIds,
  levelInfo,
  nextStreak,
  todayKey,
  xpAfterHints,
} from "@/lib/gamification";

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
    today?: string;
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

  // Der Server läuft in UTC, gelernt wird in MESZ – für die Streak zählt der Tag
  // der Studierenden. Deshalb schickt der Client sein lokales Datum mit. Wir
  // übernehmen es nur, wenn es höchstens einen Tag vom Serverdatum abweicht;
  // damit lässt sich die Streak nicht durch eine gefälschte Uhr hochtreiben.
  const localDay = clientDay(body.today);

  // Die Lektion gehört zwingend in die Bedingung: Step-IDs sind nur innerhalb
  // einer Lektion eindeutig (siehe Kommentar am Index in db/schema.ts).
  const [existing] = await db
    .select()
    .from(progress)
    .where(
      and(
        eq(progress.studentId, session.studentId),
        eq(progress.lessonId, lessonId),
        eq(progress.stepId, stepId),
      ),
    )
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

  let earnedXp = 0;

  // Die Level-Schwellen richten sich nach dem Umfang dieses Kurses.
  const scale = await getCourseLevelScale(session.courseId);

  if (newlySolved) {
    // Tipps kosten gestaffelt XP – Hilfe ist erlaubt, aber nicht gratis.
    earnedXp = xpAfterHints(stepXp(step), hintsUsed);

    const before = levelInfo(xp, scale).level;
    xp += earnedXp;
    leveledUp = levelInfo(xp, scale).level > before;

    streakDays = nextStreak(student.lastStreakDay, student.streakDays, localDay);

    await db
      .update(students)
      .set({ xp, streakDays, lastStreakDay: localDay, lastActiveAt: now })
      .where(eq(students.id, student.id));
  } else {
    await db.update(students).set({ lastActiveAt: now }).where(eq(students.id, student.id));
  }

  // Abzeichen prüfen
  const stats = await computeBadgeStats(session.studentId, session.courseId, hourOfDay, localDay);
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
    /** XP für genau diesen Step – der Client muss sie nicht aus Summen ableiten */
    earnedXp,
    xp,
    level: levelInfo(xp, scale),
    leveledUp,
    streakDays,
    newBadges: fresh.map((id) => {
      const badge = BADGES_BY_ID.get(id)!;
      return { id, name: badge.name, description: badge.description, icon: badge.icon };
    }),
  });
}

/**
 * Nimmt das vom Browser gemeldete Ortsdatum, sofern es plausibel ist –
 * sonst das Serverdatum. Erlaubt sind ±1 Tag um heute (UTC), was jede
 * Zeitzone abdeckt, aber kein freies Setzen des Datums.
 */
function clientDay(value: unknown): string {
  const serverDay = todayKey(new Date());
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return serverDay;

  const noon = Date.parse(`${serverDay}T12:00:00Z`);
  const allowed = new Set(
    [-1, 0, 1].map((offset) => todayKey(new Date(noon + offset * 86_400_000))),
  );
  return allowed.has(value) ? value : serverDay;
}
