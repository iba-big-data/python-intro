import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";

/** Kleine Bremse gegen Durchprobieren des Admin-Kennworts. */
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(request: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD ist auf dem Server nicht gesetzt." },
      { status: 500 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
  const now = Date.now();
  const record = attempts.get(ip);

  if (record && record.until > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte in ein paar Minuten erneut probieren." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    password = (await request.json()).password ?? "";
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (password !== expected) {
    const next = record && record.until > now ? record : { count: 0, until: now + WINDOW_MS };
    next.count += 1;
    attempts.set(ip, next);
    return NextResponse.json({ error: "Kennwort stimmt nicht." }, { status: 401 });
  }

  attempts.delete(ip);
  await setAdminSession();
  return NextResponse.json({ ok: true });
}
