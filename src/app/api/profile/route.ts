import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { students } from "@/lib/db/schema";
import { getStudentSession, setStudentSession, slugify } from "@/lib/auth";
import { AVATARS } from "@/lib/avatars";

/** Avatar und Anzeigename ändern – beides rein kosmetisch. */
export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: { avatar?: unknown; nickname?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const values: Partial<typeof students.$inferInsert> = {};

  if (body.avatar !== undefined) {
    // Nur aus der bekannten Liste – sonst landet beliebiger Text im Avatarfeld.
    const avatar = typeof body.avatar === "string" ? body.avatar : "";
    if (!AVATARS.includes(avatar)) {
      return NextResponse.json({ error: "Unbekannter Avatar." }, { status: 400 });
    }
    values.avatar = avatar;
  }

  if (body.nickname !== undefined) {
    const nickname = typeof body.nickname === "string" ? body.nickname.trim() : "";
    if (!nickname) {
      return NextResponse.json({ error: "Bitte gib einen Namen ein." }, { status: 400 });
    }
    if (nickname.length > 32) {
      return NextResponse.json(
        { error: "Der Anzeigename ist zu lang (max. 32 Zeichen)." },
        { status: 400 },
      );
    }
    const nicknameKey = slugify(nickname);
    if (!nicknameKey) {
      return NextResponse.json(
        { error: "Bitte wähle einen Namen mit Buchstaben oder Zahlen." },
        { status: 400 },
      );
    }
    values.nickname = nickname;
    values.nicknameKey = nicknameKey;
  }

  if (Object.keys(values).length === 0) {
    return NextResponse.json({ error: "Nichts zu ändern." }, { status: 400 });
  }

  await db.update(students).set(values).where(eq(students.id, session.studentId));

  // Der Name steckt auch im Cookie (die Kopfzeile liest ihn von dort) –
  // nach einer Umbenennung muss er dort mitziehen.
  if (values.nickname) {
    await setStudentSession({ ...session, nickname: values.nickname });
  }

  // nicknameKey ist interne Sortierhilfe und hat in der Antwort nichts verloren
  return NextResponse.json({ ok: true, avatar: values.avatar, nickname: values.nickname });
}
