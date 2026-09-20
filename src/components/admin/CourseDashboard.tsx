"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AlertTriangle, Eraser, Flame, Loader2, RefreshCw, Users, Zap } from "lucide-react";
import type { CourseDashboard as DashboardData } from "@/lib/dashboard";
import { removeGhostStudents } from "@/app/admin/actions";

function timeAgo(date: Date | string): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const minutes = Math.floor((Date.now() - then.getTime()) / 60000);

  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "gestern";
  return `vor ${days} Tagen`;
}

export function CourseDashboard({ courseId, data }: { courseId: string; data: DashboardData }) {
  const router = useRouter();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [cleaning, startCleaning] = useTransition();

  // Live-Ansicht: alle 30 Sekunden neu laden, solange die Seite offen ist.
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(timer);
  }, [autoRefresh, router]);

  if (data.students.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-10 text-center">
        <div className="mb-3 text-4xl">👋</div>
        <h3 className="font-semibold">Noch niemand angemeldet</h3>
        <p className="mt-2 text-sm text-ink-dim">
          Sobald sich die ersten Studierenden mit dem Kurskennwort anmelden, siehst du hier ihren
          Fortschritt in Echtzeit.
        </p>
      </div>
    );
  }

  const averageSolved =
    data.students.reduce((sum, student) => sum + student.solvedSteps, 0) / data.students.length;

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Users} label="Teilnehmende" value={String(data.students.length)} />
        <Stat icon={Flame} label="Heute aktiv" value={String(data.activeToday)} />
        <Stat
          icon={Zap}
          label="Ø gelöste Aufgaben"
          value={`${averageSolved.toFixed(1)} / ${data.totalSteps}`}
        />
      </div>

      {data.stuckSteps.length > 0 && (
        <section>
          <h3 className="mb-1 flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4 text-amber" />
            Hier hakt es
          </h3>
          <p className="mb-4 text-sm text-ink-dim">
            Aufgaben, die im Schnitt die meisten Versuche kosten – gute Kandidaten für die nächste
            Übungsstunde.
          </p>

          <div className="space-y-2">
            {data.stuckSteps.map((step) => (
              <div
                key={`${step.lessonId}-${step.stepId}`}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface/40 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {step.lessonTitle}
                    <span className="ml-2 text-xs font-normal text-ink-faint">
                      Schritt {step.stepNumber}
                    </span>
                  </div>
                  <div className="text-xs text-ink-faint">
                    {step.solvedBy} von {step.learners} haben es gelöst
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-sm text-amber">
                    {step.averageAttempts.toFixed(1)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wide text-ink-faint">
                    Ø Versuche
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.ghosts > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface/40 px-4 py-3">
          <p className="flex-1 text-sm text-ink-dim">
            {data.ghosts === 1
              ? "Ein Profil hat noch keine einzige Aufgabe bearbeitet und ist seit über einem Tag still."
              : `${data.ghosts} Profile haben noch keine einzige Aufgabe bearbeitet und sind seit über einem Tag still.`}{" "}
            Meist steckt eine doppelte Anmeldung dahinter.
          </p>
          <button
            onClick={() =>
              startCleaning(async () => {
                await removeGhostStudents(courseId);
                router.refresh();
              })
            }
            disabled={cleaning}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm transition hover:border-cyan hover:text-cyan disabled:opacity-60"
          >
            {cleaning ? <Loader2 className="size-3.5 animate-spin" /> : <Eraser className="size-3.5" />}
            Aufräumen
          </button>
        </div>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Fortschritt der Gruppe</h3>
          <button
            onClick={() => setAutoRefresh((value) => !value)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
              autoRefresh
                ? "border-lime/40 bg-lime/10 text-lime"
                : "border-line text-ink-faint hover:text-ink-dim"
            }`}
          >
            <RefreshCw className={`size-3 ${autoRefresh ? "animate-spin [animation-duration:3s]" : ""}`} />
            {autoRefresh ? "Live" : "Pausiert"}
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line">
          {data.students.map((student, index) => {
            const percent = data.totalSteps
              ? (student.solvedSteps / data.totalSteps) * 100
              : 0;

            return (
              <div
                key={student.id}
                className={`flex items-center gap-4 px-4 py-3 ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-abyss text-lg">
                  {student.avatar}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-medium">{student.nickname}</span>
                    <span className="shrink-0 text-[11px] text-neon">{student.levelTitle}</span>
                    {student.streakDays > 1 && (
                      <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-amber">
                        <Flame className="size-3" />
                        {student.streakDays}
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-ink-faint">
                    {student.currentLesson ?? "noch nicht gestartet"} · {timeAgo(student.lastActiveAt)}
                  </div>
                </div>

                <div className="hidden w-32 shrink-0 sm:block">
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-neon to-cyan"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="w-16 shrink-0 text-right">
                  <div className="text-sm tabular-nums">
                    {student.solvedSteps}
                    <span className="text-ink-faint">/{data.totalSteps}</span>
                  </div>
                  <div className="text-[10px] text-ink-faint">{student.xp} XP</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface/40 p-4">
      <Icon className="mb-2 size-4 text-cyan" />
      <div className="text-xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-ink-faint">{label}</div>
    </div>
  );
}
