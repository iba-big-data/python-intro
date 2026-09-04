/**
 * Kopiert die Pyodide-Laufzeit aus node_modules nach public/pyodide.
 *
 * Warum nicht einfach vom CDN laden? Ein Worker darf sein Startskript nur
 * laden, wenn die Content-Security-Policy das erlaubt – in vielen Netzen und
 * hinter Uni-Proxys ist das nicht der Fall. Vom eigenen Server geladen
 * funktioniert es überall, und es fließen keine Daten an Dritte ab.
 *
 * Die großen Bibliotheken (NumPy, Pandas, scikit-learn) kommen weiterhin bei
 * Bedarf per fetch nach – siehe PACKAGE_BASE_URL in public/pyodide-worker.js.
 *
 * Läuft automatisch vor `npm run dev` und `npm run build`.
 */
import { cp, mkdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules", "pyodide");
const target = join(root, "public", "pyodide");

// Nur was zur Laufzeit gebraucht wird – Sourcemaps und Typen bleiben draußen.
const FILES = [
  "pyodide.mjs",
  "pyodide.asm.js",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(source))) {
    console.error("Paket 'pyodide' nicht gefunden. Bitte 'npm install' ausführen.");
    process.exit(1);
  }

  await mkdir(target, { recursive: true });

  let copied = 0;
  for (const file of FILES) {
    const from = join(source, file);
    if (!(await exists(from))) continue;
    await cp(from, join(target, file));
    copied++;
  }

  console.log(`✓ Pyodide-Laufzeit bereitgestellt (${copied} Dateien in public/pyodide)`);
}

main().catch((error) => {
  console.error("Pyodide konnte nicht kopiert werden:", error);
  process.exit(1);
});
