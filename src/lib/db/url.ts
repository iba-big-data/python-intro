/**
 * Bereinigt eine Postgres-Verbindungs-URL, bevor sie an postgres-js geht.
 *
 * Neon (und andere Anbieter) hängen Parameter an, die nur libpq kennt –
 * allen voran `channel_binding`. postgres-js reicht unbekannte Parameter an
 * den Server weiter, der sie dann als unbekannte Konfiguration ablehnt.
 * Deshalb filtern wir sie hier heraus, statt die Studierenden bzw. Lehrenden
 * an der URL herumschnippeln zu lassen.
 */
const CLIENT_ONLY_PARAMS = new Set([
  "channel_binding",
  "connect_timeout",
  "target_session_attrs",
]);

export function normaliseDatabaseUrl(raw: string): string {
  try {
    const url = new URL(raw);
    for (const key of [...url.searchParams.keys()]) {
      if (CLIENT_ONLY_PARAMS.has(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    // Keine gültige URL? Dann unverändert weiterreichen – die Fehlermeldung
    // des Treibers ist aussagekräftiger als alles, was wir hier raten könnten.
    return raw;
  }
}
