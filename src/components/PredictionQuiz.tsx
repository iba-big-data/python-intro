"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Brain, Check, X } from "lucide-react";
import type { Prediction } from "@/content/types";

/**
 * „Was gibt dieser Code aus?“ – erst raten, dann laufen lassen.
 * Das Raten ist der eigentliche Lerneffekt: es zwingt zum Nachdenken,
 * bevor der Computer die Antwort verrät.
 */
export function PredictionQuiz({
  prediction,
  onResolved,
}: {
  prediction: Prediction;
  onResolved: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number[]>([]);

  const correct = picked !== null && picked === prediction.correctIndex;

  function choose(index: number) {
    if (correct) return;
    setPicked(index);
    if (index === prediction.correctIndex) {
      onResolved();
    } else {
      setWrong((current) => (current.includes(index) ? current : [...current, index]));
    }
  }

  return (
    <div className="rounded-2xl border border-neon/30 bg-neon/5 p-5">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-neon">
        <Brain className="size-4" />
        Erst raten, dann ausführen
      </div>
      <p className="mb-4 text-sm text-ink-dim">Was gibt dieses Programm aus?</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {prediction.choices.map((choice, index) => {
          const isWrong = wrong.includes(index);
          const isRight = correct && index === prediction.correctIndex;

          return (
            <motion.button
              key={index}
              onClick={() => choose(index)}
              disabled={correct || isWrong}
              whileTap={{ scale: 0.98 }}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              className={`relative rounded-xl border p-3 text-left font-mono text-[13px] leading-relaxed transition ${
                isRight
                  ? "border-lime bg-lime/10 text-lime"
                  : isWrong
                    ? "border-rose/40 bg-rose/5 text-rose/60 line-through"
                    : "border-line bg-abyss hover:border-neon/60 hover:bg-surface"
              }`}
            >
              <pre className="whitespace-pre-wrap break-words">{choice}</pre>
              {isRight && <Check className="absolute right-2 top-2 size-4" />}
              {isWrong && <X className="absolute right-2 top-2 size-4" />}
            </motion.button>
          );
        })}
      </div>

      {correct && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-lime"
        >
          Richtig geraten! Jetzt lass den Code laufen und sieh es dir an.
        </motion.p>
      )}
      {!correct && wrong.length > 0 && (
        <p className="mt-3 text-sm text-amber">
          Nicht ganz – denk nochmal Schritt für Schritt durch, was Python hier tut.
        </p>
      )}
    </div>
  );
}
