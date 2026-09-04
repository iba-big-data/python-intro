"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Check, Copy, Loader2, Trash2 } from "lucide-react";
import { deleteCourse, setArchived, updateCourse } from "@/app/admin/actions";

export function CourseSettings({
  course,
}: {
  course: { id: string; name: string; description: string | null; archived: boolean };
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function save(formData: FormData) {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateCourse(formData);
      if (result.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  function copyLoginInfo() {
    const url = `${window.location.origin}/login`;
    navigator.clipboard
      .writeText(`Anmeldung: ${url}\nKursname: ${course.name}\nKennwort: (siehe Aushang)`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }

  return (
    <div className="space-y-8">
      <form action={save} className="rounded-2xl border border-line p-6">
        <h3 className="mb-5 font-semibold">Kursdaten</h3>
        <input type="hidden" name="id" value={course.id} />

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-dim">Kursname</span>
            <input
              name="name"
              defaultValue={course.name}
              required
              className="w-full rounded-xl border border-line bg-abyss px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-dim">Beschreibung</span>
            <input
              name="description"
              defaultValue={course.description ?? ""}
              className="w-full rounded-xl border border-line bg-abyss px-4 py-3 outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-dim">
              Neues Kurskennwort
            </span>
            <input
              name="password"
              type="text"
              placeholder="leer lassen, um das bisherige zu behalten"
              className="w-full rounded-xl border border-line bg-abyss px-4 py-3 font-mono outline-none transition placeholder:font-sans placeholder:text-ink-faint focus:border-cyan focus:ring-2 focus:ring-cyan/20"
            />
            <span className="mt-1.5 block text-xs text-ink-faint">
              Achtung: Nach einer Änderung müssen sich alle neu anmelden. Der Fortschritt bleibt
              erhalten.
            </span>
          </label>

          {error && (
            <p className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-2 rounded-xl bg-cyan px-5 py-2.5 text-sm font-semibold text-void transition hover:bg-white disabled:opacity-60"
            >
              {pending && <Loader2 className="size-3.5 animate-spin" />}
              Speichern
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-lime">
                <Check className="size-4" />
                Gespeichert
              </span>
            )}
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-line p-6">
        <h3 className="mb-2 font-semibold">Zugang teilen</h3>
        <p className="mb-4 text-sm text-ink-dim">
          Studierende melden sich unter <code className="text-cyan">/login</code> mit dem Kursnamen
          und dem Kennwort an. Einen eigenen Account brauchen sie nicht – nur einen Anzeigenamen.
        </p>
        <button
          onClick={copyLoginInfo}
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-cyan hover:text-cyan"
        >
          {copied ? <Check className="size-3.5 text-lime" /> : <Copy className="size-3.5" />}
          {copied ? "Kopiert" : "Anmelde-Infos kopieren"}
        </button>
      </div>

      <div className="rounded-2xl border border-line p-6">
        <h3 className="mb-2 font-semibold">Kurs pausieren</h3>
        <p className="mb-4 text-sm text-ink-dim">
          Ein archivierter Kurs lässt keine Anmeldungen mehr zu. Daten und Fortschritt bleiben
          vollständig erhalten.
        </p>
        <button
          onClick={() =>
            startTransition(async () => {
              await setArchived(course.id, !course.archived);
              router.refresh();
            })
          }
          className="flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-amber hover:text-amber"
        >
          {course.archived ? (
            <>
              <ArchiveRestore className="size-3.5" />
              Wieder freigeben
            </>
          ) : (
            <>
              <Archive className="size-3.5" />
              Archivieren
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-rose/30 bg-rose/5 p-6">
        <h3 className="mb-2 font-semibold text-rose">Kurs löschen</h3>
        <p className="mb-4 text-sm text-ink-dim">
          Löscht den Kurs mitsamt allen Teilnehmenden, ihrem Fortschritt und ihren Abzeichen. Das
          lässt sich nicht rückgängig machen. Tippe zur Bestätigung den Kursnamen ein.
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            value={confirmDelete}
            onChange={(event) => setConfirmDelete(event.target.value)}
            placeholder={course.name}
            className="flex-1 rounded-xl border border-line bg-abyss px-4 py-2.5 text-sm outline-none transition placeholder:text-ink-faint focus:border-rose"
          />
          <button
            disabled={confirmDelete !== course.name || pending}
            onClick={() =>
              startTransition(async () => {
                await deleteCourse(course.id);
                router.push("/admin");
              })
            }
            className="flex items-center gap-2 rounded-xl bg-rose px-5 py-2.5 text-sm font-semibold text-void transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Trash2 className="size-3.5" />
            Endgültig löschen
          </button>
        </div>
      </div>
    </div>
  );
}
