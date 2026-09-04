"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import type { LevelInfo } from "@/lib/gamification";

export type Reward = {
  xp: number;
  leveledUp: boolean;
  level: LevelInfo;
  newBadges: { id: string; name: string; description: string; icon: string }[];
};

export function fireConfetti(intensity: "small" | "big" = "small") {
  const count = intensity === "big" ? 160 : 60;
  confetti({
    particleCount: count,
    spread: intensity === "big" ? 100 : 65,
    origin: { y: 0.7 },
    colors: ["#a78bfa", "#22d3ee", "#a3e635", "#fbbf24"],
    disableForReducedMotion: true,
  });
}

/** Kurzer XP-Hinweis, der rechts unten eingeflogen kommt. */
export function XpToast({ amount, onDone }: { amount: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      className="pointer-events-none flex items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-4 py-2 font-semibold text-lime backdrop-blur"
    >
      +{amount} XP
    </motion.div>
  );
}

/** Große Einblendung bei Level-Aufstieg oder neuem Abzeichen. */
export function RewardOverlay({ reward, onClose }: { reward: Reward | null; onClose: () => void }) {
  useEffect(() => {
    if (reward) fireConfetti("big");
  }, [reward]);

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-3xl border border-neon/40 bg-surface p-8 text-center glow-neon"
          >
            {reward.leveledUp && (
              <>
                <motion.div
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.8, repeat: 1 }}
                  className="mb-3 text-6xl"
                >
                  🎉
                </motion.div>
                <p className="text-xs uppercase tracking-widest text-ink-faint">Level {reward.level.level}</p>
                <h2 className="mt-1 text-2xl font-bold text-gradient">{reward.level.title}</h2>
                <p className="mt-2 text-sm text-ink-dim">
                  {reward.level.nextTitle
                    ? `Nächster Rang: ${reward.level.nextTitle}`
                    : "Höchster Rang erreicht. Respekt!"}
                </p>
              </>
            )}

            {reward.newBadges.length > 0 && (
              <div className={reward.leveledUp ? "mt-6 border-t border-line pt-5" : ""}>
                {!reward.leveledUp && (
                  <p className="mb-3 text-xs uppercase tracking-widest text-ink-faint">
                    Neues Abzeichen
                  </p>
                )}
                <div className="space-y-3">
                  {reward.newBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center gap-3 text-left">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-amber/40 bg-amber/10 text-2xl">
                        {badge.icon}
                      </span>
                      <div>
                        <div className="font-semibold">{badge.name}</div>
                        <div className="text-xs text-ink-dim">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-7 w-full rounded-xl bg-neon px-5 py-3 font-semibold text-void transition hover:bg-white"
            >
              Weiter geht&apos;s
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
