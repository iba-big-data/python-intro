import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, students } from "@/lib/db/schema";
import {
  generateRecoveryCode,
  getStudentSession,
  normaliseRecoveryCode,
  setStudentSession,
  slugify,
} from "@/lib/auth";
import { findCourseByPassword, nicknameTaken } from "@/lib/courses";
import { AVATARS } from "@/lib/avatars";
import { clientKey, hit, reset } from "@/lib/ratelimit";

/**
 * Fehlversuche pro Absender. Bewusst großzügig und kurz: In einem Hörsaal
 * hängt der ganze Kurs an derselben IP-Adresse, und ein paar Vertipper sollen
 * niemandem den Zugang versperren. Gegen das Durchprobieren reicht das trotzdem
 * – bei achtstelligen Kennwörtern sind ein paar tausend Versuche pro Tag
 * aussichtslos. Jede gelungene Anmeldung setzt den Zähler ohnehin zurück.
 */
const MAX_ATTEMPTS = 20;
const WINDOW_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  let body: { password?: string; nickname?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const key = clientKey(request);
  const limit = hit(key, MAX_ATTEMPTS, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Zu viele Versuche. Bitte in ${Math.ceil(limit.retryAfterSeconds / 60)} Minuten noch einmal probieren.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // Zwei Wege hinein: Kennwort + Name (neu dabei) oder Wiederherstellungscode
  // (schon dabei gewesen, Gerät oder Browser gewechselt).
  const result = body.code
    ? await resumeWithCode(body.code)
    : await joinWithPassword(body.password ?? "", body.nickname ?? "");

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  reset(key);
  await setStudentSession({
    studentId: result.student.id,
    courseId: result.student.courseId,
    nickname: result.student.nickname,
  });

  return NextResponse.json({
    ok: true,
    courseName: result.courseName,
    nickname: result.student.nickname,
    recoveryCode: result.student.recoveryCode,
    resumed: result.resumed,
  });
}

type Attempt =
  | { error: string; status: number }
  | {
      student: typeof students.$inferSelect;
      courseName: string;
      /** true = an einen vorhandenen Fortschritt angeknüpft */
      resumed: boolean;
    };

/**
 * Anmeldung mit Kurskennwort. Der Anzeigename allein erkennt niemanden wieder,
 * sonst käme man mit fremden Namen in fremden Fortschritt. Wiedererkannt wird
 * nur, wer noch das Cookie des Kurses im Browser hat – alle anderen bekommen
 * einen neuen Datensatz, aber nur unter einem Namen, den es im Kurs noch nicht
 * gibt. So landet niemand versehentlich in einem zweiten, leeren Konto.
 */
async function joinWithPassword(password: string, rawNickname: string): Promise<Attempt> {
  const nickname = rawNickname.trim();

  if (!password || !nickname) {
    return { error: "Bitte Kurskennwort und Anzeigename ausfüllen.", status: 400 };
  }
  if (nickname.length > 32) {
    return { error: "Der Anzeigename ist zu lang (max. 32 Zeichen).", status: 400 };
  }

  const nicknameKey = slugify(nickname);
  if (!nicknameKey) {
    return { error: "Bitte wähle einen Anzeigenamen mit Buchstaben oder Zahlen.", status: 400 };
  }

  const course = await findCourseByPassword(password);
  if (!course) {
    return { error: "Dieses Kurskennwort kennen wir nicht.", status: 401 };
  }

  // Schon angemeldet (Cookie gültig) und nur erneut über das Formular
  // gekommen, etwa über ein Lesezeichen auf /login: weiter im eigenen Stand,
  // statt das Cookie durch ein neues, leeres Konto zu ersetzen.
  const session = await getStudentSession();
  if (session?.courseId === course.id) {
    const [current] = await db
      .select()
      .from(students)
      .where(and(eq(students.id, session.studentId), eq(students.courseId, course.id)))
      .limit(1);
    if (current) {
      await db.update(students).set({ lastActiveAt: new Date() }).where(eq(students.id, current.id));
      return { student: current, courseName: course.name, resumed: true };
    }
  }

  if (await nicknameTaken(course.id, nicknameKey)) {
    return {
      error:
        "Diesen Namen gibt es in deinem Kurs schon. Warst du schon einmal dabei? Dann melde dich mit deinem Wiederherstellungscode an – sonst wähle bitte einen anderen Namen.",
      status: 409,
    };
  }

  const [student] = await db
    .insert(students)
    .values({
      courseId: course.id,
      nickname,
      nicknameKey,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      recoveryCode: await freshRecoveryCode(),
    })
    .returning();

  return { student, courseName: course.name, resumed: false };
}

/** Rückweg zum eigenen Fortschritt auf einem anderen Gerät. */
async function resumeWithCode(rawCode: string): Promise<Attempt> {
  const code = normaliseRecoveryCode(rawCode);
  if (!code) {
    return { error: "Bitte gib deinen Wiederherstellungscode ein.", status: 400 };
  }

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.recoveryCode, code))
    .limit(1);

  if (!student) {
    return { error: "Diesen Code kennen wir nicht. Tippfehler?", status: 401 };
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, student.courseId))
    .limit(1);

  if (!course || course.archived) {
    return { error: "Der Kurs zu diesem Code ist nicht mehr aktiv.", status: 403 };
  }

  await db.update(students).set({ lastActiveAt: new Date() }).where(eq(students.id, student.id));

  return { student, courseName: course.name, resumed: true };
}

/**
 * Ein Code, den es noch nicht gibt. Der Unique-Index in der Datenbank ist die
 * eigentliche Absicherung; diese Schleife erspart nur die Fehlermeldung.
 */
async function freshRecoveryCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRecoveryCode();
    const [clash] = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.recoveryCode, code))
      .limit(1);
    if (!clash) return code;
  }
  throw new Error("Konnte keinen freien Wiederherstellungscode erzeugen.");
}
