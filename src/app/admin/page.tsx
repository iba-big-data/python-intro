import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { AdminBar } from "@/components/admin/AdminBar";
import { NewCourseForm } from "@/components/admin/NewCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rows = await db
    .select({
      id: courses.id,
      name: courses.name,
      slug: courses.slug,
      description: courses.description,
      archived: courses.archived,
      createdAt: courses.createdAt,
      // Tabellen- und Spaltennamen hier bewusst ausgeschrieben: Drizzle rendert
      // interpolierte Spalten unqualifiziert, wodurch das `id` der äußeren
      // Abfrage an die gleichnamige Spalte der Unterabfrage binden würde.
      lessonCount: sql<number>`(
        select count(*)::int from "course_lessons"
        where "course_lessons"."course_id" = "courses"."id"
      )`,
      studentCount: sql<number>`(
        select count(*)::int from "students"
        where "students"."course_id" = "courses"."id"
      )`,
    })
    .from(courses)
    .orderBy(desc(courses.createdAt));

  return (
    <div className="min-h-screen">
      <AdminBar />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Kurse</h1>
        <p className="mt-2 text-ink-dim">
          Lege pro Lehrveranstaltung einen Kurs an und wähle aus, welche Lektionen die Studierenden
          sehen.
        </p>

        <div className="mt-8">
          <NewCourseForm />
        </div>

        <div className="mt-10 space-y-3">
          {rows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-ink-faint">
              Noch keine Kurse. Leg oben deinen ersten an.
            </div>
          )}

          {rows.map((course) => (
            <Link
              key={course.id}
              href={`/admin/kurs/${course.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface/50 p-5 transition hover:border-cyan/50 hover:bg-surface"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold">{course.name}</h2>
                  {course.archived && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-faint">
                      archiviert
                    </span>
                  )}
                </div>
                {course.description && (
                  <p className="mt-0.5 truncate text-sm text-ink-dim">{course.description}</p>
                )}
                <div className="mt-2 flex gap-4 text-xs text-ink-faint">
                  <span className="flex items-center gap-1">
                    <BookOpen className="size-3.5" />
                    {course.lessonCount} Lektionen
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {course.studentCount} Teilnehmende
                  </span>
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-cyan" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
