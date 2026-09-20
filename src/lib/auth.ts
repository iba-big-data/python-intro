import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const STUDENT_COOKIE = "pq_student";
export const ADMIN_COOKIE = "pq_admin";

// Ein Semester ist länger als 30 Tage, und das Cookie ist der einzige Weg
// zurück zum eigenen Fortschritt. Es wird bei jedem gespeicherten Fortschritt
// erneuert (siehe touchStudentSession), die Frist läuft also ab dem letzten
// Lernen statt ab der Anmeldung.
const SESSION_DAYS = 180;

function secret(): Uint8Array {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 16) {
    throw new Error("SESSION_SECRET fehlt oder ist zu kurz (mind. 16 Zeichen).");
  }
  return new TextEncoder().encode(value);
}

/* ------------------------------------------------------------------ *
 *  Passwort-Hashing – PBKDF2 über die WebCrypto-API,
 *  läuft dadurch sowohl in Node als auch in der Edge-Runtime.
 * ------------------------------------------------------------------ */
const PBKDF2_ITERATIONS = 120_000;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt.buffer)}$${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, , saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2" || !saltHex || !hashHex) return false;
  const candidate = await derive(password, fromHex(saltHex));
  // konstante Laufzeit, damit sich Passwörter nicht über Timing erraten lassen
  if (candidate.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ hashHex.charCodeAt(i);
  }
  return diff === 0;
}

/* ------------------------------------------------------------------ *
 *  Sessions
 * ------------------------------------------------------------------ */
export type StudentSession = {
  studentId: string;
  courseId: string;
  nickname: string;
};

async function sign(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function verifyToken<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as T;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export async function setStudentSession(session: StudentSession): Promise<void> {
  const store = await cookies();
  store.set(STUDENT_COOKIE, await sign({ ...session }), cookieOptions);
}

export async function getStudentSession(): Promise<StudentSession | null> {
  const store = await cookies();
  return verifyToken<StudentSession>(store.get(STUDENT_COOKIE)?.value);
}

/** Verlängert die Laufzeit des Cookies – bei jedem Lebenszeichen aufrufen. */
export async function touchStudentSession(session: StudentSession): Promise<void> {
  await setStudentSession(session);
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, await sign({ role: "admin" }), cookieOptions);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const payload = await verifyToken<{ role?: string }>(store.get(ADMIN_COOKIE)?.value);
  return payload?.role === "admin";
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

/* ------------------------------------------------------------------ *
 *  Wiederherstellungscode
 *
 *  Zweiter Schlüssel zum eigenen Fortschritt, gedacht zum Abschreiben:
 *  zwei Wörter und sechs Zeichen, z. B. "lila-otter-7f3k92". Im zufälligen
 *  Teil fehlen 0/o/1/l/i – die verwechselt man beim Abtippen zu leicht.
 * ------------------------------------------------------------------ */
const CODE_ADJECTIVES = [
  "lila", "flink", "leise", "wach", "rund", "hell", "kuehn", "mild",
  "warm", "klar", "weit", "sanft", "froh", "keck", "fein", "zart",
];
const CODE_NOUNS = [
  "otter", "birke", "komet", "anker", "feder", "kiesel", "tulpe", "wolke",
  "raupe", "harfe", "muschel", "distel", "kranich", "quelle", "nebel", "funke",
];
const CODE_CHARS = "23456789abcdefghjkmnpqrstuvwxyz";

function pick<T>(list: T[], random: Uint32Array, index: number): T {
  return list[random[index] % list.length];
}

export function generateRecoveryCode(): string {
  const random = crypto.getRandomValues(new Uint32Array(8));
  let tail = "";
  for (let i = 0; i < 6; i++) {
    tail += CODE_CHARS[random[i + 2] % CODE_CHARS.length];
  }
  return `${pick(CODE_ADJECTIVES, random, 0)}-${pick(CODE_NOUNS, random, 1)}-${tail}`;
}

/**
 * Räumt einen abgetippten Code auf: Groß-/Kleinschreibung, Leerzeichen und
 * versehentliche Sonderzeichen sollen niemanden aussperren.
 */
export function normaliseRecoveryCode(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Kurs- und Anzeigenamen für Vergleich und Sortierung normalisieren */
export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
