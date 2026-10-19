import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import * as schema from "./schema";
import { normaliseDatabaseUrl } from "./url";

/**
 * Zwei Betriebsarten:
 *
 *  1. DATABASE_URL zeigt auf eine echte Postgres-Datenbank (Neon, Supabase, eigener Server)
 *     – so läuft die Plattform im Betrieb.
 *  2. DATABASE_URL fehlt oder beginnt mit "pglite:" – dann läuft Postgres als WebAssembly
 *     direkt im Node-Prozess und legt die Daten in einem lokalen Ordner ab.
 *     Damit startet die Entwicklungsumgebung ohne jede Installation.
 *
 * Die Verbindung wird erst beim ersten Zugriff aufgebaut. Sonst würde schon
 * `next build` scheitern, obwohl dort noch gar keine Datenbank gebraucht wird.
 */
type Database = ReturnType<typeof drizzlePostgres<typeof schema>>;

const globalForDb = globalThis as unknown as { pqDb?: Database };

function create(): Database {
  const url = process.env.DATABASE_URL?.trim();
  const usePglite = !url || url.startsWith("pglite:");

  if (usePglite) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "DATABASE_URL fehlt. Im Produktivbetrieb wird eine echte Postgres-Datenbank benötigt " +
          "(siehe README, Abschnitt „Betrieb: Konten, Hosting, Datenbank“).",
      );
    }

    const dataDir = url?.replace(/^pglite:/, "") || ".pglite";
    // Der Cast vereinheitlicht die beiden Treiber-Typen; die genutzte API ist identisch.
    return drizzlePglite({ connection: { dataDir }, schema }) as unknown as Database;
  }

  const client = postgres(normaliseDatabaseUrl(url), {
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    prepare: false,
  });
  return drizzlePostgres(client, { schema });
}

function resolve(): Database {
  if (!globalForDb.pqDb) globalForDb.pqDb = create();
  return globalForDb.pqDb;
}

/** Verhält sich wie eine Drizzle-Instanz, verbindet sich aber erst beim ersten Zugriff. */
export const db = new Proxy({} as Database, {
  get(_target, property, receiver) {
    return Reflect.get(resolve(), property, receiver);
  },
});

export function usesEmbeddedDatabase(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  return !url || url.startsWith("pglite:");
}

export { schema };
