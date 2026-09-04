"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { createCourse } from "@/app/admin/actions";

/** Erzeugt ein leicht merkbares, aber nicht triviales Kennwort. */
function suggestPassword(): string {
  const words = ["python", "loop", "array", "syntax", "logik", "byte", "index", "lambda"];
  const word = words[Math.floor(Math.random() * words.length)];
  return `${word}-${Math.floor(100 + Math.random() * 900)}`;
}

export function NewCourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCourse(formData);
      if (result.ok) {
        setOpen(false);
        setPassword("");
        if (result.id) router.push(`/admin/kurs/${result.id}`);
      } else {
        setError(result.error);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          setPassword(suggestPassword());
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line-bright py-4 text-sm font-medium text-ink-dim transition hover:border-cyan hover:text-cyan"
      >
        <Plus className="size-4" />
        Neuen Kurs anlegen
      </button>
    );
  }

  return (
    <form action={submit} className="glass rounded-2xl p-6">
      <h2 className="mb-5 font-semibold">Neuer Kurs</h2>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-dim">Kursname</span>
          <input
            name="name"
            required
            autoFocus
            placeholder="z. B. Wirtschaftsinformatik WS25"
            className="w-full rounded-xl border border-line bg-abyss px-4 py-3 outline-none transition placeholder:text-ink-faint focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          />
          <span className="mt-1.5 block text-xs text-ink-faint">
            Diesen Namen geben die Studierenden beim Anmelden ein. Groß-/Kleinschreibung ist egal.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-dim">Kurskennwort</span>
          <div className="flex gap-2">
            <input
              name="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-line bg-abyss px-4 py-3 font-mono outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
            <button
              type="button"
              onClick={() => setPassword(suggestPassword())}
              title="Neuen Vorschlag erzeugen"
              className="shrink-0 rounded-xl border border-line px-3 text-ink-faint transition hover:border-cyan hover:text-cyan"
            >
              <Sparkles className="size-4" />
            </button>
          </div>
          <span className="mt-1.5 block text-xs text-ink-faint">
            Gib dieses Kennwort an deine Gruppe weiter. Du kannst es jederzeit ändern.
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-dim">
            Beschreibung <span className="text-ink-faint">(optional)</span>
          </span>
          <input
            name="description"
            placeholder="z. B. Übung Donnerstag, Gruppe B"
            className="w-full rounded-xl border border-line bg-abyss px-4 py-3 outline-none transition placeholder:text-ink-faint focus:border-cyan focus:ring-2 focus:ring-cyan/20"
          />
        </label>

        {error && (
          <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 rounded-xl bg-cyan px-5 py-3 font-semibold text-void transition hover:bg-white disabled:opacity-60"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Kurs anlegen
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl border border-line px-5 py-3 text-ink-dim transition hover:border-line-bright hover:text-ink"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </form>
  );
}
