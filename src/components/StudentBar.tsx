"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Flame, LogOut, Zap } from "lucide-react";
import type { LevelInfo } from "@/lib/gamification";

/** Kopfzeile des Lernbereichs: Identität, Level-Fortschritt, Streak. */
export function StudentBar({
  student,
  level,
  courseName,
}: {
  student: { nickname: string; avatar: string; xp: number; streakDays: number };
  level: LevelInfo;
  courseName: string;
}) {

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
        <Link href="/lernen" className="flex shrink-0 items-center gap-2">
          <span className="text-xl">🐍</span>
          <span className="hidden font-bold tracking-tight sm:inline">
            Python <span className="text-gradient">Intro</span>
          </span>
        </Link>

        <span className="hidden truncate text-xs text-ink-faint md:inline">{courseName}</span>

        <div className="flex flex-1 items-center justify-end gap-3">
          {student.streakDays > 0 && (
            <div
              className="flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber"
              title={`${student.streakDays} Tage in Folge gelernt`}
            >
              <Flame className="size-3.5" />
              {student.streakDays}
            </div>
          )}

          <div className="hidden w-40 sm:block">
            <div className="mb-1 flex items-baseline justify-between text-[11px]">
              <span className="font-medium text-neon">{level.title}</span>
              <span className="tabular-nums text-ink-faint">
                {level.intoLevel}/{level.levelSpan}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon to-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${level.progress * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-ink-dim" title="Gesammelte XP">
            <Zap className="size-3.5 text-lime" />
            <span className="tabular-nums">{student.xp}</span>
          </div>

          <span
            className="flex size-9 items-center justify-center rounded-xl border border-line bg-surface text-lg"
            title={student.nickname}
          >
            {student.avatar}
          </span>

          <button
            onClick={logout}
            title="Abmelden"
            className="rounded-lg p-2 text-ink-faint transition hover:bg-surface hover:text-ink"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
