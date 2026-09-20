"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, LifeBuoy } from "lucide-react";

/**
 * Der Wiederherstellungscode im Profil.
 *
 * Standardmäßig verdeckt: die Profilseite wird im Kurs auch mal auf einem
 * Beamer oder über die Schulter gelesen, und wer den Code kennt, kommt in
 * diesen Fortschritt.
 */
export function RecoveryCodeCard({ code }: { code: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section className="mt-12 rounded-2xl border border-line bg-surface/40 p-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold tracking-tight">
        <LifeBuoy className="size-4 text-cyan" />
        Dein Wiederherstellungscode
      </h2>
      <p className="mb-5 text-sm leading-relaxed text-ink-dim">
        Dein Fortschritt hängt an einem Cookie in diesem Browser. Mit diesem Code kommst du auch auf
        einem anderen Gerät wieder an deinen Stand – oder wenn die Cookies hier gelöscht wurden.
        Notier ihn dir am besten einmal.
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <code
          className={`flex-1 rounded-xl border border-line bg-abyss px-4 py-3 font-mono text-lg tracking-wide transition ${
            shown ? "select-all text-cyan" : "select-none text-ink-faint blur-sm"
          }`}
        >
          {shown ? code : "xxxx-xxxxx-xxxxxx"}
        </code>

        <button
          onClick={() => setShown((value) => !value)}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-ink-dim transition hover:border-cyan hover:text-cyan"
        >
          {shown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {shown ? "Verbergen" : "Anzeigen"}
        </button>

        <button
          onClick={copy}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-ink-dim transition hover:border-cyan hover:text-cyan"
        >
          {copied ? <Check className="size-3.5 text-lime" /> : <Copy className="size-3.5" />}
          {copied ? "Kopiert" : "Kopieren"}
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Gib den Code nicht weiter: Wer ihn hat, sieht deinen Fortschritt und kann in deinem Namen
        weiterlernen.
      </p>
    </section>
  );
}
