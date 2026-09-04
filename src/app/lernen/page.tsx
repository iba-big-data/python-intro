import { redirect } from "next/navigation";
import { getStudentSession } from "@/lib/auth";
import { getStudentOverview } from "@/lib/courses";
import { lessonXp } from "@/content/types";
import { BADGES } from "@/lib/gamification";
import { LessonMap, type MapChapter } from "@/components/LessonMap";
import { StudentBar } from "@/components/StudentBar";
import { BadgeShelf } from "@/components/BadgeShelf";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const overview = await getStudentOverview(session.studentId);
  if (!overview) redirect("/login");

  const { student, course, curriculum, solvedByLesson, earnedBadges, level } = overview;

  // Freischaltung: die erste Lektion ist offen, jede weitere nach Abschluss der vorherigen.
  let previousComplete = true;
  const chapters: MapChapter[] = curriculum.map((chapter) => ({
    id: chapter.id,
    number: chapter.number,
    title: chapter.title,
    summary: chapter.summary,
    icon: chapter.icon,
    track: chapter.track,
    lessons: chapter.lessons.map((lesson) => {
      const solvedSteps = Math.min(solvedByLesson[lesson.id] ?? 0, lesson.steps.length);
      const unlocked = previousComplete || solvedSteps > 0;
      previousComplete = solvedSteps >= lesson.steps.length;

      return {
        id: lesson.id,
        title: lesson.title,
        summary: lesson.summary,
        totalSteps: lesson.steps.length,
        solvedSteps,
        xp: lessonXp(lesson),
        unlocked,
      };
    }),
  }));

  const totalSteps = curriculum.reduce(
    (sum, chapter) => sum + chapter.lessons.reduce((s, lesson) => s + lesson.steps.length, 0),
    0,
  );
  const totalSolved = Object.entries(solvedByLesson).reduce((sum, [, count]) => sum + count, 0);

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
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Hallo {student.nickname} <span className="text-gradient">👋</span>
          </h1>
          <p className="mt-2 text-ink-dim">
            {totalSolved === 0
              ? "Zeit für die erste Zeile Code. Fang unten an."
              : `${totalSolved} von ${totalSteps} Aufgaben geschafft – bleib dran.`}
          </p>
        </div>

        <LessonMap chapters={chapters} />

        <div className="mt-14">
          <h2 className="mb-4 text-lg font-bold tracking-tight">Deine Abzeichen</h2>
          <BadgeShelf all={BADGES.map(({ id, name, description, icon, secret }) => ({
            id,
            name,
            description,
            icon,
            secret: Boolean(secret),
          }))} earned={earnedBadges} />
        </div>
      </main>
    </div>
  );
}
