import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStudentSession } from "@/lib/auth";
import { getProfileStats, getStudentOverview } from "@/lib/courses";
import { BADGES } from "@/lib/gamification";
import { StudentBar } from "@/components/StudentBar";
import { BadgeShelf } from "@/components/BadgeShelf";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileStatsGrid } from "@/components/ProfileStatsGrid";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getStudentSession();
  if (!session) redirect("/login");

  const overview = await getStudentOverview(session.studentId);
  if (!overview) redirect("/login");

  const stats = await getProfileStats(session.studentId, session.courseId);
  const { student, course, level, earnedBadges } = overview;

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
        <Link
          href="/lernen"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-faint transition hover:text-ink-dim"
        >
          <ArrowLeft className="size-4" />
          Zurück zum Lernpfad
        </Link>

        <ProfileHeader
          nickname={student.nickname}
          avatar={student.avatar}
          level={level}
          streakDays={student.streakDays}
          courseName={course.name}
        />

        <ProfileStatsGrid stats={stats} />

        <div className="mt-12">
          <h2 className="mb-1 text-lg font-bold tracking-tight">Deine Abzeichen</h2>
          <p className="mb-5 text-sm text-ink-dim">
            {earnedBadges.length} von {BADGES.length} freigeschaltet – bei den offenen siehst du,
            wie weit du bist.
          </p>
          <BadgeShelf
            all={BADGES.map(({ id, name, description, icon, secret, goal }) => ({
              id,
              name,
              description,
              icon,
              secret: Boolean(secret),
              goal: goal
                ? { current: Math.min(goal.current(stats.badgeStats), goal.target), target: goal.target, unit: goal.unit }
                : null,
            }))}
            earned={earnedBadges}
          />
        </div>
      </main>
    </div>
  );
}
