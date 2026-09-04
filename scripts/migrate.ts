/**
 * Wendet die SQL-Migrationen aus ./drizzle an – egal ob auf eine echte
 * Postgres-Datenbank oder auf die eingebettete PGlite-Datenbank.
 *
 *   npm run db:migrate
 */
import { readFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  const usePglite = !url || url.startsWith("pglite:");

  if (usePglite) {
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { migrate } = await import("drizzle-orm/pglite/migrator");

    const dataDir = url?.replace(/^pglite:/, "") || ".pglite";
    const client = new PGlite(dataDir);
    const db = drizzle(client);

    await migrate(db, { migrationsFolder: "./drizzle" });
    await client.close();
    console.log(`✓ Migrationen angewendet (eingebettete Datenbank in ${dataDir})`);
    return;
  }

  const postgres = (await import("postgres")).default;
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const { migrate } = await import("drizzle-orm/postgres-js/migrator");
  const { normaliseDatabaseUrl } = await import("../src/lib/db/url");

  // `prepare: false` ist nötig, damit die Migration auch über einen
  // Verbindungs-Pooler (bei Neon die "-pooler"-Adresse) durchläuft.
  const client = postgres(normaliseDatabaseUrl(url!), { max: 1, prepare: false });
  await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
  await client.end();
  console.log("✓ Migrationen angewendet (Postgres)");
}

// Kleiner Freundlichkeitsdienst: fehlt die Migrationsdatei, sagen wir warum.
try {
  readFileSync("./drizzle/meta/_journal.json");
} catch {
  console.error(
    "Keine Migrationen gefunden. Führe zuerst 'npm run db:generate' aus.",
  );
  process.exit(1);
}

main().catch((error) => {
  console.error("Migration fehlgeschlagen:", error);
  process.exit(1);
});
