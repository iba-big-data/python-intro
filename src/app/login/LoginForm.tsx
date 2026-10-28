"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cookie,
  Copy,
  KeyRound,
  LifeBuoy,
  Loader2,
  User,
} from "lucide-react";

type Mode = "beitreten" | "code";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("beitreten");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  /** nach dem ersten Beitritt: Code zeigen, bevor es weitergeht */
  const [freshCode, setFreshCode] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "code" ? { code } : { password, nickname }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        if (data.resumed) {
          // Wer zurückkommt, kennt seinen Code bereits – direkt weiter.
          go();
          return;
        }
        setFreshCode(data.recoveryCode ?? null);
        setBusy(false);
        return;
      }

      setError(data.error ?? "Anmeldung fehlgeschlagen.");
    } catch {
      setError("Keine Verbindung zum Server. Bist du online?");
    }

    setBusy(false);
  }

  // Vollständige Navigation statt router.push(): Der Client-Router würde sonst
  // die zwischengespeicherte Weiterleitung der Middleware erneut abspielen und
  // das frisch gesetzte Cookie ignorieren.
  function go() {
    window.location.assign("/lernen");
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
          {freshCode ? (
            <FirstCode code={freshCode} onContinue={go} />
          ) : (
            <>
              <div className="mb-1 text-3xl">🐍</div>
              <h1 className="text-2xl font-bold tracking-tight">
                {mode === "code" ? "Willkommen zurück" : "Zum Kurs anmelden"}
              </h1>
              <p className="mt-1.5 mb-7 text-sm text-ink-dim">
                {mode === "code"
                  ? "Gib den Code ein, den du dir bei der ersten Anmeldung notiert hast."
                  : "Du brauchst nur das Kennwort, das deine Lehrperson genannt hat."}
              </p>

              <form onSubmit={submit} className="space-y-4">
                {mode === "code" ? (
                  <Field
                    icon={LifeBuoy}
                    label="Wiederherstellungscode"
                    value={code}
                    onChange={setCode}
                    placeholder="z. B. lila-otter-7f3k92"
                    mono
                    autoFocus
                  />
                ) : (
                  <>
                    <Field
                      icon={KeyRound}
                      label="Kurskennwort"
                      value={password}
                      onChange={setPassword}
                      type="password"
                      placeholder="••••••••"
                      autoFocus
                    />
                    <Field
                      icon={User}
                      label="Wie möchtest du genannt werden?"
                      value={nickname}
                      onChange={setNickname}
                      placeholder="z. B. Alex"
                      hint="Erscheint in deinem Profil und im Überblick deiner Lehrperson. Du kannst den Namen später jederzeit ändern."
                    />
                  </>
                )}

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

              {mode === "beitreten" && <CookieNote />}

              <button
                type="button"
                onClick={() => {
                  setMode(mode === "code" ? "beitreten" : "code");
                  setError(null);
                }}
                className="mt-6 w-full text-center text-sm text-ink-faint underline-offset-4 transition hover:text-ink-dim hover:underline"
              >
                {mode === "code"
                  ? "Ich bin neu dabei und habe ein Kurskennwort"
                  : "Ich war schon dabei und habe einen Wiederherstellungscode"}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

/** Der Code, einmal groß – das ist der Moment, in dem er garantiert gelesen wird. */
function FirstCode({ code, onContinue }: { code: string; onContinue: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <div className="mb-1 text-3xl">🔑</div>
      <h1 className="text-2xl font-bold tracking-tight">Das ist dein Code</h1>
      <p className="mt-1.5 mb-6 text-sm text-ink-dim">
        Notier ihn dir. Mit diesem Code kommst du an deinen Fortschritt, wenn du den Browser oder
        das Gerät wechselst – oder wenn die Cookies auf diesem Gerät verschwinden.
      </p>

      <div className="rounded-2xl border border-neon/30 bg-neon/5 p-5 text-center">
        <code className="select-all font-mono text-xl font-semibold tracking-wide text-neon">
          {code}
        </code>
      </div>

      <button
        onClick={copy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-ink-dim transition hover:border-neon/60 hover:text-ink"
      >
        {copied ? <Check className="size-3.5 text-lime" /> : <Copy className="size-3.5" />}
        {copied ? "Kopiert" : "Code kopieren"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Du findest ihn jederzeit in deinem Profil wieder – solange du angemeldet bist.
      </p>

      <button
        onClick={onContinue}
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-5 py-3.5 font-semibold text-void transition hover:bg-white"
      >
        Weiter zum Kurs
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function CookieNote() {
  return (
    <div className="mt-6 rounded-2xl border border-line bg-surface/40 p-4">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-ink-dim">
        <Cookie className="size-3.5" />
        Dein Fortschritt hängt an diesem Browser
      </p>
      <p className="text-xs leading-relaxed text-ink-faint">
        Wir speichern kein Passwort für dich – dein Zugang steckt in einem Cookie auf diesem Gerät.
        Damit dein Stand erhalten bleibt: immer dasselbe Gerät und denselben Browser benutzen, kein
        privates Fenster, und die Cookies dieser Seite nicht löschen (auch nicht über „Daten beim
        Beenden löschen“).
      </p>
      <p className="mt-2 text-xs leading-relaxed text-ink-faint">
        Gleich nach der Anmeldung bekommst du außerdem einen Code, mit dem du auf einem anderen
        Gerät weitermachen kannst.
      </p>
    </div>
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
  mono,
  autoFocus,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  mono?: boolean;
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
        className={`w-full rounded-xl border border-line bg-abyss px-4 py-3 text-ink outline-none transition placeholder:text-ink-faint focus:border-neon focus:ring-2 focus:ring-neon/20 ${
          mono ? "font-mono placeholder:font-sans" : ""
        }`}
      />
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-ink-faint">{hint}</span>}
    </label>
  );
}
