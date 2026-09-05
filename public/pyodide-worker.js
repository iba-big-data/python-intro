/* eslint-disable no-undef */
/**
 * Python Intro – Python-Ausführung im Web Worker.
 *
 * Der Worker lädt Pyodide (CPython im Browser via WebAssembly), zieht die
 * Python Intro-Laufzeit nach und beantwortet Ausführungsanfragen der Oberfläche.
 * Dadurch bleibt die UI flüssig, auch wenn Studierenden-Code rechnet.
 *
 * Läuft als Module-Worker – ab Pyodide 314 ist das Pflicht.
 */
import { loadPyodide } from "/pyodide/pyodide.mjs";

const PYODIDE_VERSION = "314.0.3";

/** Kern der Laufzeit – liegt auf dem eigenen Server (siehe scripts/copy-pyodide.mjs). */
const PYODIDE_URL = "/pyodide/";

/**
 * Wheels für NumPy, Pandas, scikit-learn & Co. Sie sind zusammen mehrere
 * hundert Megabyte groß und werden deshalb nur bei Bedarf geladen.
 * Wer die Plattform komplett ohne Internetzugriff betreiben will, spiegelt
 * dieses Verzeichnis lokal und trägt hier den eigenen Pfad ein.
 */
const PACKAGE_BASE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let runtime = null;
let bootPromise = null;

/** Pakete, die spürbar Ladezeit kosten – dafür zeigen wir einen Hinweis an. */
const HEAVY_PACKAGES = {
  numpy: "NumPy",
  pandas: "Pandas",
  "scikit-learn": "scikit-learn",
  sklearn: "scikit-learn",
  matplotlib: "Matplotlib",
  scipy: "SciPy",
};

/**
 * Übungsdatensätze. Sie liegen unter public/data und werden beim ersten
 * Zugriff ins Dateisystem von Pyodide kopiert. Studierende schreiben dann
 * einfach `pd.read_csv('cereals.csv')` – ohne URLs, ohne Netzwerkzugriff.
 */
const DATASETS = ["cereals.csv", "student_grades.csv", "car_prices.csv"];
const loadedDatasets = new Set();

function post(message) {
  self.postMessage(message);
}

/**
 * `progress` ist bewusst ein Stufenwert, kein Byte-Zähler: Pyodide meldet
 * beim Laden keinen echten Fortschritt. Die Stufen sind ehrlich beschriftet,
 * damit ein langer erster Start nicht wie ein Hänger wirkt.
 */
function status(phase, detail, progress) {
  post({ type: "status", phase, detail, progress });
}

async function boot() {
  status("loading", "Python wird heruntergeladen … (beim ersten Mal ca. 15 MB)", 0.05);

  pyodide = await loadPyodide({
    indexURL: PYODIDE_URL,
    lockFileURL: PYODIDE_URL + "pyodide-lock.json",
    packageBaseUrl: PACKAGE_BASE_URL,
    stdout: () => {},
    stderr: () => {},
  });

  status("loading", "Lernumgebung wird vorbereitet …", 0.7);
  const version = new URL(self.location.href).searchParams.get("v") ?? "1";
  const source = await fetch(`/python_intro_runtime.py?v=${version}`).then((r) => {
    if (!r.ok) throw new Error("python_intro_runtime.py konnte nicht geladen werden");
    return r.text();
  });

  // Home-Verzeichnis von Pyodide, damit der Import ohne Pfadakrobatik klappt.
  pyodide.FS.writeFile("/home/pyodide/python_intro_runtime.py", source, { encoding: "utf8" });
  pyodide.runPython("import sys; sys.path.insert(0, '/home/pyodide')");
  runtime = pyodide.pyimport("python_intro_runtime");

  status("ready", null, 1);
  post({ type: "ready", python: pyodide.runPython("import sys; sys.version.split()[0]") });
}

function ensureBooted() {
  if (!bootPromise) {
    bootPromise = boot().catch((error) => {
      bootPromise = null;
      post({ type: "fatal", message: String(error?.message ?? error) });
      throw error;
    });
  }
  return bootPromise;
}

/** Lädt Bibliotheken nach, die der Code importiert (numpy, pandas, …). */
async function loadImports(code) {
  const found = new Set();
  const importRe = /^\s*(?:import|from)\s+([a-zA-Z_][\w.]*)/gm;
  let match;
  while ((match = importRe.exec(code)) !== null) {
    const root = match[1].split(".")[0];
    if (HEAVY_PACKAGES[root]) found.add(HEAVY_PACKAGES[root]);
  }

  if (found.size > 0) {
    const names = [...found].join(", ");
    status("packages", `${names} wird geladen – mehrere Megabyte, beim ersten Mal dauert das …`, 0.4);
  }

  try {
    await pyodide.loadPackagesFromImports(code);
  } catch (error) {
    // Fehlende Pakete meldet Python später selbst als ImportError.
    console.warn("loadPackagesFromImports:", error);
  }

  if (found.size > 0) status("ready", null);
}

/** Kopiert die im Code erwähnten Übungsdatensätze ins Pyodide-Dateisystem. */
async function loadDatasets(code) {
  const needed = DATASETS.filter((name) => code.includes(name) && !loadedDatasets.has(name));
  if (needed.length === 0) return;

  status("packages", "Datensatz wird geladen …");
  await Promise.all(
    needed.map(async (name) => {
      const response = await fetch(`/data/${name}`);
      if (!response.ok) return;
      pyodide.FS.writeFile(`/home/pyodide/${name}`, await response.text(), { encoding: "utf8" });
      loadedDatasets.add(name);
    }),
  );
  status("ready", null);
}

self.onmessage = async (event) => {
  const message = event.data;

  try {
    if (message.type === "init") {
      await ensureBooted();
      return;
    }

    if (message.type === "resetShell") {
      await ensureBooted();
      runtime.reset_shell();
      post({ type: "shellReset" });
      return;
    }

    if (message.type === "run") {
      await ensureBooted();
      await loadImports(message.code);
      await loadDatasets(message.code);

      status("running", null);

      const payload = pyodide.toPy({
        code: message.code,
        surface: message.surface ?? "editor",
        step: message.step ?? {},
      });

      let result;
      try {
        const proxy = runtime.run(payload);
        result = proxy.toJs({ dict_converter: Object.fromEntries });
        proxy.destroy();
      } finally {
        payload.destroy();
      }

      status("ready", null);
      post({ type: "result", id: message.id, result });
    }
  } catch (error) {
    post({
      type: "result",
      id: message.id,
      result: {
        output: "",
        passed: false,
        message: "Die Python-Umgebung hatte ein Problem. Lade die Seite neu.",
        error: { type: "WorkerError", text: String(error?.message ?? error), hint: null },
      },
    });
  }
};
