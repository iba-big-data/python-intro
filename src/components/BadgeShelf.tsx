"use client";

import { motion } from "motion/react";

export type ShelfBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  secret: boolean;
};

/** Abzeichen-Regal: Verdientes leuchtet, Offenes bleibt als Ziel sichtbar. */
export function BadgeShelf({ all, earned }: { all: ShelfBadge[]; earned: string[] }) {
  const owned = new Set(earned);

  return (
    <div>
      <p className="mb-4 text-sm text-ink-dim">
        {earned.length} von {all.length} freigeschaltet
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {all.map((badge, index) => {
          const has = owned.has(badge.id);
          const hidden = badge.secret && !has;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
                has
                  ? "border-amber/40 bg-amber/5"
                  : "border-line bg-surface/30"
              }`}
            >
              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                  has ? "bg-amber/15" : "bg-abyss grayscale opacity-40"
                }`}
              >
                {hidden ? "❓" : badge.icon}
              </span>
              <div className="min-w-0">
                <div className={`text-sm font-semibold ${has ? "text-ink" : "text-ink-faint"}`}>
                  {hidden ? "Geheimes Abzeichen" : badge.name}
                </div>
                <div className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                  {hidden ? "Finde selbst heraus, wie du es bekommst." : badge.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
