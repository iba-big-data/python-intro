import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth";
import { getStudentOverview } from "@/lib/courses";
import { lessonMinutes, lessonXp } from "@/content/types";
import { LessonMap, type MapChapter } from "@/components/LessonMap";
import { StudentBar } from "@/components/StudentBar";
import { ContinueCard } from "@/components/ContinueCard";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const overview = await getStudentOverview(session.studentId);
  if (!overview) redirect("/login");

  const { student, course, curriculum, solvedByLesson, level, lastLessonId } = overview;

  // Alle Lektionen sind offen. Wer vorgreifen oder etwas nachschlagen will,
  // soll das können – die Reihenfolge ist eine Empfehlung, keine Schranke.
  const chapters: MapChapter[] = curriculum.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    summary: chapter.summary,
    icon: chapter.icon,
    track: chapter.track,
    lessons: chapter.lessons.map((lesson) => {
      const solvedSteps = Math.min(solvedByLesson[lesson.id] ?? 0, lesson.steps.length);
      return {
        id: lesson.id,
        title: lesson.title,
        summary: lesson.summary,
        totalSteps: lesson.steps.length,
        solvedSteps,
        xp: lessonXp(lesson),
        minutes: lessonMinutes(lesson),
      };
    }),
  }));

  const flat = curriculum.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({ lesson, chapter })),
  );

  const totalSteps = flat.reduce((sum, entry) => sum + entry.lesson.steps.length, 0);
  const totalSolved = flat.reduce(
    (sum, entry) => sum + Math.min(solvedByLesson[entry.lesson.id] ?? 0, entry.lesson.steps.length),
    0,
  );

  // Empfehlung statt Sperre: zuletzt Bearbeitetes, sonst die erste offene Lektion.
  const unfinished = flat.filter(
    (entry) => (solvedByLesson[entry.lesson.id] ?? 0) < entry.lesson.steps.length,
  );
  const resume =
    unfinished.find((entry) => entry.lesson.id === lastLessonId) ?? unfinished[0] ?? null;

  const suggestion = resume
    ? {
        lessonId: resume.lesson.id,
        title: resume.lesson.title,
        chapterTitle: `Kapitel ${resume.chapter.number} · ${resume.chapter.title}`,
        solvedSteps: Math.min(
          solvedByLesson[resume.lesson.id] ?? 0,
          resume.lesson.steps.length,
        ),
        totalSteps: resume.lesson.steps.length,
        minutes: lessonMinutes(resume.lesson),
        resumed: resume.lesson.id === lastLessonId,
      }
    : null;

  return (
    <div className="min-h-screen">
      <StudentBar
        student={{
          nickname: student.nickname,
          avatar: student.avatar,
          xp: student.xp,
          streakDays: student.streakDays,
        }}
        level={level}
        courseName={course.name}
      />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Hallo {student.nickname} <span className="text-gradient">👋</span>
          </h1>
          <p className="mt-2 text-ink-dim">
            {totalSolved === 0
              ? "Zeit für die erste Zeile Code. Fang unten an."
              : `${totalSolved} von ${totalSteps} Aufgaben geschafft – bleib dran.`}
          </p>
        </div>

        {suggestion && <ContinueCard suggestion={suggestion} />}

        <LessonMap chapters={chapters} currentLessonId={suggestion?.lessonId ?? null} />
      </main>
    </div>
  );
}
