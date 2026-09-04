import { notFound, redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth";
import { getStudentOverview } from "@/lib/courses";
import { LessonView } from "@/components/LessonView";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string[] }>;
}) {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const { lesson: segments } = await params;
  const lessonId = segments.join("/");

  const overview = await getStudentOverview(session.studentId);
  if (!overview) redirect("/login");

  // Nur Lektionen ausliefern, die auch wirklich zum Kurs gehören.
  const flat = overview.curriculum.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({ lesson, chapter })),
  );
  const position = flat.findIndex((entry) => entry.lesson.id === lessonId);
  if (position === -1) notFound();

  const { lesson, chapter } = flat[position];
  const next = flat[position + 1]?.lesson.id ?? null;

  const solvedStepIds: string[] = [];
  const hintsUsedByStep: Record<string, number> = {};

  for (const step of lesson.steps) {
    const entry = overview.progressByStep[`${lesson.id}::${step.id}`];
    if (!entry) continue;
    if (entry.solved) solvedStepIds.push(step.id);
    if (entry.hintsUsed > 0) hintsUsedByStep[step.id] = entry.hintsUsed;
  }

  return (
    <LessonView
      lesson={lesson}
      chapterTitle={`Kapitel ${chapter.number} · ${chapter.title}`}
      solvedStepIds={solvedStepIds}
      hintsUsedByStep={hintsUsedByStep}
      nextLessonId={next}
      student={{
        nickname: overview.student.nickname,
        avatar: overview.student.avatar,
        xp: overview.student.xp,
        streakDays: overview.student.streakDays,
      }}
    />
  );
}
