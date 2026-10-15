/**
 * Zwischenbild fürs Profil.
 *
 * Die Seite ist `force-dynamic` und fragt Fortschritt, Abzeichen und Level in
 * der Datenbank ab. Ohne diese Datei blieb der Browser auf dem Lernpfad
 * stehen, bis der Server fertig war – im Testlauf gemeldet als „Klick auf das
 * Icon, um zum Profil zu gelangen, dauert relativ lange“. Die Wartezeit ist
 * dieselbe, aber sie ist jetzt sichtbar und die Navigation reagiert sofort.
 */
function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface/60 ${className}`} />;
}

export default function ProfileLoading() {
  return (
    <div className="min-h-screen">
      <div className="h-14 border-b border-line bg-surface/50" />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Block className="h-28" />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Block key={index} className="h-20" />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Block key={index} className="h-24" />
          ))}
        </div>
      </main>
    </div>
  );
}
