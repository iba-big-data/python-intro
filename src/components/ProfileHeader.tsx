"use client";

import { useState, useTransition } from "react";
import { motion } from "motion/react";
import { Check, Flame, Loader2, Pencil } from "lucide-react";
import type { LevelInfo } from "@/lib/gamification";
import { AVATARS } from "@/lib/avatars";

export function ProfileHeader({
  nickname,
  avatar,
  level,
  streakDays,
  courseName,
}: {
  nickname: string;
  avatar: string;
  level: LevelInfo;
  streakDays: number;
  courseName: string;
}) {
  const [current, setCurrent] = useState(avatar);
  const [picking, setPicking] = useState(false);
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function choose(next: string) {
    if (next === current) {
      setPicking(false);
      return;
    }

    const previous = current;
    setCurrent(next); // sofort umschalten, das fühlt sich direkter an
    setError(null);

    startSaving(async () => {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: next }),
      });

      if (!response.ok) {
        setCurrent(previous); // zurückdrehen, sonst zeigt die Seite etwas Falsches
        setError("Konnte nicht gespeichert werden. Nochmal versuchen?");
        return;
      }
      setPicking(false);
    });
  }

  return (
    <section>
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative">
          <button
            onClick={() => setPicking((value) => !value)}
            aria-label="Avatar ändern"
            className="group flex size-20 items-center justify-center rounded-3xl border border-line bg-surface text-4xl transition hover:border-neon/60"
          >
            {current}
            <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-line bg-abyss text-ink-faint transition group-hover:border-neon/60 group-hover:text-neon">
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Pencil className="size-3.5" />}
            </span>
          </button>
        </div>

        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight">{nickname}</h1>
          <p className="text-sm text-ink-dim">{courseName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-neon/30 bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
              Level {level.level} · {level.title}
            </span>
            {streakDays > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-3 py-1 text-xs font-medium text-amber">
                <Flame className="size-3.5" />
                {streakDays} {streakDays === 1 ? "Tag" : "Tage"} in Folge
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Level-Fortschritt */}
      <div className="mt-6">
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="text-ink-dim">
            {level.nextTitle ? `Nächster Rang: ${level.nextTitle}` : "Höchster Rang erreicht"}
          </span>
          <span className="tabular-nums text-ink-faint">
            {level.nextTitle
              ? `noch ${Math.max(0, level.levelSpan - level.intoLevel)} XP`
              : `${level.xp} XP gesammelt`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon to-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${level.progress * 100}%` }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
          />
        </div>
      </div>

      {picking && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-line bg-surface/50 p-4"
        >
          <p className="mb-3 text-sm text-ink-dim">Such dir ein Zeichen aus:</p>
          <div className="grid grid-cols-8 gap-2">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => choose(emoji)}
                aria-label={`Avatar ${emoji}`}
                className={`relative flex aspect-square items-center justify-center rounded-xl border text-2xl transition ${
                  emoji === current
                    ? "border-neon bg-neon/10"
                    : "border-line bg-abyss hover:border-line-bright hover:bg-surface"
                }`}
              >
                {emoji}
                {emoji === current && (
                  <Check className="absolute right-0.5 top-0.5 size-3 text-neon" />
                )}
              </button>
            ))}
          </div>
          {error && <p className="mt-3 text-sm text-rose">{error}</p>}
        </motion.div>
      )}
    </section>
  );
}
