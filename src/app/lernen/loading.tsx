/**
 * Zwischenbild für den Lernpfad – aus demselben Grund wie beim Profil:
 * die Seite wird bei jedem Aufruf frisch aus der Datenbank gebaut.
 */
function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface/60 ${className}`} />;
}

export default function LearnLoading() {
  return (
    <div className="min-h-screen">
      <div className="h-14 border-b border-line bg-surface/50" />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Block className="h-10 w-72" />
        <Block className="mt-3 h-5 w-96 max-w-full" />

        <div className="mt-8 space-y-3">
          {Array.from({ length: 7 }, (_, index) => (
            <Block key={index} className="h-20" />
          ))}
        </div>
      </main>
    </div>
  );
}
