/**
 * Merkzettel: „Der Lernpfad zeigt einen veralteten Fortschritt.“
 *
 * `/lernen` ist serverseitig `force-dynamic`, der Browser stellt die Seite
 * beim Zurücknavigieren aber aus dem Router-Cache wieder her. Beide
 * Rückmeldungen aus dem Testlauf beschreiben dasselbe: „Wenn man aus einer
 * Lektion zurück zur Übersicht geht, aktualisiert sich der Fortschritt nicht
 * automatisch“ – erst ein Neuladen half.
 *
 * Statt die Übersicht bei jedem Aufruf neu zu holen, setzt die Lektion hier
 * eine Markierung, sobald sich wirklich etwas geändert hat. Die Übersicht
 * holt dann genau einmal nach.
 *
 * `sessionStorage` kann in abgeschotteten Fenstern werfen – deshalb überall
 * mit try/catch, ein fehlender Merkzettel ist kein Fehlerfall.
 */
const KEY = "python-intro:fortschritt-veraltet";

export function markProgressStale(): void {
  try {
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    // Kein Session-Storage: dann bleibt es beim bisherigen Verhalten.
  }
}

/** Liest die Markierung und löscht sie in einem Zug. */
export function consumeProgressStale(): boolean {
  try {
    if (window.sessionStorage.getItem(KEY) === null) return false;
    window.sessionStorage.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}
