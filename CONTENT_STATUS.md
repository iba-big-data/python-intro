# Stand der Inhalte

Übertragung der futurecoder-Kapitel (`../core/chapters/*.py`) nach
`src/content/chapters/*.ts`, auf Deutsch. **Abgeschlossen.**

Arbeitsablauf je Kapitel:

1. `python3 tools/extract_content.py` (einmalig) legt die Vorlagen unter
   `tools/extracted/` ab.
2. Kapitel als TypeScript-Datei schreiben, in `src/content/index.ts` eintragen.
3. `npm run content:check` – muss ohne Probleme durchlaufen.

| Nr. | Quelle                       | Ziel                              | Lektionen | Status |
| --- | ---------------------------- | --------------------------------- | --------- | ------ |
| 1   | the shell                    | `01-shell.ts`                     | 2         | ✅ fertig |
| 2   | strings                      | `02-strings.ts`                   | 2         | ✅ fertig |
| 3   | variables                    | `03-variablen.ts`                 | 4         | ✅ fertig |
| 4   | for loops                    | `04-schleifen.ts`                 | 6         | ✅ fertig |
| 5   | if statements                | `05-bedingungen.ts`               | 7         | ✅ fertig |
| 6   | lists                        | `06-listen.ts`                    | 13        | ✅ fertig |
| 7   | advanced strings             | `07-strings-fortgeschritten.ts`   | 2         | ✅ fertig |
| 8   | functions                    | `08-funktionen.ts`                | 5         | ✅ fertig |
| 9   | boolean operators            | `09-boolesche-operatoren.ts`      | 5         | ✅ fertig |
| 10  | numpy                        | `10-numpy.ts`                     | 4         | ✅ fertig |
| 11  | pandas                       | `11-pandas.ts`                    | 3         | ✅ fertig |
| 12  | scikit-learn                 | `12-sklearn.ts`                   | 2         | ✅ fertig |
| 13  | tic tac toe (optional)       | `13-tictactoe.ts`                 | 7         | ✅ fertig |

**Gesamt: 13 Kapitel, 62 Lektionen, 251 Steps, davon 67 geprüfte Übungen.**

## Bewusste Abweichungen vom Original

- **Deutsche Bezeichner.** Variablennamen in den Grundlagenkapiteln sind
  eingedeutscht (`wort`, `zeile`, `zeichen`, `satz`). Das macht sichtbar, dass
  Namen frei gewählt werden. Python-Schlüsselwörter bleiben selbstverständlich
  englisch. In den Data-Analytics-Kapiteln bleiben die üblichen Fachbegriffe
  (`df`, `array`, `model`) erhalten, weil sie so in jeder Dokumentation stehen.
- **Kein `snoop`, kein `birdseye`, kein Python Tutor.** futurecoder bindet drei
  externe Debugging-Werkzeuge ein. Die entsprechenden Lektionen wurden zu
  Lektionen über das gedankliche Nachvollziehen von Programmen umgeschrieben
  (Zwischenstände per `print`, Variablentabelle auf Papier).
- **Vorhersage-Fragen mit Fehlerauswahl.** Wo das Beispielprogramm absichtlich
  scheitert, gibt es die Antwortmöglichkeit „eine Fehlermeldung“. Solche Steps
  sind mit `expectsError: true` markiert und gelten trotz Fehler als gelöst.
- **Datensätze liegen lokal.** Die Data-Analytics-Kapitel luden ihre CSV-Dateien
  im Original per URL von GitHub nach (mit `pyodide_http`). Stattdessen liegen
  sie jetzt unter `public/data/` und werden vom Worker ins Dateisystem von
  Pyodide kopiert. Studierende schreiben schlicht `pd.read_csv('cereals.csv')` –
  das funktioniert offline und bleibt lesbar.
- **Data-Analytics-Kapitel wurden interaktiv gemacht.** Im Original bestanden
  Kapitel 10–12 fast ausschließlich aus Code zum Kopieren. Die
  „Show Your Skills“-Seiten sind jetzt echte, automatisch geprüfte Übungen
  (Lückentext mit `?`), damit auch dieser Teil des Kurses Rückmeldung gibt.
- **`assert_equal` ist eingebaut.** Die Testhilfe steht in jedem Programm zur
  Verfügung (siehe `public/python_intro_runtime.py`), damit Kapitel 8 das Thema
  Testen behandeln kann, ohne ein Test-Framework einzuführen.
- **`input()` mit vorbelegten Antworten.** Eine echte Tastatureingabe mitten im
  Programmlauf ist im Browser nicht möglich (das bräuchte `SharedArrayBuffer`
  und damit COOP/COEP-Header, die wiederum das Nachladen der Pyodide-Pakete
  brechen). Stattdessen legt die Lektion die Antworten vorher fest; sie werden
  beim Ausführen als `<Eingabe: …>` mitprotokolliert. Das ist in den
  betroffenen Lektionen ausdrücklich erklärt.
- **Kapitel 11 zählt 80 statt 77 Zeilen.** `cereals.csv` enthält drei doppelte
  Datensätze. Das ist kein Fehler, sondern der Grund, warum die Lektion über
  Duplikate genau dort steht.

## Qualitätssicherung

`npm run content:check` führt **jede** Musterlösung, **jedes** vorgegebene
Programm und **jede** Vorhersage-Antwort mit derselben Laufzeit aus, die auch im
Browser läuft (`public/python_intro_runtime.py`), und meldet unter anderem:

- Musterlösungen, die ihre eigenen Testfälle nicht bestehen
- vorgegebene Programme, die unerwartet abstürzen
- Vorhersage-Antworten, die nicht zur echten Ausgabe passen
- mehrdeutige Vorhersage-Fragen (zwei gleich richtige Antworten)
- doppelte IDs und Übungen ohne Tipps

Für die Kapitel 10–12 werden dabei NumPy, Pandas und scikit-learn benötigt.
Einmalig einrichten:

```bash
python3 -m venv .venv && .venv/bin/pip install numpy pandas scikit-learn
```

Danach benutzt `npm run content:check` diese Umgebung automatisch.
