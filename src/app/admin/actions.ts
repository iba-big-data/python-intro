"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, progress, students } from "@/lib/db/schema";
import { hashPassword, isAdmin, slugify } from "@/lib/auth";
import { findCourseByPassword, setCourseLessons } from "@/lib/courses";
import { defaultLessonIds } from "@/content";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Nicht berechtigt.");
}

export type ActionResult =
  | { ok: true; id?: string; removed?: number }
  | { ok: false; error: string };

/** Studierende melden sich nur noch mit dem Kennwort an – zweimal dasselbe geht nicht. */
const PASSWORD_MIN = 8;

async function passwordTaken(password: string, exceptCourseId?: string): Promise<boolean> {
  // Auch archivierte Kurse blockieren: sie lassen sich jederzeit wieder
  // freigeben, und dann wäre die Anmeldung mehrdeutig.
  const clash = await findCourseByPassword(password, { includeArchived: true });
  return clash !== null && clash.id !== exceptCourseId;
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (name.length < 3) {
    return { ok: false, error: "Der Kursname braucht mindestens 3 Zeichen." };
  }
  if (password.length < PASSWORD_MIN) {
    return {
      ok: false,
      error: `Das Kurskennwort braucht mindestens ${PASSWORD_MIN} Zeichen.`,
    };
  }
  if (await passwordTaken(password)) {
    return { ok: false, error: "Dieses Kennwort benutzt bereits ein anderer Kurs." };
  }

  const slug = slugify(name);
  if (!slug) {
    return { ok: false, error: "Der Kursname braucht Buchstaben oder Zahlen." };
  }

  const [existing] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (existing) {
    return { ok: false, error: "Ein Kurs mit diesem Namen existiert bereits." };
  }

  const [course] = await db
    .insert(courses)
    .values({ name, slug, description, passwordHash: await hashPassword(password) })
    .returning();

  // Ein neuer Kurs startet mit den Must-have-Lektionen statt mit einer leeren
  // Liste: so sehen Studierende sofort etwas, und die Feinauswahl bleibt eine
  // Korrektur statt einer Pflichtaufgabe vor dem ersten Login.
  await setCourseLessons(course.id, defaultLessonIds);

  revalidatePath("/admin");
  return { ok: true, id: course.id };
}

export async function updateCourse(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const password = String(formData.get("password") ?? "");

  if (!id) return { ok: false, error: "Kurs nicht gefunden." };
  if (name.length < 3) return { ok: false, error: "Der Kursname braucht mindestens 3 Zeichen." };

  const slug = slugify(name);
  const [clash] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (clash && clash.id !== id) {
    return { ok: false, error: "Ein anderer Kurs heißt bereits so." };
  }

  const values: Partial<typeof courses.$inferInsert> = { name, slug, description };
  if (password) {
    if (password.length < PASSWORD_MIN) {
      return {
        ok: false,
        error: `Das neue Kennwort braucht mindestens ${PASSWORD_MIN} Zeichen.`,
      };
    }
    if (await passwordTaken(password, id)) {
      return { ok: false, error: "Dieses Kennwort benutzt bereits ein anderer Kurs." };
    }
    values.passwordHash = await hashPassword(password);
  }

  await db.update(courses).set(values).where(eq(courses.id, id));

  revalidatePath("/admin");
  revalidatePath(`/admin/kurs/${id}`);
  return { ok: true };
}

export async function saveLessonSelection(
  courseId: string,
  lessonIds: string[],
): Promise<ActionResult> {
  await requireAdmin();
  await setCourseLessons(courseId, lessonIds);

  revalidatePath("/admin");
  revalidatePath(`/admin/kurs/${courseId}`);
  return { ok: true };
}

export async function setArchived(courseId: string, archived: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.update(courses).set({ archived }).where(eq(courses.id, courseId));

  revalidatePath("/admin");
  revalidatePath(`/admin/kurs/${courseId}`);
  return { ok: true };
}

/**
 * Entfernt Karteileichen: Profile ohne jede Aufgabe, die seit einem Tag nicht
 * mehr aktiv waren. Solche Einträge entstehen, wenn jemand sich neu anmeldet,
 * weil das Cookie weg ist – der alte Eintrag bleibt dann leer zurück.
 *
 * Die Tagesgrenze schützt davor, jemanden zu löschen, der gerade erst
 * angekommen ist und noch nichts gelöst hat.
 */
export async function removeGhostStudents(courseId: string): Promise<ActionResult> {
  await requireAdmin();

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const idle = await db
    .select({ id: students.id })
    .from(students)
    .where(
      and(
        eq(students.courseId, courseId),
        eq(students.xp, 0),
        lt(students.lastActiveAt, cutoff),
      ),
    );

  if (idle.length === 0) return { ok: true, removed: 0 };

  const ids = idle.map((row) => row.id);
  const touched = await db
    .select({ studentId: progress.studentId })
    .from(progress)
    .where(inArray(progress.studentId, ids));

  const busy = new Set(touched.map((row) => row.studentId));
  const ghosts = ids.filter((id) => !busy.has(id));

  if (ghosts.length > 0) {
    await db.delete(students).where(inArray(students.id, ghosts));
  }

  revalidatePath(`/admin/kurs/${courseId}`);
  return { ok: true, removed: ghosts.length };
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  await requireAdmin();
  // Kaskade im Schema löscht Studierende, Fortschritt und Abzeichen mit.
  await db.delete(courses).where(eq(courses.id, courseId));

  revalidatePath("/admin");
  return { ok: true };
}
