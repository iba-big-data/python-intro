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
cd python-intro-course
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

## Betrieb: Konten, Hosting, Datenbank

Die Anwendung braucht einen Server – **GitHub Pages kann sie nicht ausliefern**,
weil Anmeldung, Fortschritt und Datenbank serverseitig laufen. Die
Aufgabenteilung:

| Dienst  | Rolle                                 | Kosten                                |
| ------- | ------------------------------------- | ------------------------------------- |
| GitHub  | Code-Ablage, Quelle für den Build     | kostenlos, auch für private Repos     |
| Netlify | baut die Seite und betreibt sie       | kostenloses Kontingent reicht für Kursgrößen |
| Neon    | Postgres-Datenbank im Betrieb         | kostenloses Kontingent reicht für Kursgrößen |

**Grundregel für die Konten:** Alle drei laufen auf einer **Funktionsadresse des
Instituts** (z. B. `python-intro@uni-ulm.de`), nicht auf eine Person, und
mindestens zwei Personen haben Vollzugriff. Sonst verschwindet mit einem
Personalwechsel der Zugang zur Datenbank – genau das ist diesem Projekt schon
einmal beinahe passiert.

**Zugangsdaten liegen nicht im Repository** und dürfen auch nicht hinein. Ablage
ist der Passwortmanager des Instituts. Dort hinein gehören: die drei
Konto-Logins, `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET` sowie Kursname
und Kurskennwort jedes laufenden Kurses.

### Datenbank bei Neon einrichten

1. **Projekt anlegen**, Region **Frankfurt (`eu-central-1`)** – kurze Wege und
   der unproblematischere Standort für Teilnehmendendaten.
2. **Verbindungs-URL kopieren**, und zwar die mit **`-pooler`** im Hostnamen.
   Sie ist für den Serverless-Betrieb gedacht, in dem Netlify die Anwendung
   ausführt.
3. **Migrationen einmalig von Hand einspielen** (Git Bash):

   ```bash
   DATABASE_URL="postgresql://…" npm run db:migrate
   ```

   In PowerShell `$env:DATABASE_URL = "…"` in einer eigenen Shell setzen und
   diese danach schließen – sonst arbeitet der nächste `npm run dev`
   versehentlich gegen die Produktiv-Datenbank. Die Migrationen sind idempotent,
   ein zweiter Lauf schadet nicht.
4. **Kurs anlegen.** Eine frische Datenbank enthält keinen Kurs: die Tabellen
   `courses` und `course_lessons` werden nicht aus dem Repository befüllt,
   sondern im Lehrenden-Bereich unter `/admin`. Der dort gesetzte **Kursname und
   das Kurskennwort sind genau das, womit sich die Studierenden anmelden.**

Zwei Eigenheiten sind im Code bereits berücksichtigt: `src/lib/db/url.ts`
entfernt die nur von libpq verstandenen Parameter (`channel_binding`,
`connect_timeout`, `target_session_attrs`) aus der URL, und der Treiber läuft mit
`prepare: false`, weil der Neon-Pooler keine vorbereiteten Anweisungen
durchlässt. Ein anderer Postgres (Supabase, eigener Server) funktioniert genauso
– es ist nur `DATABASE_URL` auszutauschen.

**Sicherung.** Es gibt keine automatische. Ein Dump von Hand, am besten vor
jedem Semester und vor jeder Schema-Änderung:

```bash
pg_dump "postgresql://…" -Fc -f python-intro-2026-10-19.dump
```

Die Datei gehört neben die Zugangsdaten, nicht ins Repository.

### Hosting bei Netlify einrichten

1. **Konto mit der Funktionsadresse** anlegen und **per E-Mail anmelden, nicht
   „mit GitHub fortfahren"** – sonst hängt der Netlify-Zugang wieder an einem
   einzelnen GitHub-Konto.
2. Liegt das Repository in einer GitHub-**Organization**, muss ein Owner dieser
   Organization die Netlify-GitHub-App dort freigeben. Ohne diese Freigabe
   findet Netlify das Repository nicht.
3. *Add new site → Import an existing project*, Repository wählen, Branch
   `main`. Next.js wird erkannt und das offizielle Netlify-Plugin automatisch
   eingerichtet. Build-Befehl `npm run build`, Base directory leer.
4. Umgebungsvariable `NODE_VERSION` auf `24` setzen — das ist die Version, mit
   der der Build nachweislich durchläuft. Node 20 ist seit April 2026
   End-of-Life.
5. Die drei Variablen aus der Tabelle oben eintragen und als **Sensitive**
   markieren:
   - `DATABASE_URL` direkt aus dem Neon-Dashboard übernehmen,
   - `SESSION_SECRET` neu erzeugen: `openssl rand -base64 32`,
   - `ADMIN_PASSWORD` frei wählen.
6. **Deployen.** Der Build stellt die Python-Laufzeit selbst bereit
   (`scripts/copy-pyodide.mjs` als `prebuild`, Ziel `public/pyodide`); dieser
   Ordner gehört nicht ins Repository.

Danach ist der Lehrenden-Bereich unter `https://<projekt>.netlify.app/admin`
erreichbar, die Studierenden-Anmeldung unter `/login`.

> Fehlt `DATABASE_URL`, bricht der Start mit einer Fehlermeldung ab. Das ist
> Absicht: die eingebettete Datenbank (PGlite) ist nur für die lokale
> Entwicklung gedacht und würde in einer Serverless-Umgebung keinen Neustart
> überleben.

### Warum Netlify und nicht Vercel

Das Projekt lief zuvor bei Vercel. Aus dem Campus-WLAN der Universität Ulm waren
alle `*.vercel.app`-Adressen per TCP 443 unerreichbar – ein Routing-Loch hinter
BelWü, gemessen am 01.10.2026; über Mobilfunk war dieselbe Seite erreichbar.
Netlifys Adressbereich (AWS Frankfurt) ist aus demselben Netz erreichbar, ebenso
Neon auf TCP 5432.

**Wird der Hoster erneut gewechselt, zuerst die Erreichbarkeit der konkreten
neuen Adresse aus dem Campusnetz messen**, bevor sie an Studierende geht:

```powershell
Resolve-DnsName <projekt>.netlify.app
Test-NetConnection <jede aufgelöste IP> -Port 443
```

### Änderungen ausrollen

Ein `git push` auf `main` genügt: Netlify baut automatisch neu und schaltet die
neue Fassung live, sobald der Build durchgelaufen ist. An der Datenbank ist dabei
nie etwas freizugeben.

Drei Fälle brauchen einen zusätzlichen Handgriff:

| Was geändert wurde | Was zusätzlich nötig ist |
| --- | --- |
| Lerninhalte, Oberfläche, Logik | nichts – `npm run content:check`, committen, pushen |
| `src/lib/db/schema.ts` | `npm run db:generate`, dann **einmalig** `DATABASE_URL="…" npm run db:migrate` |
| `public/python_intro_runtime.py` oder `public/pyodide-worker.js` | `RUNTIME_VERSION` in `src/lib/usePython.ts` hochzählen, sonst liefern Browser die alte Fassung aus dem Cache |

Migrationen laufen **bewusst nicht im Build**: Vorschau-Deployments und
parallele Builds würden sonst gleichzeitig am selben Schema schreiben.

> **Achtung bei laufenden Kursen:** Lektions- und Step-IDs sind der Schlüssel zum
> gespeicherten Fortschritt. Werden sie umbenannt, gelten die betroffenen
> Aufgaben für alle Studierenden wieder als ungelöst. Inhalte und Texte sind
> jederzeit gefahrlos änderbar.

### Wenn das Projekt an andere Konten übergeben wird

Mit `git push` wandert alles Versionierte mit, einschließlich `.gitignore` und
`.env.example`. **Nicht** mit wandert und muss von Hand übergeben werden:

- die Werte der drei Umgebungsvariablen – über den Passwortmanager, nicht per
  Mail oder Chat,
- die Zugänge zu GitHub, Netlify und Neon,
- der Inhalt der Datenbank (`pg_dump`, siehe oben),
- die Projekteinstellungen bei Netlify; die sind nach der Anleitung oben in
  wenigen Minuten neu gesetzt.

Beim Wechsel **`SESSION_SECRET` und `ADMIN_PASSWORD` neu setzen** – damit
verlieren auch ausgeschiedene Personen den Zugriff auf Teilnehmendendaten. Folge
des neuen `SESSION_SECRET`: alle laufenden Studi-Sitzungen werden ungültig.
Betroffene kommen **allein über den Wiederherstellungscode** aus ihrem Profil
wieder an ihren Fortschritt. Eine neue Anmeldung mit Kurskennwort und
Anzeigename legt *immer* einen neuen, leeren Datensatz an – der Anzeigename
identifiziert bewusst niemanden, sonst käme man mit fremden Namen in fremden
Fortschritt. Bei laufendem Kurs vorher ankündigen und die Studierenden
auffordern, ihren Wiederherstellungscode zu sichern; den Wechsel möglichst in
die vorlesungsfreie Zeit legen.

Das Fortschritts-Cookie hängt zudem am Hostnamen: Wer unter einer alten Adresse
angefangen hat, startet unter einer neuen bei Null. Brücke ist allein der
Wiederherstellungscode.

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

### Kapitelübersicht

Die Übertragung der futurecoder-Kapitel ins Deutsche ist abgeschlossen.

| Nr. | Datei                             | Quellkapitel           | Lektionen |
| --- | --------------------------------- | ---------------------- | --------- |
| 1   | `01-shell.ts`                     | the shell              | 2  |
| 2   | `02-strings.ts`                   | strings                | 2  |
| 3   | `03-variablen.ts`                 | variables              | 4  |
| 4   | `04-schleifen.ts`                 | for loops              | 6  |
| 5   | `05-bedingungen.ts`               | if statements          | 7  |
| 6   | `06-listen.ts`                    | lists                  | 13 |
| 7   | `07-strings-fortgeschritten.ts`   | advanced strings       | 2  |
| 8   | `08-funktionen.ts`                | functions              | 5  |
| 9   | `09-boolesche-operatoren.ts`      | boolean operators      | 5  |
| 10  | `10-numpy.ts`                     | numpy                  | 4  |
| 11  | `11-pandas.ts`                    | pandas                 | 3  |
| 12  | `12-sklearn.ts`                   | scikit-learn           | 2  |
| 13  | `13-tictactoe.ts`                 | tic tac toe (optional) | 7  |

Gesamt: 13 Kapitel, 62 Lektionen, 251 Steps, davon 67 geprüfte Übungen.

### Bewusste Abweichungen vom Original

Wer Inhalte weiterpflegt, sollte diese Entscheidungen kennen – sie sind
didaktisch gewollt und keine offenen Baustellen:

- **Deutsche Bezeichner.** Variablennamen in den Grundlagenkapiteln sind
  eingedeutscht (`wort`, `zeile`, `zeichen`, `satz`). Das macht sichtbar, dass
  Namen frei gewählt werden. Python-Schlüsselwörter bleiben englisch. In den
  Data-Analytics-Kapiteln bleiben die Fachbegriffe (`df`, `array`, `model`)
  erhalten, weil sie so in jeder Dokumentation stehen.
- **Kein `snoop`, kein `birdseye`, kein Python Tutor.** futurecoder bindet drei
  externe Debugging-Werkzeuge ein. Die betreffenden Lektionen wurden zu
  Lektionen über das gedankliche Nachvollziehen von Programmen umgeschrieben
  (Zwischenstände per `print`, Variablentabelle auf Papier).
- **Vorhersage-Fragen mit Fehlerauswahl.** Wo ein Beispielprogramm absichtlich
  scheitert, gibt es die Antwortmöglichkeit „eine Fehlermeldung". Solche Steps
  sind mit `expectsError: true` markiert und gelten trotz Fehler als gelöst.
- **Kapitel 10–12 sind interaktiv.** Im Original bestanden sie fast
  ausschließlich aus Code zum Kopieren. Die „Show Your Skills"-Seiten sind hier
  echte, automatisch geprüfte Übungen (Lückentext mit `?`), damit auch dieser
  Teil des Kurses Rückmeldung gibt.
- **`cereals.csv` hat 80 statt 77 Datensätze.** Drei sind Duplikate. Das ist
  kein Fehler, sondern der Grund, warum die Lektion über Duplikate genau dort
  steht.

---

## Projektstruktur

```
python-intro-course/
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
