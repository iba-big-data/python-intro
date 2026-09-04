import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles, Terminal, Trophy, Zap } from "lucide-react";
import { chapters, totalSteps } from "@/content";

const features = [
  {
    icon: Terminal,
    title: "Echtes Python, direkt im Browser",
    text: "Kein Setup, keine Installation. Dein Code läuft in einer vollwertigen Python-Umgebung – inklusive NumPy, Pandas und scikit-learn.",
  },
  {
    icon: Zap,
    title: "Feedback in Sekunden",
    text: "Jede Aufgabe wird sofort geprüft. Fehlermeldungen kommen auf Deutsch und erklären, was schiefgelaufen ist.",
  },
  {
    icon: Trophy,
    title: "Fortschritt, der sich zeigt",
    text: "XP für jede gelöste Aufgabe, Level mit eigenen Titeln, Abzeichen und eine Streak, die dich am Ball hält.",
  },
];

export default function LandingPage() {
  const lessonCount = chapters.reduce((sum, chapter) => sum + chapter.lessons.length, 0);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
      {/* Kopfzeile */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🐍</span>
          <span className="text-lg font-bold tracking-tight">
            Python <span className="text-gradient">Intro</span>
          </span>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-dim transition hover:border-line-bright hover:text-ink"
        >
          <GraduationCap className="size-4" />
          Für Lehrende
        </Link>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs text-ink-dim">
          <Sparkles className="size-3.5 text-neon" />
          {lessonCount} Lektionen · {totalSteps} Aufgaben · 0 Installation
        </div>

        <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          Programmieren lernst du,
          <br />
          indem du <span className="text-gradient">programmierst</span>.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-dim">
          Kein Video-Marathon, keine Folien. Du schreibst ab der ersten Minute echten Python-Code –
          und siehst sofort, was er tut.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-full bg-neon px-7 py-3.5 font-semibold text-void transition hover:bg-white glow-neon"
          >
            Zum Kurs anmelden
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
          <p className="text-sm text-ink-faint">
            Du brauchst nur Kursname und Kennwort von deiner Lehrperson.
          </p>
        </div>
      </section>

      {/* Feature-Karten */}
      <section className="grid gap-4 pb-16 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="glass rounded-2xl p-6 transition hover:border-line-bright"
          >
            <feature.icon className="mb-4 size-6 text-neon" />
            <h3 className="mb-2 font-semibold">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-ink-dim">{feature.text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-line pt-6 text-center text-xs text-ink-faint">
        Python Intro · Lerninhalte basierend auf dem Open-Source-Projekt{" "}
        <a
          href="https://futurecoder.io"
          className="underline hover:text-ink-dim"
          target="_blank"
          rel="noreferrer"
        >
          futurecoder
        </a>{" "}
        (MIT-Lizenz)
      </footer>
    </main>
  );
}
