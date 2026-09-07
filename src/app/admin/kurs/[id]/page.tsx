import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { chapters, defaultLessonIds } from "@/content";
import { getCourseLessonIds } from "@/lib/courses";
import { getCourseDashboard } from "@/lib/dashboard";
import { AdminBar } from "@/components/admin/AdminBar";
import { CourseTabs } from "@/components/admin/CourseTabs";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;

  const [course] = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!course) notFound();

  const [selection, dashboard] = await Promise.all([
    getCourseLessonIds(course.id),
    getCourseDashboard(course.id),
  ]);

  const pickerChapters = chapters.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    summary: chapter.summary,
    icon: chapter.icon,
    track: chapter.track,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      steps: lesson.steps.length,
      exercises: lesson.steps.filter((step) => step.kind === "exercise").length,
    })),
  }));

  return (
    <div className="min-h-screen">
      <AdminBar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-ink-faint transition hover:text-ink-dim"
        >
          <ArrowLeft className="size-4" />
          Alle Kurse
        </Link>

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          {course.archived && (
            <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs text-amber">
              archiviert – keine Anmeldung möglich
            </span>
          )}
        </div>

        <CourseTabs
          active={tab ?? "lektionen"}
          courseId={course.id}
          chapters={pickerChapters}
          selection={selection}
          defaultSelection={defaultLessonIds}
          dashboard={dashboard}
          course={{
            id: course.id,
            name: course.name,
            description: course.description,
            archived: course.archived,
          }}
        />
      </main>
    </div>
  );
}
