"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Bewusst eine vollständige Navigation statt router.push(): Der
        // Client-Router hat die Weiterleitung der Middleware von vorhin
        // zwischengespeichert und würde sie erneut abspielen, ohne das frisch
        // gesetzte Cookie zu berücksichtigen. `busy` bleibt gesetzt, weil die
        // Seite ohnehin gleich verlassen wird.
        window.location.assign("/admin");
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
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-faint transition hover:text-ink-dim"
        >
          <ArrowLeft className="size-4" />
          Zurück
        </Link>

        <div className="glass rounded-3xl p-8">
          <ShieldCheck className="mb-4 size-7 text-cyan" />
          <h1 className="text-2xl font-bold tracking-tight">Lehrenden-Bereich</h1>
          <p className="mt-1.5 mb-7 text-sm text-ink-dim">
            Kurse anlegen, Lektionen auswählen, Fortschritt beobachten.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink-dim">
                <KeyRound className="size-3.5" />
                Admin-Kennwort
              </span>
              <input
                type="password"
                value={password}
                autoFocus
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-abyss px-4 py-3 outline-none transition placeholder:text-ink-faint focus:border-cyan focus:ring-2 focus:ring-cyan/20"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan px-5 py-3.5 font-semibold text-void transition hover:bg-white disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              Anmelden
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
