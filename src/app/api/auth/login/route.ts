import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, students } from "@/lib/db/schema";
import { setStudentSession, slugify, verifyPassword } from "@/lib/auth";

const AVATARS = ["🚀", "🦊", "🐙", "🦉", "🐝", "🦕", "🐧", "🦄", "🐨", "🦈", "🌵", "🍄"];

export async function POST(request: Request) {
  let body: { course?: string; password?: string; nickname?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const courseName = (body.course ?? "").trim();
  const password = body.password ?? "";
  const nickname = (body.nickname ?? "").trim();

  if (!courseName || !password || !nickname) {
    return NextResponse.json(
      { error: "Bitte Kursname, Kennwort und deinen Anzeigenamen ausfüllen." },
      { status: 400 },
    );
  }

  if (nickname.length > 32) {
    return NextResponse.json({ error: "Der Anzeigename ist zu lang (max. 32 Zeichen)." }, { status: 400 });
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slugify(courseName)))
    .limit(1);

  // Gleiche Meldung für "Kurs unbekannt" und "Kennwort falsch",
  // damit sich keine Kursnamen erraten lassen.
  const invalid = NextResponse.json(
    { error: "Kursname oder Kennwort stimmt nicht." },
    { status: 401 },
  );

  if (!course || course.archived) return invalid;
  if (!(await verifyPassword(password, course.passwordHash))) return invalid;

  const nicknameKey = slugify(nickname);
  if (!nicknameKey) {
    return NextResponse.json(
      { error: "Bitte wähle einen Anzeigenamen mit Buchstaben oder Zahlen." },
      { status: 400 },
    );
  }

  const [existing] = await db
    .select()
    .from(students)
    .where(and(eq(students.courseId, course.id), eq(students.nicknameKey, nicknameKey)))
    .limit(1);

  let student = existing;

  if (student) {
    await db
      .update(students)
      .set({ lastActiveAt: new Date(), nickname })
      .where(eq(students.id, student.id));
  } else {
    [student] = await db
      .insert(students)
      .values({
        courseId: course.id,
        nickname,
        nicknameKey,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      })
      .returning();
  }

  await setStudentSession({
    studentId: student.id,
    courseId: course.id,
    nickname: student.nickname,
  });

  return NextResponse.json({ ok: true, courseName: course.name });
}
