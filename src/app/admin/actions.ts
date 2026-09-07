"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { hashPassword, isAdmin, slugify } from "@/lib/auth";
import { setCourseLessons } from "@/lib/courses";
import { defaultLessonIds } from "@/content";

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Nicht berechtigt.");
}

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createCourse(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const description = String(formData.get("description") ?? "").trim() || null;

  if (name.length < 3) {
    return { ok: false, error: "Der Kursname braucht mindestens 3 Zeichen." };
  }
  if (password.length < 4) {
    return { ok: false, error: "Das Kurskennwort braucht mindestens 4 Zeichen." };
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
    if (password.length < 4) {
      return { ok: false, error: "Das neue Kennwort braucht mindestens 4 Zeichen." };
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

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  await requireAdmin();
  // Kaskade im Schema löscht Studierende, Fortschritt und Abzeichen mit.
  await db.delete(courses).where(eq(courses.id, courseId));

  revalidatePath("/admin");
  return { ok: true };
}
