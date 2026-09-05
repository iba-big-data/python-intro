import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { getStudentSession } from "@/lib/auth";
import { AVATARS } from "@/lib/avatars";

/** Avatar wechseln. Mehr kann man am eigenen Profil (noch) nicht ändern. */
export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: { avatar?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Nur aus der bekannten Liste – sonst landet beliebiger Text im Avatarfeld.
  const avatar = typeof body.avatar === "string" ? body.avatar : "";
  if (!AVATARS.includes(avatar)) {
    return NextResponse.json({ error: "Unbekannter Avatar." }, { status: 400 });
  }

  await db.update(students).set({ avatar }).where(eq(students.id, session.studentId));

  return NextResponse.json({ ok: true, avatar });
}
