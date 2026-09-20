# Python Intro

Interaktive Python-Lernplattform für Lehrveranstaltungen.

Studierende schreiben von der ersten Minute an echten Python-Code direkt im Browser
und bekommen sofort Rückmeldung. Lehrende legen Kurse an, wählen aus, welche
Lektionen ihre Gruppe sieht, und verfolgen den Fortschritt in Echtzeit.

Die Lerninhalte basieren auf dem Open-Source-Projekt
[futurecoder](https://futurecoder.io) (MIT-Lizenz) und wurden ins Deutsche
übertragen und didaktisch überarbeitet.

**Umfang:** 13 Kapitel, 62 Lektionen, 251 Aufgaben – von der ersten Zeile Code
über NumPy, Pandas und scikit-learn bis zu einem spielbaren Tic-Tac-Toe als
Abschlussprojekt. Jede einzelne Aufgabe wird automatisch geprüft.

---

## Was drin steckt

**Für Studierende**

- Vollwertiges Python (CPython 3.14) im Browser – kein Setup, keine Installation
- NumPy, Pandas und scikit-learn werden bei Bedarf nachgeladen
- Editor mit Syntax-Hervorhebung und eine interaktive Shell mit Verlauf
- Jede Aufgabe wird automatisch geprüft, Fehlermeldungen kommen auf Deutsch
- Gestufte Tipps: so viel Hilfe wie nötig, nicht gleich die ganze Lösung
- XP, Level mit eigenen Rangtiteln, Abzeichen, Tages-Streak
- Lernpfad, der Lektion für Lektion freischaltet

**Für Lehrende**

- Kurse mit Name und Kurskennwort anlegen
- Lektionen pro Kurs einzeln oder kapitelweise auswählen – neue Kurse starten
  mit einer Standardauswahl aus 39 Must-have-Lektionen, „Alle“ holt den vollen
  Katalog zurück
- Live-Dashboard: wer ist wo, wer war heute aktiv
- „Hier hakt es“: Aufgaben, die im Schnitt die meisten Versuche kosten
- Kurse archivieren oder löschen

**Anmeldung ohne Benutzerkonten.** Studierende geben einmal das Kurskennwort und
einen selbstgewählten Anzeigenamen ein – mehr nicht. Es werden keine
E-Mail-Adressen und keine personenbezogenen Daten über den Anzeigenamen hinaus
erhoben.

Danach hängt der Fortschritt an einem signierten Cookie (180 Tage, verlängert
sich bei jeder gelösten Aufgabe). Wer den Browser wechselt oder seine Cookies
löscht, kommt über den **Wiederherstellungscode** aus dem Profil wieder an
seinen Stand. Ein Kennwort für die eigene Person gibt es bewusst nicht: Der
Kurs soll ohne Kontoverwaltung auskommen.

---

## Schnellstart (lokal)

Voraussetzung: Node.js 20 oder neuer. Eine Datenbank musst du **nicht**
installieren – lokal läuft Postgres als WebAssembly im Node-Prozess.

```bash
cd python-intro
npm install
cp .env.example .env.local   # ADMIN_PASSWORD und SESSION_SECRET eintragen
npm run db:migrate
npm run dev
```

> Die eingebettete Datenbank (PGlite) lässt immer nur einen Prozess an ihren
> Datenordner. Skripte wie `npm run db:migrate` deshalb bei gestopptem
> Dev-Server laufen lassen.

Dann im Browser:

- <http://localhost:3000/admin> – Lehrenden-Bereich (Kennwort aus `ADMIN_PASSWORD`)
- <http://localhost:3000/login> – Studierenden-Anmeldung

Erster Schritt: Im Admin-Bereich einen Kurs anlegen. Er startet mit der
**Standardauswahl** – dem Kern, den eine Einführung braucht. Im Reiter
**Lektionen** lässt sich das nachjustieren: **Standard**, **Alle** oder
**Leeren** als Ausgangspunkt, dann einzelne Lektionen oder ganze Kapitel
anhaken und speichern. Danach können sich Studierende allein mit dem
Kurskennwort anmelden – gib es deiner Gruppe weiter. Es muss sich vom Kennwort
aller anderen Kurse unterscheiden, denn es ist das Einzige, was die Anmeldung
abfragt.

Die Level-Kurve richtet sich nach dem Umfang des jeweiligen Kurses: Der höchste
Rang liegt immer bei rund 85 % der erreichbaren XP, egal wie schlank der Kurs
zugeschnitten ist.

### Umgebungsvariablen

| Variable         | Pflicht | Bedeutung                                                        |
| ---------------- | ------- | ---------------------------------------------------------------- |
| `SESSION_SECRET` | ja      | Schlüssel zum Signieren der Login-Cookies (`openssl rand -base64 32`) |
| `ADMIN_PASSWORD` | ja      | Kennwort für den Lehrenden-Bereich                                |
| `DATABASE_URL`   | im Betrieb | Postgres-Verbindung. Fehlt sie, wird lokal die eingebettete Datenbank benutzt. |

---

## Deployment über GitHub und Vercel

GitHub allein genügt nicht: **GitHub Pages kann diese Anwendung nicht ausliefern**,
weil sie einen Server für Anmeldung, Fortschritt und Datenbank braucht. GitHub ist
die Code-Ablage, Vercel baut und betreibt die Seite und zieht sich den Code bei
jedem Push automatisch.

1. **Code zu GitHub bringen.** Dieser Ordner ist bereits ein Git-Repository mit
   einem Initial-Commit auf `main`. Leg auf GitHub ein leeres Repository an
   (ohne README, ohne .gitignore, ohne Lizenz – die liegen hier schon) und
   verknüpfe es:

   ```bash
   git remote add origin https://github.com/<konto>/<repo>.git
   git push -u origin main
   ```

2. **Datenbank anlegen.** Eine Postgres-Datenbank bei [Neon](https://neon.tech)
   oder [Supabase](https://supabase.com) erstellen und die Verbindungs-URL kopieren.
   (Beide haben ein kostenloses Kontingent, das für Kursgrößen locker reicht.)

3. **Projekt zu Vercel bringen.** Auf [vercel.com](https://vercel.com) mit dem
   GitHub-Konto anmelden, *Add New → Project*, das Repository importieren.
   Framework „Next.js" wird automatisch erkannt; das *Root Directory* bleibt auf
   `./`, weil dieser Ordner die Wurzel des Repositories ist.

4. **Umgebungsvariablen setzen** – `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`
   (Letzteres erzeugen mit `openssl rand -base64 32`).

5. **Migrationen einspielen.** Einmalig lokal mit gesetzter `DATABASE_URL`:

   ```bash
   DATABASE_URL="postgresql://…" npm run db:migrate
   ```

6. **Deployen.** Der Build kopiert die Python-Laufzeit automatisch nach
   `public/pyodide` (siehe `scripts/copy-pyodide.mjs`). Jeder weitere Push auf
   `main` löst ein neues Deployment aus.

Danach ist der Lehrenden-Bereich unter `https://<projekt>.vercel.app/admin`
erreichbar, die Studierenden-Anmeldung unter `/login`.

### Änderungen ausrollen

Ein `git push` auf `main` genügt: Vercel baut automatisch neu und schaltet die
neue Fassung live, sobald der Build durchgelaufen ist. Bei Neon ist nie etwas
freizugeben – die Datenbank ist von Code-Änderungen nicht betroffen.

Drei Fälle brauchen trotzdem einen Handgriff:

| Was du geändert hast | Was zusätzlich nötig ist |
| --- | --- |
| Lerninhalte, Oberfläche, Logik | nichts – `npm run content:check`, committen, pushen |
| `src/lib/db/schema.ts` | `npm run db:generate`, dann **einmalig** `DATABASE_URL="…" npm run db:migrate`. Der Vercel-Build führt bewusst keine Migrationen aus. |
| `public/python_intro_runtime.py` oder `public/pyodide-worker.js` | `RUNTIME_VERSION` in `src/lib/usePython.ts` hochzählen, sonst liefern Browser die alte Fassung aus dem Cache |

Warum keine Migrationen im Build? Weil bei Vercel auch Vorschau-Deployments und
parallele Builds laufen – die würden dann gleichzeitig am selben Schema
herumschreiben. Migrationen bewusst von Hand auszulösen ist die sicherere
Variante, zumal sie selten anfallen.

> **Achtung bei laufenden Kursen:** Lektions- und Step-IDs sind der Schlüssel zum
> gespeicherten Fortschritt. Benennst du sie um, gelten die betroffenen Aufgaben
> für alle Studierenden wieder als ungelöst. Inhalte und Texte darfst du dagegen
> jederzeit gefahrlos ändern.

> Die eingebettete Datenbank (PGlite) ist ausschließlich für die lokale
> Entwicklung gedacht. In der Serverless-Umgebung von Vercel überlebt sie keinen
> Neustart – ohne `DATABASE_URL` bricht der Start deshalb bewusst mit einer
> Fehlermeldung ab.

### Alternative: eigener Server

Die App ist ein gewöhnliches Next.js-Projekt. `npm run build && npm start` hinter
einem Reverse Proxy genügt, dazu eine erreichbare Postgres-Instanz.

---

## Wie der Python-Teil funktioniert

Python läuft **vollständig im Browser** der Studierenden – es wird kein
Nutzercode auf dem Server ausgeführt. Damit gibt es keine Sandbox-Probleme und
keine Last durch Endlosschleifen.

```
Browser-Tab                      Web Worker (Module)
┌───────────────────┐            ┌───────────────────────────┐
│ LessonView        │  postMsg   │ pyodide-worker.js         │
│  Editor / Shell   │ ─────────► │  ├ Pyodide (CPython WASM) │
│  Ausgabe & Prüfung│ ◄───────── │  └ python_intro_runtime.py│
└───────────────────┘  Ergebnis  └───────────────────────────┘
```

- `public/pyodide-worker.js` – lädt Pyodide, nimmt Ausführungsaufträge entgegen
- `public/python_intro_runtime.py` – führt den Code aus, prüft die Aufgabe, übersetzt
  Fehlermeldungen ins Deutsche
- `src/lib/usePython.ts` – React-Hook, der den Worker steuert

Die Pyodide-Kerndateien liegen im eigenen `public/`-Verzeichnis und nicht auf einem
CDN. Das funktioniert auch hinter restriktiven Uni-Proxys und schickt keine Daten
an Dritte. Nur die großen Bibliotheks-Wheels (NumPy, Pandas, scikit-learn) werden
bei Bedarf vom Pyodide-CDN geholt; der Pfad dafür steht als `PACKAGE_BASE_URL` im
Worker und lässt sich auf einen eigenen Spiegel umstellen.

**Endlosschleifen** fängt ein Watchdog in `python_intro_runtime.py` nach 8 Sekunden ab.
Antwortet der Worker gar nicht mehr, startet ihn der Hook nach 30 Sekunden neu.

**Übungsdatensätze** liegen unter `public/data/` und werden beim ersten Zugriff
ins Dateisystem von Pyodide kopiert. Studierende schreiben deshalb schlicht
`pd.read_csv('cereals.csv')` – ohne URL und ohne Netzwerkzugriff. Neue Datensätze
dort ablegen und in der Liste `DATASETS` im Worker eintragen.

**Zwei Sonderfälle der Laufzeit**, die es in normalem Python so nicht gibt:

- `assert_equal(ist, soll)` steht in jedem Programm zur Verfügung. Damit führt
  Kapitel 8 das Thema Testen ein, ohne ein Test-Framework zu benötigen.
- `input()` liest aus vorher festgelegten Antworten (`stdin` am Step bzw. am
  Testfall) und protokolliert sie als `<Eingabe: …>`. Eine echte Tastatureingabe
  mitten im Programmlauf bräuchte `SharedArrayBuffer` und damit COOP/COEP-Header
  – die wiederum das Nachladen der Bibliotheks-Wheels vom CDN verhindern würden.

---

## Lerninhalte bearbeiten

Alle Inhalte liegen als getippte TypeScript-Dateien unter
`src/content/chapters/`. Eine neue Datei anlegen, in `src/content/index.ts`
importieren und in die `chapters`-Liste eintragen – fertig.

Es gibt vier Arten von Aufgaben-Steps:

| `kind`       | Wofür                                                      | Wird geprüft durch                         |
| ------------ | ---------------------------------------------------------- | ------------------------------------------ |
| `read`       | reiner Erklärtext mit „Verstanden“-Knopf                   | – |
| `run`        | vorgegebenes Programm eintippen und ausführen              | Vergleich der Syntaxbäume (Formatierung und Anführungszeichen egal) |
| `experiment` | freies Ausprobieren mit einer Bedingung                    | geforderte Sprachkonstrukte, Ausgabe oder angelegte Variable |
| `exercise`   | echte Programmieraufgabe                                   | Testfälle gegen die Lösung der Studierenden |

Nach jeder Änderung an den Inhalten:

```bash
npm run content:check
```

Für die Data-Analytics-Kapitel braucht die Prüfung NumPy, Pandas und
scikit-learn. Einmalig einrichten – danach wird die Umgebung automatisch
benutzt:

```bash
python3 -m venv .venv && .venv/bin/pip install numpy pandas scikit-learn
```

> **Unter Windows:** `npm run content:check` ist als POSIX-Shell-Zeile
> geschrieben (`test -x .venv/bin/python`) und läuft weder in `cmd` noch in
> PowerShell. Nutze Git Bash oder WSL – oder führe die beiden Schritte einzeln
> aus: `npm run content:export`, danach `.venv\Scripts\python tools\verify_content.py`.
> Die virtuelle Umgebung legst du dort mit
> `py -m venv .venv && .venv\Scripts\pip install numpy pandas scikit-learn` an.

Das Skript führt **jede Musterlösung gegen ihre eigenen Testfälle** aus, prüft, ob
alle vorgegebenen Programme laufen (bzw. bei `expectsError: true` bewusst
scheitern), ob die als richtig markierte Antwort jeder Vorhersage-Frage der
tatsächlichen Ausgabe entspricht und ob alle IDs eindeutig sind.

> **Wichtig:** Lektions- und Step-IDs sind der Schlüssel zum gespeicherten
> Fortschritt. Ändere sie nicht mehr, sobald ein Kurs damit gearbeitet hat.

Wird an `public/python_intro_runtime.py` oder `public/pyodide-worker.js` etwas
geändert, muss `RUNTIME_VERSION` in `src/lib/usePython.ts` hochgezählt werden –
sonst liefern Browser die alte Fassung aus dem Cache aus.

---

## Projektstruktur

```
python-intro/
├── public/
│   ├── pyodide-worker.js         Web Worker, lädt Pyodide
│   ├── python_intro_runtime.py   Ausführung + Aufgabenprüfung (Python)
│   ├── data/                     CSV-Datensätze der Data-Analytics-Kapitel
│   └── pyodide/                  beim Build aus node_modules kopiert
├── scripts/
│   ├── copy-pyodide.mjs          stellt die Python-Laufzeit bereit
│   ├── migrate.ts                Datenbank-Migrationen
│   └── export-content.ts         Inhalte als JSON für die Prüfung
├── tools/
│   ├── extract_content.py        liest die alten futurecoder-Kapitel aus
│   └── verify_content.py         Qualitätssicherung der Lerninhalte
└── src/
    ├── app/                      Seiten und API-Routen (Next.js App Router)
    ├── components/               Editor, Shell, Lernpfad, Admin-Oberfläche
    ├── content/                  die Lerninhalte selbst
    └── lib/                      Datenbank, Auth, Gamification, Dashboard
```

---

## Befehle

| Befehl                   | Zweck                                              |
| ------------------------ | -------------------------------------------------- |
| `npm run dev`            | Entwicklungsserver auf Port 3000                   |
| `npm run build`          | Produktions-Build                                  |
| `npm run db:generate`    | SQL-Migration aus dem Schema erzeugen              |
| `npm run db:migrate`     | Migrationen anwenden                               |
| `npm run db:studio`      | Datenbank im Browser ansehen                       |
| `npm run content:check`  | Lerninhalte prüfen                                 |

---

## Lizenz

Der Code steht unter der MIT-Lizenz – vollständiger Text in [`LICENSE`](LICENSE).
Die Lerninhalte sind abgeleitet von futurecoder (© Alex Hall, MIT-Lizenz); der
zugehörige Lizenzvermerk steht ebenfalls in `LICENSE` im Abschnitt „Hinweise zu
Inhalten Dritter".
