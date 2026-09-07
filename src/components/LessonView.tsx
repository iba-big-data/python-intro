"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Flame,
  Loader2,
  Play,
  RefreshCw,
} from "lucide-react";
import type { Lesson, Step } from "@/content/types";
import { stepXp } from "@/content/types";
import { levelInfo, todayKey, xpAfterHints, type LevelInfo } from "@/lib/gamification";
import { usePython, type RunResult } from "@/lib/usePython";
import { Markdown } from "./Markdown";
import { CodeEditor } from "./CodeEditor";
import { PythonShell, type ShellEntry } from "./PythonShell";
import { OutputPanel, SolvedBanner, TryAgainBanner } from "./OutputPanel";
import { HintBox } from "./HintBox";
import { PredictionQuiz } from "./PredictionQuiz";
import { fireConfetti, RewardOverlay, XpToast, type Reward } from "./Celebration";

export type LessonViewProps = {
  lesson: Lesson;
  chapterTitle: string;
  solvedStepIds: string[];
  hintsUsedByStep: Record<string, number>;
  nextLessonId: string | null;
  student: { nickname: string; avatar: string; xp: number; streakDays: number };
  /**
   * Streckfaktor der Level-Kurve für diesen Kurs. Nach jeder Lösung liefert die
   * API das fertig gerechnete Level; gebraucht wird der Faktor für den ersten
   * Stand, bevor überhaupt etwas gemeldet wurde.
   */
  levelScale: number;
};

/** Was der Python-Checker über einen Step wissen muss. */
function checkSpec(step: Step): Record<string, unknown> {
  switch (step.kind) {
    case "run":
      return {
        kind: "run",
        program: step.program,
        expectsError: step.expectsError,
        stdin: step.stdin,
      };
    case "experiment":
      return {
        kind: "experiment",
        requireAst: step.requireAst,
        astMessage: step.astMessage,
        requireOutput: step.requireOutput,
        requireVariable: step.requireVariable,
        anyValidCode: step.anyValidCode,
      };
    case "exercise":
      return {
        kind: "exercise",
        mode: step.mode,
        params: step.params,
        tests: step.tests,
        functionName: step.functionName,
        disallowedAst: step.disallowedAst,
      };
    default:
      return { kind: "read" };
  }
}

function surfaceOf(step: Step): "editor" | "shell" {
  return step.kind === "run" || step.kind === "experiment" ? step.surface : "editor";
}

function starterCode(step: Step): string {
  if (step.kind === "exercise") return step.starter ?? "";
  if (step.kind === "run" && step.surface === "editor") return "";
  return "";
}

export function LessonView({
  lesson,
  chapterTitle,
  solvedStepIds,
  hintsUsedByStep,
  nextLessonId,
  student,
  levelScale,
}: LessonViewProps) {
  const python = usePython();

  const [solved, setSolved] = useState<Set<string>>(new Set(solvedStepIds));
  const firstUnsolved = lesson.steps.findIndex((step) => !solved.has(step.id));
  const [index, setIndex] = useState(firstUnsolved === -1 ? lesson.steps.length : firstUnsolved);

  const finished = index >= lesson.steps.length;
  const step = finished ? null : lesson.steps[index];

  const [codeByStep, setCodeByStep] = useState<Record<string, string>>({});
  const [result, setResult] = useState<RunResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [hints, setHints] = useState<Record<string, number>>(hintsUsedByStep);
  const [solutionShown, setSolutionShown] = useState<Set<string>>(new Set());
  const [predictionDone, setPredictionDone] = useState<Set<string>>(new Set());
  const [shellEntries, setShellEntries] = useState<ShellEntry[]>([]);
  const [tab, setTab] = useState<"editor" | "shell">("editor");

  const [xp, setXp] = useState(student.xp);
  const [streak, setStreak] = useState(student.streakDays);
  const [level, setLevel] = useState<LevelInfo>(() => levelInfo(student.xp, levelScale));
  const [reward, setReward] = useState<Reward | null>(null);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const textRef = useRef<HTMLDivElement>(null);

  // Beim Step-Wechsel: passende Eingabefläche wählen, Ausgabe leeren
  useEffect(() => {
    if (!step) return;
    setTab(surfaceOf(step));
    setResult(null);
    textRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const code = step ? (codeByStep[step.id] ?? starterCode(step)) : "";
  const setCode = useCallback(
    (value: string) => {
      if (!step) return;
      setCodeByStep((current) => ({ ...current, [step.id]: value }));
    },
    [step],
  );

  /** Fortschritt an den Server melden und Belohnungen einsammeln. */
  const report = useCallback(
    async (stepId: string, didSolve: boolean, usedHints: number, submitted: string) => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          stepId,
          solved: didSolve,
          hintsUsed: usedHints,
          code: submitted,
          hourOfDay: new Date().getHours(),
          // Der Server läuft in UTC – für die Streak zählt aber unser Tag.
          today: todayKey(),
        }),
      });

      if (!response.ok) return;
      const data = await response.json();

      setXp(data.xp);
      setLevel(data.level);
      setStreak(data.streakDays);

      if (data.newlySolved) {
        // Der Server sagt jetzt direkt, was dieser Step wert war – vorher wurde
        // das aus der XP-Summe zurückgerechnet, was bei zwei schnell
        // aufeinanderfolgenden Meldungen danebenlag.
        const gained: number = data.earnedXp ?? 0;

        if (data.leveledUp || data.newBadges.length > 0) {
          setReward({
            xp: gained,
            leveledUp: data.leveledUp,
            level: data.level,
            newBadges: data.newBadges,
          });
        } else {
          setXpToast(gained > 0 ? gained : null);
          fireConfetti("small");
        }
      }
    },
    [lesson.id],
  );

  const handleResult = useCallback(
    (stepId: string, runResult: RunResult, submitted: string) => {
      setResult(runResult);
      const alreadySolved = solved.has(stepId);

      if (runResult.passed && !alreadySolved) {
        setSolved((current) => new Set(current).add(stepId));
      }
      void report(stepId, runResult.passed, hints[stepId] ?? 0, submitted);
    },
    [solved, hints, report],
  );

  const runEditor = useCallback(async () => {
    if (!step || busy || !python.ready) return;
    setBusy(true);
    const runResult = await python.run(code, "editor", checkSpec(step));
    setBusy(false);
    handleResult(step.id, runResult, code);
  }, [step, busy, python, code, handleResult]);

  /**
   * Freies Ausprobieren: Code läuft, wird aber nicht geprüft und nicht gemeldet.
   * Damit kann man eine Variante durchspielen, ohne einen Fehlversuch zu
   * kassieren – und ohne die Vorlage exakt treffen zu müssen.
   */
  const runScratch = useCallback(async () => {
    if (!step || busy || !python.ready) return;
    setBusy(true);
    const runResult = await python.run(code, "editor", { kind: "scratch" });
    setBusy(false);
    setResult(runResult);
  }, [step, busy, python, code]);

  const runShell = useCallback(
    async (input: string) => {
      if (!step || busy) return;
      setBusy(true);
      const runResult = await python.run(input, "shell", checkSpec(step));
      setBusy(false);

      setShellEntries((current) => [
        ...current,
        {
          input,
          output: runResult.error ? runResult.error.text : runResult.output,
          isError: Boolean(runResult.error),
        },
      ]);
      handleResult(step.id, runResult, input);
    },
    [step, busy, python, handleResult],
  );

  const completeRead = useCallback(() => {
    if (!step) return;
    setSolved((current) => new Set(current).add(step.id));
    void report(step.id, true, 0, "");
    setIndex((current) => current + 1);
  }, [step, report]);

  const revealHint = useCallback(() => {
    if (!step) return;
    setHints((current) => ({ ...current, [step.id]: (current[step.id] ?? 0) + 1 }));
  }, [step]);

  const stepSolved = step ? solved.has(step.id) : false;
  const solvedCount = lesson.steps.filter((s) => solved.has(s.id)).length;

  // XP dieser Lektion: eingesammelt (nach Tipp-Abzug) und insgesamt möglich.
  const lessonXpEarned = lesson.steps
    .filter((s) => solved.has(s.id))
    .reduce((sum, s) => sum + xpAfterHints(stepXp(s), hints[s.id] ?? 0), 0);
  const lessonXpTotal = lesson.steps.reduce((sum, s) => sum + stepXp(s), 0);
  const needsPrediction =
    step?.kind === "run" && step.prediction && !predictionDone.has(step.id) && !stepSolved;

  const hintList = useMemo(() => {
    if (!step) return [];
    if (step.kind === "exercise") return step.hints;
    if (step.kind === "experiment") return step.hints ?? [];
    return [];
  }, [step]);

  const solutionCode = useMemo(() => {
    if (!step) return undefined;
    if (step.kind === "exercise") return step.solution;
    if (step.kind === "experiment") return step.example;
    return undefined;
  }, [step]);

  return (
    <div className="flex h-screen flex-col">
      <Header
        chapterTitle={chapterTitle}
        lessonTitle={lesson.title}
        solvedCount={solvedCount}
        total={lesson.steps.length}
        lessonXpEarned={lessonXpEarned}
        lessonXpTotal={lessonXpTotal}
        level={level}
        xp={xp}
        streak={streak}
        student={student}
      />

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ---------------- linke Spalte: Lektionstext ---------------- */}
        <section
          ref={textRef}
          className="overflow-y-auto border-r border-line px-6 py-7 lg:px-10"
        >
          <div className="mx-auto max-w-2xl">
            <StepDots
              steps={lesson.steps}
              index={index}
              solved={solved}
              onJump={(target) => setIndex(target)}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={finished ? "outro" : step!.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {finished ? (
                  <Outro
                    lesson={lesson}
                    nextLessonId={nextLessonId}
                    earnedXp={lessonXpEarned}
                    possibleXp={lessonXpTotal}
                    solvedCount={solvedCount}
                  />
                ) : (
                  <>
                    <Markdown>{step!.text}</Markdown>

                    {needsPrediction && (
                      <div className="mt-6">
                        <PredictionQuiz
                          prediction={step!.kind === "run" ? step!.prediction! : { choices: [], correctIndex: 0 }}
                          onResolved={() =>
                            setPredictionDone((current) => new Set(current).add(step!.id))
                          }
                        />
                      </div>
                    )}

                    {(hintList.length > 0 || solutionCode) && !stepSolved && (
                      <div className="mt-7">
                        <HintBox
                          hints={hintList}
                          revealed={hints[step!.id] ?? 0}
                          onReveal={revealHint}
                          solution={solutionCode}
                          solutionShown={solutionShown.has(step!.id)}
                          onShowSolution={() =>
                            setSolutionShown((current) => new Set(current).add(step!.id))
                          }
                        />
                      </div>
                    )}

                    {step!.kind === "read" && (
                      <button
                        onClick={completeRead}
                        className="group mt-8 flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-void transition hover:bg-white"
                      >
                        Verstanden
                        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ---------------- rechte Spalte: Code ---------------- */}
        {!finished && step!.kind !== "read" && (
          <section className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-line bg-surface/40 px-3">
              <div className="flex">
                {(["editor", "shell"] as const).map((name) => (
                  <button
                    key={name}
                    onClick={() => setTab(name)}
                    className={`border-b-2 px-4 py-2.5 text-sm transition ${
                      tab === name
                        ? "border-neon text-ink"
                        : "border-transparent text-ink-faint hover:text-ink-dim"
                    }`}
                  >
                    {name === "editor" ? "Editor" : "Shell"}
                  </button>
                ))}
              </div>
              <PythonStatus
                phase={python.phase}
                text={python.statusText}
                progress={python.progress}
                onRestart={python.restart}
              />
            </div>

            {stepSolved && <SolvedBanner />}
            {!stepSolved && result && !result.passed && result.message && (
              <TryAgainBanner message={result.message} />
            )}

            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)]">
              <div className="min-h-0 overflow-hidden border-b border-line">
                {tab === "editor" ? (
                  <div className="flex h-full flex-col">
                    <div className="min-h-0 flex-1 overflow-auto">
                      <CodeEditor value={code} onChange={setCode} onRun={runEditor} />
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-line bg-surface/40 px-3 py-2">
                      <span className="min-w-0 truncate text-xs text-ink-faint">
                        {step!.task ?? "Schreib deinen Code und führ ihn aus."}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={runScratch}
                          disabled={busy || !python.ready}
                          title="Führt den Code aus, ohne ihn zu prüfen – zum Ausprobieren."
                          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-ink-dim transition hover:border-line-bright hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <FlaskConical className="size-3.5" />
                          <span className="hidden sm:inline">Ausprobieren</span>
                        </button>
                        <button
                          onClick={runEditor}
                          disabled={busy || !python.ready || Boolean(needsPrediction)}
                          title={needsPrediction ? "Rate erst, was herauskommt." : "Strg/Cmd + Enter"}
                          className="flex items-center gap-1.5 rounded-lg bg-lime px-4 py-2 text-sm font-semibold text-void transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                          Ausführen
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PythonShell
                    entries={shellEntries}
                    onSubmit={runShell}
                    onReset={() => {
                      python.resetShell();
                      setShellEntries([]);
                    }}
                    busy={busy}
                    disabled={!python.ready || Boolean(needsPrediction)}
                  />
                )}
              </div>

              <div className="min-h-0">
                <OutputPanel result={result} busy={busy} />
              </div>
            </div>

            {stepSolved && (
              <div className="border-t border-line bg-lime/5 px-4 py-3">
                <button
                  onClick={() => setIndex((current) => current + 1)}
                  autoFocus
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 font-semibold text-void transition hover:bg-white"
                >
                  {index === lesson.steps.length - 1 ? "Lektion abschließen" : "Nächster Schritt"}
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Lesestep oder Abschluss: rechte Spalte zeigt Ruhe statt Editor */}
        {(finished || step?.kind === "read") && (
          <aside className="hidden items-center justify-center p-10 lg:flex">
            <div className="text-center">
              <div className="mb-3 text-6xl opacity-40">{finished ? "🏁" : "📖"}</div>
              <p className="max-w-xs text-sm text-ink-faint">
                {finished
                  ? "Lektion geschafft. Weiter unten geht die Reise."
                  : "Bei diesem Schritt geht es ums Lesen – gleich darfst du wieder tippen."}
              </p>
            </div>
          </aside>
        )}
      </div>

      <RewardOverlay reward={reward} onClose={() => setReward(null)} />

      {/* Oben mittig statt unten rechts: dort schaut man beim Lösen ohnehin hin,
          direkt unter Fortschrittsbalken und XP-Anzeige. */}
      <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center">
        <AnimatePresence>
          {xpToast !== null && <XpToast amount={xpToast} onDone={() => setXpToast(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Teilstücke
 * ------------------------------------------------------------------ */
function Header({
  chapterTitle,
  lessonTitle,
  solvedCount,
  total,
  lessonXpEarned,
  lessonXpTotal,
  level,
  xp,
  streak,
  student,
}: {
  chapterTitle: string;
  lessonTitle: string;
  solvedCount: number;
  total: number;
  lessonXpEarned: number;
  lessonXpTotal: number;
  level: LevelInfo;
  xp: number;
  streak: number;
  student: { nickname: string; avatar: string };
}) {
  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-line bg-surface/50 px-4 py-2.5 backdrop-blur">
      <Link
        href="/lernen"
        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-ink-dim transition hover:bg-surface hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        <span className="hidden sm:inline">Lernpfad</span>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="truncate text-xs text-ink-faint">{chapterTitle}</div>
        <div className="truncate text-sm font-semibold">{lessonTitle}</div>
      </div>

      <div className="hidden items-center gap-2.5 sm:flex">
        <div className="w-32">
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-lime"
              animate={{ width: `${total ? (solvedCount / total) * 100 : 0}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            />
          </div>
          <div className="mt-1 flex items-baseline justify-between text-[10px] tabular-nums text-ink-faint">
            <span>
              {solvedCount}/{total} Aufgaben
            </span>
            <span
              className="flex items-center gap-0.5 text-lime"
              title={`${lessonXpEarned} von ${lessonXpTotal} XP in dieser Lektion`}
            >
              ⚡ {lessonXpEarned}/{lessonXpTotal}
            </span>
          </div>
        </div>
      </div>

      {streak > 0 && (
        <div
          className="flex items-center gap-1 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber"
          title={`${streak} Tage in Folge`}
        >
          <Flame className="size-3.5" />
          {streak}
        </div>
      )}

      <div className="flex items-center gap-2.5" title={`${xp} XP – ${level.title}`}>
        <div className="hidden text-right sm:block">
          <div className="text-[11px] leading-tight text-ink-faint">Level {level.level}</div>
          <div className="text-xs font-semibold leading-tight text-neon">{level.title}</div>
        </div>
        <Link href="/profil" className="relative" title={`${student.nickname} – Profil und Abzeichen`}>
          <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-abyss text-lg transition hover:border-neon/60">
            {student.avatar}
          </span>
          <svg className="pointer-events-none absolute -inset-1" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="var(--color-neon)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${level.progress * 125.6} 125.6`}
              transform="rotate(-90 22 22)"
              opacity="0.85"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}

function StepDots({
  steps,
  index,
  solved,
  onJump,
}: {
  steps: Step[];
  index: number;
  solved: Set<string>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-center gap-1.5">
      {steps.map((step, i) => {
        const isSolved = solved.has(step.id);
        const isCurrent = i === index;
        const reachable = isSolved || i <= index;

        return (
          <button
            key={step.id}
            disabled={!reachable}
            onClick={() => onJump(i)}
            title={`Schritt ${i + 1}${isSolved ? " – gelöst" : ""}`}
            className={`h-1.5 rounded-full transition-all ${
              isCurrent
                ? "w-8 bg-neon"
                : isSolved
                  ? "w-4 bg-lime/70 hover:bg-lime"
                  : reachable
                    ? "w-4 bg-line-bright"
                    : "w-4 bg-line"
            } ${reachable ? "cursor-pointer" : "cursor-default"}`}
          />
        );
      })}
      <span className="ml-2 text-xs text-ink-faint">
        Schritt {Math.min(index + 1, steps.length)} von {steps.length}
      </span>
    </div>
  );
}

function Outro({
  lesson,
  nextLessonId,
  earnedXp,
  possibleXp,
  solvedCount,
}: {
  lesson: Lesson;
  nextLessonId: string | null;
  earnedXp: number;
  possibleXp: number;
  solvedCount: number;
}) {
  useEffect(() => {
    fireConfetti("big");
  }, []);

  const complete = solvedCount >= lesson.steps.length;
  const missing = Math.max(0, possibleXp - earnedXp);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="size-7 text-lime" />
        <h1 className="text-2xl font-bold">Lektion abgeschlossen</h1>
      </div>

      <Markdown>{lesson.outro}</Markdown>

      {/* Was tatsächlich hängen geblieben ist – nicht, was theoretisch möglich war. */}
      <div className="mt-8 rounded-2xl border border-lime/30 bg-lime/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <div className="text-xl font-bold text-lime">
              +{earnedXp} XP eingesammelt
            </div>
            <div className="text-xs text-ink-dim">
              {complete && missing === 0
                ? "Alles gelöst, ohne einen Tipp – die volle Punktzahl."
                : complete
                  ? `Von ${possibleXp} XP möglich – die Differenz sind die Tipps, die du gebraucht hast.`
                  : `Von ${possibleXp} XP möglich. Offene Schritte kannst du jederzeit nachholen.`}
            </div>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-lime transition-all"
            style={{ width: `${possibleXp ? (earnedXp / possibleXp) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {nextLessonId ? (
          <Link
            href={`/lernen/${nextLessonId}`}
            className="group flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-void transition hover:bg-white"
          >
            Nächste Lektion
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            href="/lernen"
            className="flex items-center gap-2 rounded-full bg-neon px-6 py-3 font-semibold text-void transition hover:bg-white"
          >
            Zurück zum Lernpfad
          </Link>
        )}
        <Link
          href="/lernen"
          className="flex items-center gap-2 rounded-full border border-line px-6 py-3 text-ink-dim transition hover:border-line-bright hover:text-ink"
        >
          Übersicht
        </Link>
      </div>
    </div>
  );
}

function PythonStatus({
  phase,
  text,
  progress,
  onRestart,
}: {
  phase: string;
  text: string | null;
  progress: number;
  onRestart: () => void;
}) {
  if (phase === "ready") {
    return (
      <span className="flex items-center gap-1.5 py-2 text-[11px] text-ink-faint">
        <span className="size-1.5 rounded-full bg-lime" />
        Python bereit
      </span>
    );
  }

  if (phase === "error") {
    return (
      <button
        onClick={onRestart}
        className="flex items-center gap-1.5 py-2 text-[11px] text-rose hover:underline"
      >
        <RefreshCw className="size-3" />
        Neu starten
      </button>
    );
  }

  // Beim ersten Start lädt der Browser rund 15 MB. Ohne sichtbaren Balken wirkt
  // das wie ein Hänger – gerade im Uni-WLAN.
  return (
    <span className="flex items-center gap-2 py-2 text-[11px] text-cyan">
      <Loader2 className="size-3 shrink-0 animate-spin" />
      <span className="hidden max-w-[18rem] truncate sm:inline">{text ?? "lädt …"}</span>
      <span className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-line">
        <span
          className="block h-full rounded-full bg-cyan transition-all duration-500"
          style={{ width: `${Math.max(5, Math.min(100, progress * 100))}%` }}
        />
      </span>
    </span>
  );
}
