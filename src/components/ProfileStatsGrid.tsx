import { Award, BookOpen, CheckCircle2, TrendingUp, Users, Zap } from "lucide-react";
import type { ProfileStats } from "@/lib/courses";

/** Zahlenkacheln auf der Profilseite. */
export function ProfileStatsGrid({ stats }: { stats: ProfileStats }) {
  const { badgeStats } = stats;

  const tiles = [
    {
      icon: Zap,
      label: "Eingesammelte XP",
      value: stats.earnedXp.toLocaleString("de-DE"),
      hint: `von ${stats.possibleXp.toLocaleString("de-DE")} im Kurs möglich`,
      tone: "text-lime",
    },
    {
      icon: CheckCircle2,
      label: "Gelöste Aufgaben",
      value: `${stats.solvedSteps}`,
      hint: `von ${stats.totalSteps}`,
      tone: "text-neon",
    },
    {
      icon: BookOpen,
      label: "Fertige Lektionen",
      value: `${badgeStats.completedLessons}`,
      hint: `von ${stats.totalLessons} · ${badgeStats.completedChapters}/${stats.totalChapters} Kapitel`,
      tone: "text-cyan",
    },
    {
      icon: Award,
      label: "Ohne Tipp gelöst",
      value: `${badgeStats.noHintSolves}`,
      hint: `von ${badgeStats.solvedExercises} Übungen`,
      tone: "text-amber",
    },
  ];

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-line bg-surface/40 p-4">
            <tile.icon className={`mb-2 size-4 ${tile.tone}`} />
            <div className="text-2xl font-bold tabular-nums tracking-tight">{tile.value}</div>
            <div className="mt-0.5 text-xs font-medium text-ink-dim">{tile.label}</div>
            <div className="mt-1 text-[11px] leading-snug text-ink-faint">{tile.hint}</div>
          </div>
        ))}
      </div>

      {stats.percentile !== null ? (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-surface/40 p-4">
          <TrendingUp className="mt-0.5 size-4 shrink-0 text-neon" />
          <div>
            <div className="text-sm font-semibold">
              Du liegst vor {stats.percentile} % deines Kurses
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
              Gemessen an den XP der {stats.courseSize} Teilnehmenden, die schon angefangen haben.
              Namen und Plätze zeigen wir bewusst nicht – der Vergleich soll anspornen, nicht
              bloßstellen.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-line bg-surface/40 p-4">
          <Users className="mt-0.5 size-4 shrink-0 text-ink-faint" />
          <p className="text-xs leading-relaxed text-ink-faint">
            Sobald mindestens fünf Personen in deinem Kurs losgelegt haben, siehst du hier, wo du im
            Vergleich stehst.
          </p>
        </div>
      )}
    </div>
  );
}
