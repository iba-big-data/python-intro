"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, Loader2, User, Users } from "lucide-react";

export default function LoginPage() {
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course, password, nickname }),
      });

      if (response.ok) {
        // Vollständige Navigation statt router.push(): Der Client-Router würde
        // sonst die zwischengespeicherte Weiterleitung der Middleware erneut
        // abspielen und das frisch gesetzte Cookie ignorieren.
        window.location.assign("/lernen");
        return;
      }

      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Anmeldung fehlgeschlagen.");
    } catch {
      setError("Keine Verbindung zum Server. Bist du online?");
    }

    setBusy(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-faint transition hover:text-ink-dim"
        >
          <ArrowLeft className="size-4" />
          Zurück
        </Link>

        <div className="glass rounded-3xl p-8">
          <div className="mb-1 text-3xl">🐍</div>
          <h1 className="text-2xl font-bold tracking-tight">Willkommen zurück</h1>
          <p className="mt-1.5 mb-7 text-sm text-ink-dim">
            Melde dich mit den Kursdaten deiner Lehrperson an.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <Field
              icon={Users}
              label="Kursname"
              value={course}
              onChange={setCourse}
              placeholder="z. B. Wirtschaftsinformatik WS25"
              autoFocus
            />
            <Field
              icon={KeyRound}
              label="Kurskennwort"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="••••••••"
            />
            <Field
              icon={User}
              label="Dein Anzeigename"
              value={nickname}
              onChange={setNickname}
              placeholder="z. B. Alex"
              hint="Damit merkt sich Python Intro deinen Fortschritt. Nutze denselben Namen beim nächsten Mal wieder."
            />

            {error && (
              <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3.5 font-semibold text-void transition hover:bg-white disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Einen Moment …
                </>
              ) : (
                <>
                  Los geht&apos;s
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  autoFocus,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-dim">
        <Icon className="size-3.5" />
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line bg-abyss px-4 py-3 text-ink outline-none transition placeholder:text-ink-faint focus:border-neon focus:ring-2 focus:ring-neon/20"
      />
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-ink-faint">{hint}</span>}
    </label>
  );
}
