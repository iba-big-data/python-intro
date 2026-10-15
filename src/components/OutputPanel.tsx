"use client";

import { AlertTriangle, CheckCircle2, Lightbulb, Terminal } from "lucide-react";
import type { RunResult } from "@/lib/usePython";

/**
 * Zeigt das Ergebnis eines Laufs: Ausgabe, Fehler mit deutschem Hinweis
 * und – bei Übungen – einen Soll/Ist-Vergleich.
 */
export function OutputPanel({ result, busy }: { result: RunResult | null; busy: boolean }) {
  if (busy) {
    return (
      <Frame>
        <span className="flex items-center gap-2 text-ink-faint">
          <span className="size-2 animate-pulse rounded-full bg-cyan" />
          läuft …
        </span>
      </Frame>
    );
  }

  if (!result) {
    return (
      <Frame>
        <span className="text-ink-faint">
          Führ deinen Code aus, dann erscheint hier die Ausgabe.
        </span>
      </Frame>
    );
  }

  return (
    <Frame>
      {/* Übungen laufen gegen versteckte Testwerte. Ohne diese Zeile stand da
          plötzlich „Python“, obwohl die Aufgabe eine ganz andere Liste zeigt. */}
      {result.inputs && (
        <p className="mb-2 font-sans text-xs text-ink-dim">
          Gerechnet mit <span className="text-cyan">{result.inputs}</span>:
        </p>
      )}

      {result.output && (
        <pre className="whitespace-pre-wrap break-words text-ink">
          {result.output.replace(/\n+$/, "")}
        </pre>
      )}

      {result.error && (
        <div className="mt-1 space-y-2">
          <pre className="whitespace-pre-wrap break-words text-rose">{result.error.text}</pre>
          {result.error.hint && (
            <div className="flex gap-2 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2 text-amber">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0" />
              <span className="font-sans text-[13px] leading-relaxed">{result.error.hint}</span>
            </div>
          )}
        </div>
      )}

      {result.detail && (
        <div className="mt-3 space-y-2 rounded-lg border border-line bg-surface/60 p-3">
          <p className="font-sans text-xs text-ink-dim">
            Mit <span className="text-cyan">{result.detail.inputs}</span> kommt bei dir das heraus:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Compare label="Erwartet" tone="lime" value={result.detail.expected} />
            <Compare label="Dein Ergebnis" tone="rose" value={result.detail.actual} />
          </div>
        </div>
      )}

      {!result.output && !result.error && !result.detail && (
        <span className="text-ink-faint">
          Kein Fehler, aber auch keine Ausgabe. Vielleicht fehlt ein <code>print(...)</code>?
        </span>
      )}
    </Frame>
  );
}

function Compare({ label, tone, value }: { label: string; tone: "lime" | "rose"; value: string }) {
  const color = tone === "lime" ? "text-lime border-lime/30" : "text-rose border-rose/30";
  return (
    <div className={`rounded-md border ${color} bg-abyss/60 p-2`}>
      <div className="mb-1 font-sans text-[11px] uppercase tracking-wide opacity-70">{label}</div>
      <pre className="whitespace-pre-wrap break-words text-[12px]">{value || "(nichts)"}</pre>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-[#08080f]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5 text-[11px] uppercase tracking-wider text-ink-faint">
        <Terminal className="size-3" />
        Ausgabe
      </div>
      <div className="flex-1 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed">
        {children}
      </div>
    </div>
  );
}

/** Grüner Erfolgsbalken über dem Editor. */
export function SolvedBanner({ message }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-lime/30 bg-lime/10 px-4 py-2.5 text-sm text-lime">
      <CheckCircle2 className="size-4" />
      {message ?? "Gelöst! Weiter zum nächsten Schritt."}
    </div>
  );
}

/** Roter Hinweis, wenn die Prüfung nicht bestanden wurde. */
export function TryAgainBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 border-b border-amber/30 bg-amber/10 px-4 py-2.5 text-sm text-amber">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
