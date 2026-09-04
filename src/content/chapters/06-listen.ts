import type { Chapter } from "../types";

export const listen: Chapter = {
  id: "listen",
  number: 6,
  title: "Listen",
  summary: "Viele Werte in einer Variable – und alles, was man damit anstellen kann.",
  icon: "📋",
  track: "basics",
  lessons: [
    /* ================================================================== *
     *  1 – Listen kennenlernen
     * ================================================================== */
    {
      id: "listen/einfuehrung",
      title: "Listen kennenlernen",
      summary: "Mehrere Werte unter einem Namen sammeln und durchlaufen.",
      steps: [
        {
          id: "erste-liste",
          kind: "run",
          surface: "editor",
          program: `woerter = ['Das', 'ist', 'eine', 'Liste']

for wort in woerter:
    print(wort)`,
          text: `
Bisher hast du Schleifen über Strings laufen lassen – Zeichen für Zeichen. Jetzt kommt etwas viel Nützlicheres: die **Liste**.

Eine Liste ist ein einzelner Wert, der beliebig viele andere Werte enthält. Du schreibst sie mit eckigen Klammern \`[ ]\` und trennst die Einträge mit Kommas. Führ das aus:

    woerter = ['Das', 'ist', 'eine', 'Liste']

    for wort in woerter:
        print(wort)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "alles-moeglich",
          kind: "run",
          surface: "editor",
          program: `x = 1
dinge = ['Hallo', x, x + 3]
print(dinge)`,
          text: `
Wie du siehst, läuft eine \`for\`-Schleife über eine Liste genauso wie über einen String – nur bekommt die Schleifenvariable diesmal nicht einzelne Zeichen, sondern die Einträge der Liste.

Die Einträge nennt man **Elemente**. Sie dürfen alles sein, auch gemischt, und es müssen keine festen Werte sein – Python rechnet Ausdrücke ganz normal aus:

    x = 1
    dinge = ['Hallo', x, x + 3]
    print(dinge)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "zahlen-summieren",
          kind: "run",
          surface: "editor",
          program: `zahlen = [3, 1, 4, 1, 5, 9]

gesamt = 0
for zahl in zahlen:
    gesamt += zahl

print(gesamt)`,
          text: `
Beachte: \`print(dinge)\` gibt die **ganze Liste** auf einmal aus, mit Klammern und Kommas. Das ist praktisch zum Nachschauen, was gerade drinsteckt.

Ein Klassiker: alle Zahlen einer Liste aufaddieren.

    zahlen = [3, 1, 4, 1, 5, 9]

    gesamt = 0
    for zahl in zahlen:
        gesamt += zahl

    print(gesamt)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "uebung-strings-summieren",
          kind: "exercise",
          mode: "stdout",
          params: ["woerter"],
          tests: [
            { args: [["Das", "ist", "eine", "Liste"]], expected: "DasisteineListe\n" },
            {
              args: [["Der", "schnelle", "braune", "Fuchs"]],
              expected: "DerschnellebrauneFuchs\n",
            },
          ],
          solution: `gesamt = ''
for wort in woerter:
    gesamt += wort

print(gesamt)`,
          hints: [
            "Das ist sehr ähnlich zu den Übungen, in denen du Strings Zeichen für Zeichen aufgebaut hast.",
            "Genauer gesagt: Es ist fast dasselbe Programm wie das Zahlen-Summieren von eben. Was passiert, wenn du das einfach mit einer Wortliste laufen lässt?",
            "Das Problem ist die `0`. Zu einem String kann man keine Zahl addieren – die beiden Typen passen nicht zusammen.",
            "Gibt es bei Strings etwas Ähnliches wie die `0`? Einen leeren Startwert?",
            "Ja: der leere String `''`. Starte mit `gesamt = ''`.",
          ],
          text: `
Jetzt du. Bau das Programm so um, dass es eine Liste von **Strings** zusammenhängt statt Zahlen zu addieren.

Für

    woerter = ['Das', 'ist', 'eine', 'Liste']

soll herauskommen:

    DasisteineListe
`,
          task: "Hänge alle Wörter der Liste aneinander und gib das Ergebnis aus.",
        },
        {
          id: "uebung-trennzeichen",
          kind: "exercise",
          mode: "stdout",
          params: ["woerter", "trenner"],
          tests: [
            {
              args: [["Das", "ist", "eine", "Liste"], " - "],
              expected: "Das - ist - eine - Liste\n",
            },
            {
              args: [["Der", "schnelle", "braune", "Fuchs"], "**"],
              expected: "Der**schnelle**braune**Fuchs\n",
            },
          ],
          solution: `gesamt = ''
nicht_erstes = False

for wort in woerter:
    if nicht_erstes:
        gesamt += trenner
    gesamt += wort
    nicht_erstes = True

print(gesamt)`,
          hints: [
            "Bau auf deiner Lösung von eben auf.",
            "Diese Aufgabe braucht nichts Ausgefallenes – die Lösung ist am Ende kurz. Aber sie richtig hinzubekommen ist knifflig, überleg dir den Ansatz in Ruhe.",
            "In jedem Durchlauf musst du zusätzlich zum Wort auch den Trenner anhängen.",
            "Nur: Nach dem letzten Wort willst du keinen Trenner mehr.",
            "Bei Strings gibt es leider kein „Minus“ – du kannst den letzten Trenner nicht nachträglich wieder abziehen.",
            "Schritt zurück: Am Ende sollen `n` Wörter und `n - 1` Trenner drinstehen. Du willst den Trenner also in jedem Durchlauf anhängen – außer in genau einem.",
            "Mit einem `if` kannst du das Anhängen in genau einem Durchlauf überspringen. Am einfachsten ist das der **erste**.",
            "Leg dir eine Boolean-Variable an, die zu Beginn `False` ist und am Ende jedes Durchlaufs auf `True` gesetzt wird.",
          ],
          text: `
Ausgezeichnet!

Wenn du magst, kannst du direkt weitergehen – die nächste Aufgabe ist eine freiwillige Zusatzherausforderung.

Erweitere das Programm so, dass **zwischen** den Wörtern ein Trennzeichen steht. Für

    woerter = ['Das', 'ist', 'eine', 'Liste']
    trenner = ' - '

soll herauskommen:

    Das - ist - eine - Liste
`,
          task: "Setze den Trenner zwischen die Wörter – aber nicht davor und nicht dahinter.",
        },
      ],
      outro: `
Geschafft – das war wirklich knifflig! Eine mögliche Lösung sieht so aus:

    woerter = ['Das', 'ist', 'eine', 'Liste']
    trenner = ' - '
    gesamt = ''
    nicht_erstes = False

    for wort in woerter:
        if nicht_erstes:
            gesamt += trenner
        gesamt += wort
        nicht_erstes = True

    print(gesamt)

Der Trick ist die Variable \`nicht_erstes\`: Im ersten Durchlauf ist sie \`False\`, das \`if\` greift nicht, der Trenner wird übersprungen. Danach ist sie für immer \`True\`.

(Nebenbei: Python hat für genau diesen Fall die Methode \`' - '.join(woerter)\` – aber es ist wertvoll, den Mechanismus einmal selbst gebaut zu haben.)
`,
    },

    /* ================================================================== *
     *  2 – Neue Listen bauen
     * ================================================================== */
    {
      id: "listen/neue-listen",
      title: "Neue Listen bauen",
      summary: "Aus einer Liste eine neue machen – verdoppeln, filtern, umformen.",
      steps: [
        {
          id: "listen-verbinden",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2] + [3, 4]
print(zahlen)
neue_zahlen = []
neue_zahlen += zahlen
neue_zahlen += [5]
print(neue_zahlen)`,
          text: `
Listen und Strings haben viel gemeinsam. Zum Beispiel kannst du zwei Listen mit \`+\` zu einer neuen verbinden. Und du kannst eine **leere Liste** anlegen, die noch gar keine Elemente hat. Probier es aus:

    zahlen = [1, 2] + [3, 4]
    print(zahlen)
    neue_zahlen = []
    neue_zahlen += zahlen
    neue_zahlen += [5]
    print(neue_zahlen)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "uebung-verdoppeln",
          kind: "exercise",
          mode: "stdout",
          params: ["zahlen"],
          tests: [
            {
              args: [[3, 1, 4, 1, 5, 9, 2, 6, 5]],
              expected: "[6, 2, 8, 2, 10, 18, 4, 12, 10]\n",
            },
            { args: [[0, 1, 2, 3]], expected: "[0, 2, 4, 6]\n" },
          ],
          solution: `doppelt = []
for zahl in zahlen:
    doppelt += [zahl * 2]
print(doppelt)`,
          hints: [
            "Multiplizieren geht mit `*`.",
            "Der Aufbau ist derselbe wie bei den Programmen, in denen du Strings Stück für Stück zusammengebaut hast.",
            "Leg eine neue Liste an und füll sie in einer Schleife Element für Element.",
            "Starte mit einer leeren Liste: `doppelt = []`.",
            "Eine Liste mit genau einem Element `x` schreibst du als `[x]`.",
            "Mit `doppelt += [zahl * 2]` hängst du ein Element an.",
          ],
          text: `
Mit diesem Wissen: Schreib ein Programm, das eine Liste von Zahlen nimmt und eine Liste ausgibt, in der jede Zahl **verdoppelt** wurde.

Für

    zahlen = [3, 1, 4, 1, 5, 9, 2, 6, 5]

soll das hier herauskommen:

    [6, 2, 8, 2, 10, 18, 4, 12, 10]
`,
          task: "Baue eine neue Liste mit allen Zahlen verdoppelt und gib sie aus.",
        },
        {
          id: "uebung-filtern",
          kind: "exercise",
          mode: "stdout",
          params: ["zahlen"],
          disallowedAst: {
            nodes: ["AugAssign"],
            message: "Richtig gerechnet! Benutz hier aber bitte `.append()` statt `+=`.",
          },
          tests: [
            { args: [[3, 1, 4, 1, 5, 9, 2, 6, 5]], expected: "[9, 6]\n" },
            { args: [[0, 2, 4, 6, 8, 10]], expected: "[6, 8, 10]\n" },
          ],
          solution: `grosse_zahlen = []
for zahl in zahlen:
    if zahl > 5:
        grosse_zahlen.append(zahl)
print(grosse_zahlen)`,
          hints: [
            "Sehr ähnlich zur vorigen Aufgabe.",
            "Der Unterschied: Manchmal sollst du das Anhängen überspringen.",
            "Dafür brauchst du ein `if`.",
            "Und einen Vergleichsoperator, der prüft, ob die Zahl groß genug ist: `if zahl > 5:`",
          ],
          text: `
Super!

Wenn du ein einzelnes Element ans Ende einer Liste hängen willst, schreibt man statt

    irgendeine_liste += [element]

üblicherweise:

    irgendeine_liste.append(element)

Ein großer Unterschied besteht nicht, aber \`.append\` ist die Schreibweise, die alle kennen und sofort lesen können.

Benutz jetzt \`.append\`, um ein Programm zu schreiben, das aus einer Liste von Zahlen eine neue Liste macht – mit **nur den Zahlen größer als 5**.

Für

    zahlen = [3, 1, 4, 1, 5, 9, 2, 6, 5]

also:

    [9, 6]
`,
          task: "Filtere alle Zahlen größer als 5 mit `.append()` in eine neue Liste.",
        },
      ],
      outro: `
Fantastisch – du kommst richtig gut voran!

Du beherrschst jetzt die zwei wichtigsten Muster im Umgang mit Listen:

- **Umformen** („für jedes Element etwas Neues berechnen und anhängen“)
- **Filtern** („nur anhängen, wenn eine Bedingung stimmt“)

Erstaunlich viele Programme bestehen im Kern aus genau diesen beiden Bausteinen.
`,
    },

    /* ================================================================== *
     *  3 – Schleifen abbrechen mit break
     * ================================================================== */
    {
      id: "listen/break",
      title: "Schleifen früher beenden",
      summary: "Mit `break` aussteigen, sobald die Antwort feststeht.",
      steps: [
        {
          id: "uebung-enthaelt",
          kind: "exercise",
          mode: "stdout",
          params: ["dinge", "gesucht"],
          tests: [
            { args: [["Das", "ist", "eine", "Liste"], "ist"], expected: "True\n" },
            { args: [["Das", "ist", "eine", "Liste"], "anderes"], expected: "False\n" },
            { args: [[1, 2, 3, 4], 1], expected: "True\n" },
            { args: [[1, 2, 3, 4], 0], expected: "False\n" },
          ],
          solution: `gefunden = False
for ding in dinge:
    if ding == gesucht:
        gefunden = True

print(gefunden)`,
          hints: [
            "Du brauchst eine Schleife.",
            "Du brauchst ein `if`.",
            "Und einen Vergleichsoperator – genauer: `==`.",
            "Du brauchst eine Boolean-Variable, die du am Ende ausgibst.",
            "Wenn du das Element findest, setzt du diese Variable auf `True`.",
            "Was einmal gefunden ist, bleibt gefunden: Sobald die Variable `True` ist, darf sie nie wieder etwas anderes werden.",
            "Benutz also kein `else` – es gibt keinen Grund, die Variable innerhalb der Schleife jemals auf `False` zu setzen.",
          ],
          text: `
Übung: Schreib ein Programm, das eine Liste und einen Wert bekommt und prüft, ob die Liste diesen Wert enthält.

Für

    dinge = ['Das', 'ist', 'eine', 'Liste']
    gesucht = 'ist'

soll \`True\` ausgegeben werden, für

    gesucht = 'anderes'

dagegen \`False\`.
`,
          task: "Gib `True` aus, wenn der gesuchte Wert in der Liste vorkommt, sonst `False`.",
        },
        {
          id: "break-ausprobieren",
          kind: "run",
          surface: "editor",
          program: `dinge = ['Das', 'ist', 'eine', 'Liste']
gesucht = 'ist'

gefunden = False
for ding in dinge:
    print('Ich schaue mir an: ' + ding)
    if ding == gesucht:
        gefunden = True
        break

print(gefunden)`,
          text: `
Deine Lösung sieht vermutlich ungefähr so aus:

    gefunden = False
    for ding in dinge:
        if ding == gesucht:
            gefunden = True

    print(gefunden)

Das ist korrekt, aber ein bisschen verschwenderisch: Die Schleife läuft bis zum Ende durch, selbst wenn das Element schon ganz vorne gefunden wurde.

Jede Schleife lässt sich mit \`break\` sofort abbrechen. Führ das aus und achte darauf, welche Wörter überhaupt noch angeschaut werden:

    dinge = ['Das', 'ist', 'eine', 'Liste']
    gesucht = 'ist'

    gefunden = False
    for ding in dinge:
        print('Ich schaue mir an: ' + ding)
        if ding == gesucht:
            gefunden = True
            break

    print(gefunden)
`,
          task: "Führ das Programm aus und beobachte, wo die Schleife aufhört.",
        },
      ],
      outro: `
\`break\` beendet die Schleife sofort – der Rest der Liste wird gar nicht mehr angefasst. Das Ergebnis ist dasselbe, nur ohne unnötige Arbeit.

Merke dir: \`break\` bricht **immer nur die innerste Schleife ab**, in der es steht.
`,
    },

    /* ================================================================== *
     *  4 – Elemente an einer Position
     * ================================================================== */
    {
      id: "listen/index",
      title: "Elemente an einer Position",
      summary: "Einzelne Elemente gezielt herausgreifen – mit Index, `range()` und `len()`.",
      steps: [
        {
          id: "indizierung",
          kind: "run",
          surface: "editor",
          program: `woerter = ['Das', 'ist', 'eine', 'Liste']

print(woerter[0])
print(woerter[1])
print(woerter[2])
print(woerter[3])`,
          text: `
Bisher hast du Listen immer komplett durchlaufen. Oft willst du aber genau **ein bestimmtes** Element haben. Dafür schreibst du die Position in eckigen Klammern hinter die Liste:

    woerter = ['Das', 'ist', 'eine', 'Liste']

    print(woerter[0])
    print(woerter[1])
    print(woerter[2])
    print(woerter[3])
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "index-fehler",
          kind: "run",
          surface: "shell",
          expectsError: true,
          program: `woerter[4]`,
          text: `
Das ist die wichtigste Eigenart überhaupt: **Gezählt wird ab 0.** Das erste Element hat den Index \`0\`, das zweite \`1\`, und so weiter. Die Zahl in den Klammern heißt **Index**, den Vorgang nennt man *indizieren* oder *subscripting*.

Eine Liste mit 4 Elementen hat also die gültigen Indizes 0, 1, 2 und 3. Was passiert bei 4? Probier es in der Shell:

    woerter[4]
`,
          task: "Führ `woerter[4]` in der Shell aus und lies den Fehler.",
        },
        {
          id: "len-und-range",
          kind: "run",
          surface: "editor",
          program: `woerter = ['Das', 'ist', 'eine', 'Liste']
indizes = [0, 1, 2, 3]

for index in indizes:
    print(index)
    print(woerter[index])`,
          prediction: {
            choices: [
              "0\nDas\n1\nist\n2\neine\n3\nListe",
              "Das\n0\nist\n1\neine\n2\nListe\n3",
              "0\n1\n2\n3\nDas\nist\neine\nListe",
              "eine Fehlermeldung",
            ],
            correctIndex: 0,
          },
          text: `
\`IndexError\` – der Index liegt außerhalb der Liste. Merk dir diese Fehlermeldung, du wirst sie noch oft sehen.

Interessant wird das Indizieren in Kombination mit einer Schleife. Was gibt dieses Programm aus?

    woerter = ['Das', 'ist', 'eine', 'Liste']
    indizes = [0, 1, 2, 3]

    for index in indizes:
        print(index)
        print(woerter[index])
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "range-statt-liste",
          kind: "run",
          surface: "editor",
          program: `woerter = ['Das', 'ist', 'eine', 'Liste']
indizes = range(4)

for index in indizes:
    print(index)
    print(woerter[index])`,
          text: `
Die Liste \`[0, 1, 2, 3]\` von Hand hinzuschreiben ist mühsam – und bei 100 Elementen unmöglich. Dafür gibt es \`range\`. Ersetz die zweite Zeile:

    woerter = ['Das', 'ist', 'eine', 'Liste']
    indizes = range(4)

    for index in indizes:
        print(index)
        print(woerter[index])
`,
          task: "Führ das Programm mit `range(4)` aus.",
        },
        {
          id: "range-indizieren",
          kind: "run",
          surface: "editor",
          program: `indizes = range(4)

print(indizes[0])
print(indizes[1])
print(indizes[2])
print(indizes[3])`,
          prediction: {
            choices: ["0\n1\n2\n3", "1\n2\n3\n4", "0\n1\n2\n3\n4", "eine Fehlermeldung"],
            correctIndex: 0,
          },
          text: `
Exakt dasselbe Ergebnis. \`range(4)\` steht für die Zahlen \`0, 1, 2, 3\` – also **vier Zahlen ab 0**, die \`4\` selbst gehört nicht dazu. Das passt perfekt zu den gültigen Indizes einer Liste mit 4 Elementen.

Man kann ein \`range\` sogar indizieren. Was kommt hier heraus?

    indizes = range(4)

    print(indizes[0])
    print(indizes[1])
    print(indizes[2])
    print(indizes[3])
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "range-index-fehler",
          kind: "run",
          surface: "shell",
          expectsError: true,
          program: `indizes[4]`,
          text: `
Und was passiert hier?

    indizes[4]
`,
          prediction: {
            choices: ["4", "0", "None", "eine Fehlermeldung"],
            correctIndex: 3,
          },
          task: "Sag voraus, was passiert, und führ es in der Shell aus.",
        },
        {
          id: "range-anzeigen",
          kind: "run",
          surface: "shell",
          program: `range(4)`,
          text: `
Ein \`range\` verhält sich also fast wie die Liste \`[0, 1, 2, 3]\`. Fast. Schau dir an, was die Shell anzeigt:

    range(4)
`,
          task: "Führ `range(4)` in der Shell aus.",
        },
        {
          id: "range-zu-liste",
          kind: "run",
          surface: "shell",
          program: `list(range(4))`,
          prediction: {
            choices: ["[0, 1, 2, 3]", "range(0, 4)", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]"],
            correctIndex: 0,
          },
          text: `
Ein \`range\` ist eben keine Liste, sondern ein eigener Typ, der die Zahlen erst bei Bedarf erzeugt. Das ist sparsam: \`range(1000000)\` belegt fast keinen Speicher, während eine echte Liste mit einer Million Zahlen ordentlich Platz braucht.

Wenn du die Zahlen wirklich sehen willst, machst du daraus eine Liste:

    list(range(4))
`,
          task: "Sag die Ausgabe voraus und führ es in der Shell aus.",
        },
        {
          id: "len",
          kind: "run",
          surface: "editor",
          program: `woerter = ['Das', 'ist', 'eine', 'Liste']
print(len(woerter))`,
          prediction: {
            choices: ["4", "3", "['Das', 'ist', 'eine', 'Liste']", "eine Fehlermeldung"],
            correctIndex: 0,
          },
          text: `
Bleibt ein Problem: \`range(4)\` funktioniert nur, solange die Liste genau 4 Elemente hat. Wir brauchen die Länge der Liste – dafür gibt es \`len\`:

    woerter = ['Das', 'ist', 'eine', 'Liste']
    print(len(woerter))
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "uebung-letztes-element",
          kind: "exercise",
          mode: "stdout",
          params: ["woerter"],
          tests: [
            { args: [["Python"]], expected: "Python\n" },
            { args: [["Hallo", "Welt"]], expected: "Welt\n" },
            { args: [["Programmieren", "ist", "cool!"]], expected: "cool!\n" },
            { args: [["Das", "ist", "eine", "Liste"]], expected: "Liste\n" },
          ],
          solution: `print(woerter[len(woerter) - 1])`,
          hints: [
            "Um an das letzte Element zu kommen, brauchst du den Index der letzten Position.",
            "Bei 2 Elementen ist das erste an Index 0, das letzte also an Index 1.",
            "Bei 3 Elementen wäre das letzte an Index 2.",
            "Siehst du das Muster zwischen Länge und letztem Index? Wie schreibst du das auf?",
            "Der letzte Index ist immer `len(woerter) - 1`.",
          ],
          text: `
Übung: Gib für eine beliebige, nicht leere Liste \`woerter\` das **letzte** Element aus.

Für

    woerter = ['Das', 'ist', 'eine', 'Liste']

soll dein Programm \`Liste\` ausgeben. Es muss aber für **jede** Länge funktionieren.
`,
          task: "Gib das letzte Element der Liste aus – für jede beliebige Länge.",
        },
        {
          id: "uebung-index-und-wort",
          kind: "exercise",
          mode: "stdout",
          params: ["woerter"],
          starter: `woerter = ['Das', 'ist', 'eine', 'Liste']

for index in ...:
    print(index)
    print(woerter[index])`,
          tests: [
            { args: [["Python"]], expected: "0\nPython\n" },
            { args: [["Hallo", "Welt"]], expected: "0\nHallo\n1\nWelt\n" },
            {
              args: [["Das", "ist", "eine", "Liste"]],
              expected: "0\nDas\n1\nist\n2\neine\n3\nListe\n",
            },
          ],
          solution: `for index in range(len(woerter)):
    print(index)
    print(woerter[index])`,
          hints: [
            "Vorhin hast du `range(4)` benutzt.",
            "Diesmal soll es für jede Liste funktionieren – auch für eine mit 5 oder 10 Elementen.",
            "Kombiniere die beiden Funktionen, die du gerade gelernt hast!",
            "`range(len(woerter))`",
          ],
          text: `
Allgemein gilt also: Die gültigen Indizes sind

    [0, 1, 2, ..., len(woerter) - 2, len(woerter) - 1]

Jetzt können wir das Programm von vorhin so reparieren, dass es mit jeder Liste läuft. Füll die \`...\` aus:

    woerter = ['Das', 'ist', 'eine', 'Liste']

    for index in ...:
        print(index)
        print(woerter[index])

Für das Beispiel soll herauskommen:

    0
    Das
    1
    ist
    2
    eine
    3
    Liste
`,
          task: "Ersetze die `...` so, dass es für Listen jeder Länge funktioniert.",
        },
      ],
      outro: `
\`range(len(liste))\` ist eine der Standardformeln in Python – die siehst du ab jetzt überall.

Wenn du dich mit \`range\` und \`len\` noch nicht ganz sicher fühlst, probier ein paar davon selbst aus:

- Gib die Zahlen von 1 bis 100 aus.
- Gib deinen Namen 100-mal aus.
- Gib jedes Wort einer Liste aus – außer dem letzten.
- Gib die Wörter in umgekehrter Reihenfolge aus: erst das letzte, dann das vorletzte …
- Nimm dir noch einmal die Bonusaufgabe mit dem Trennzeichen vor. Mit \`range\` und \`len\` ist sie jetzt deutlich einfacher!
`,
    },

    /* ================================================================== *
     *  5 – Übungen mit range und len
     * ================================================================== */
    {
      id: "listen/index-uebungen",
      title: "Übungen mit `range` und `len`",
      summary: "Drei Aufgaben, die alles bisher Gelernte kombinieren.",
      steps: [
        {
          id: "uebung-erster-index",
          kind: "exercise",
          mode: "stdout",
          params: ["dinge", "gesucht"],
          tests: [
            { args: [["auf", "dem", "Weg", "zu", "dem", "Laden"], "dem"], expected: "1\n" },
            { args: [[0, 1, 2, 3, 4, 5, 6, 6], 6], expected: "6\n" },
          ],
          solution: `for i in range(len(dinge)):
    if gesucht == dinge[i]:
        print(i)
        break`,
          hints: [
            "Du musst alle möglichen Indizes durchgehen und prüfen, welcher der richtige ist.",
            "Alle Indizes durchgehen heißt: eine Schleife über `range(len(dinge))`.",
            "Zum Prüfen brauchst du `if`, den Index in eckigen Klammern und `==`.",
            "Gesucht ist der **erste** Treffer – du musst die Schleife also stoppen, sobald du einen gefunden hast.",
            "Wie man eine Schleife stoppt, hast du gerade gelernt: mit `break`.",
          ],
          text: `
Gegeben sind eine Liste \`dinge\` und ein Wert \`gesucht\`. Gib den **ersten** Index aus, an dem \`gesucht\` in der Liste steht – also die kleinste Zahl \`i\`, für die \`dinge[i]\` gleich \`gesucht\` ist.

Für

    dinge = ['auf', 'dem', 'Weg', 'zu', 'dem', 'Laden']
    gesucht = 'dem'

soll \`1\` ausgegeben werden. Du darfst davon ausgehen, dass \`gesucht\` mindestens einmal vorkommt.
`,
          task: "Gib den ersten Index des gesuchten Werts aus.",
        },
        {
          id: "uebung-nebeneinander",
          kind: "exercise",
          mode: "stdout",
          params: ["text1", "text2"],
          tests: [
            { args: ["Hallo", "Wurst"], expected: "H W\na u\nl r\nl s\no t\n" },
            { args: ["Sonne", "Wolke"], expected: "S W\no o\nn l\nn k\ne e\n" },
          ],
          solution: `for i in range(len(text1)):
    zeichen1 = text1[i]
    zeichen2 = text2[i]
    print(zeichen1 + ' ' + zeichen2)`,
          hints: [
            "Hast du in der Shell ausprobiert, ob Indizierung und `len()` auch bei Strings gehen? Ja, tun sie.",
            "Vergiss Schleifen kurz: Wie würdest du nur die erste Zeile ausgeben – also das erste Zeichen von beiden Strings?",
            "In der zweiten Zeile willst du das zweite Zeichen von beiden, und so weiter.",
            "Du brauchst: eine `for`-Schleife, Indizierung, `range`, `len` und `+`.",
            "Du musst denselben Index bei **beiden** Strings verwenden, um die zusammengehörenden Zeichen zu bekommen.",
          ],
          text: `
Klasse!

Übrigens: Indizierung und \`len()\` funktionieren genauso bei **Strings**. Probier es ruhig kurz in der Shell aus.

Nächste Aufgabe. Gegeben sind zwei gleich lange Strings, z. B.

    text1 = 'Hallo'
    text2 = 'Wurst'

Gib sie senkrecht nebeneinander aus, mit einem Leerzeichen zwischen den Zeichen:

    H W
    a u
    l r
    l s
    o t
`,
          task: "Gib beide Strings zeichenweise nebeneinander aus.",
        },
        {
          id: "uebung-nebeneinander-ungleich",
          kind: "exercise",
          mode: "stdout",
          params: ["text1", "text2"],
          tests: [
            {
              args: ["Guten Tag", "Hallo"],
              expected: "G H\nu a\nt l\ne l\nn o\n  \nT \na \ng \n",
            },
            {
              args: ["Hallo", "Elisabeth"],
              expected: "H E\na l\nl i\nl s\no a\n  b\n  e\n  t\n  h\n",
            },
          ],
          solution: `laenge1 = len(text1)
laenge2 = len(text2)

if laenge1 > laenge2:
    laenge = laenge1
else:
    laenge = laenge2

for i in range(laenge):
    if i < len(text1):
        zeichen1 = text1[i]
    else:
        zeichen1 = ' '

    if i < len(text2):
        zeichen2 = text2[i]
    else:
        zeichen2 = ' '

    print(zeichen1 + ' ' + zeichen2)`,
          hints: [
            "Wie oft muss die Schleife laufen? So oft wie der **längere** der beiden Strings lang ist.",
            "Die größere von zwei Zahlen bekommst du mit einem `if`/`else`.",
            "Innerhalb der Schleife kann der Index für einen der beiden Strings zu groß sein.",
            "Prüf für jeden String einzeln mit `if i < len(text1):`, ob es das Zeichen überhaupt gibt.",
            "Wenn nicht, nimm stattdessen ein Leerzeichen `' '`.",
          ],
          text: `
Unglaublich!

Deine Lösung sieht wahrscheinlich ungefähr so aus:

    for i in range(len(text1)):
        zeichen1 = text1[i]
        zeichen2 = text2[i]
        print(zeichen1 + ' ' + zeichen2)

Bei **unterschiedlich langen** Strings geht das schief – und zwar auf zwei verschiedene Arten, je nachdem welcher String länger ist. Deine nächste Aufgabe: Repariere das, indem du fehlende Zeichen durch Leerzeichen ersetzt.

Für

    text1 = 'Guten Tag'
    text2 = 'Hallo'

soll herauskommen (die kurzen Zeilen enden also mit einem Leerzeichen):

    G H
    u a
    t l
    e l
    n o

    T
    a
    g

und für

    text1 = 'Hallo'
    text2 = 'Elisabeth'

entsprechend:

    H E
    a l
    l i
    l s
    o a
      b
      e
      t
      h
`,
          task: "Fülle fehlende Zeichen mit Leerzeichen auf, damit auch ungleich lange Strings funktionieren.",
        },
      ],
      outro: `
Großartig! Gönn dir eine Pause, die hast du dir verdient.

Das war die bisher anspruchsvollste Seite. Wenn du diese drei Aufgaben geschafft hast, kannst du bereits: Schleifen, Bedingungen, Indizierung, \`range\`, \`len\` und \`break\` sinnvoll kombinieren. Das ist genau der Werkzeugkasten, mit dem sich erstaunlich viele echte Probleme lösen lassen.
`,
    },

    /* ================================================================== *
     *  6 – Funktionen und Methoden aufrufen
     * ================================================================== */
    {
      id: "listen/funktionen-und-methoden",
      title: "Funktionen und Methoden",
      summary: "Die Begriffe sauber sortieren: aufrufen, Argument, Rückgabewert, Methode.",
      steps: [
        {
          id: "funktionen-ausgeben",
          kind: "run",
          surface: "editor",
          program: `print(len)
print(print)`,
          text: `
Zeit, ein paar Begriffe zu klären, die du ab jetzt ständig hörst.

\`print\` und \`len\` sind **Funktionen**. Wenn du \`len(woerter)\` schreibst, *rufst du die Funktion auf* und übergibst ihr \`woerter\` als **Argument**.

Funktionen sind aber selbst ganz normale Werte. Schau dir das an:

    print(len)
    print(print)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "callable",
          kind: "run",
          surface: "shell",
          program: `print(callable(len))`,
          text: `
Ohne Klammern passiert also kein Aufruf – du siehst nur die Funktion selbst. Erst die Klammern \`()\` lösen den Aufruf aus.

Ob etwas aufrufbar ist, verrät dir \`callable\`:

    print(callable(len))
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "nicht-aufrufbar",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `f = 'ein String'
print(callable(f))
f()`,
          text: `
Und was ist mit einem String?

    f = 'ein String'
    print(callable(f))
    f()
`,
          task: "Führ das Programm aus und lies die Fehlermeldung.",
        },
        {
          id: "rueckgabewert",
          kind: "run",
          surface: "editor",
          program: `dinge = [1, 2, 3]
laenge = len(dinge)
gedruckt = print(laenge)
print(gedruckt)`,
          text: `
\`TypeError: 'str' object is not callable\` – ein String lässt sich nicht aufrufen.

Der nächste Begriff ist der **Rückgabewert**: Das ist der Wert, zu dem ein Funktionsaufruf wird. \`len(dinge)\` *gibt* die Länge *zurück*.

Was gibt eigentlich \`print\` zurück?

    dinge = [1, 2, 3]
    laenge = len(dinge)
    gedruckt = print(laenge)
    print(gedruckt)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "none-hat-keine-laenge",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `dinge = print([1, 2, 3])
laenge = len(dinge)`,
          text: `
\`print\` gibt \`None\` zurück – also „nichts“. Das ist ein wichtiger Unterschied: \`print\` **zeigt** etwas auf dem Bildschirm an, aber es **gibt nichts zurück**, mit dem du weiterrechnen könntest.

Das ist eine der häufigsten Anfängerfallen. Führ das aus:

    dinge = print([1, 2, 3])
    laenge = len(dinge)
`,
          task: "Führ das Programm aus und lies die Fehlermeldung.",
        },
        {
          id: "methoden",
          kind: "run",
          surface: "editor",
          program: `wort = 'Hallo'
print(wort.upper)
print(wort.upper())`,
          text: `
\`TypeError: object of type 'NoneType' has no len()\` – weil \`dinge\` eben \`None\` ist und nicht die Liste.

Letzter Begriff: die **Methode**. Eine Methode ist eine Funktion, die zu einem Wert gehört und mit einem Punkt dahinter aufgerufen wird – so wie \`.append()\` bei Listen. Auch hier gilt: ohne Klammern kein Aufruf.

    wort = 'Hallo'
    print(wort.upper)
    print(wort.upper())
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "kein-append-bei-strings",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `wort = 'Hallo'
wort.append('!')`,
          text: `
Welche Methoden es gibt, hängt vom Typ des Werts ab. \`.upper()\` gibt es bei Strings, \`.append()\` bei Listen. Was passiert, wenn man das verwechselt?

    wort = 'Hallo'
    wort.append('!')
`,
          task: "Führ das Programm aus und lies die Fehlermeldung.",
        },
      ],
      outro: `
\`AttributeError: 'str' object has no attribute 'append'\`

Das Wort *attribute* in der Fehlermeldung bezieht sich auf den Punkt. Der Fehler entsteht schon bei \`wort.append\` – noch bevor überhaupt aufgerufen wird.

Deine Begriffs-Merkliste:

| Begriff | Bedeutung |
| --- | --- |
| Funktion | eigenständiger Baustein, z. B. \`len(x)\` |
| Methode | Funktion, die zu einem Wert gehört, z. B. \`x.append(1)\` |
| aufrufen | ausführen – passiert nur mit Klammern \`()\` |
| Argument | der Wert, den du in die Klammern schreibst |
| Rückgabewert | das, was der Aufruf am Ende „ist“ |
`,
    },

    /* ================================================================== *
     *  7 – Listenmethoden
     * ================================================================== */
    {
      id: "listen/methoden",
      title: "Listen verändern",
      summary: "`append`, `index`, `pop`, `remove` und das Zuweisen an einer Position.",
      steps: [
        {
          id: "append-vs-plus",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2, 3]
neue_zahlen = zahlen + [4, 5]
print(neue_zahlen)
print(zahlen)
zahlen.append(4)
print(zahlen)`,
          text: `
Jetzt lernst du die wichtigsten Werkzeuge für Listen kennen. Der erste wichtige Unterschied:

    zahlen = [1, 2, 3]
    neue_zahlen = zahlen + [4, 5]
    print(neue_zahlen)
    print(zahlen)
    zahlen.append(4)
    print(zahlen)
`,
          task: "Führ das Programm aus und achte darauf, wann sich `zahlen` ändert.",
        },
        {
          id: "position-zuweisen",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2, 3]
zahlen[1] = 9
print(zahlen)`,
          prediction: {
            choices: ["[1, 9, 3]", "[9, 2, 3]", "[1, 2, 9]", "[1, 2, 3, 9]"],
            correctIndex: 0,
          },
          text: `
Der Unterschied ist zentral:

- \`zahlen + [4, 5]\` erzeugt eine **neue** Liste und lässt \`zahlen\` unberührt.
- \`zahlen.append(4)\` **verändert die Liste selbst** und gibt nichts zurück.

Man kann auch an eine bestimmte Position schreiben. Was kommt hier heraus?

    zahlen = [1, 2, 3]
    zahlen[1] = 9
    print(zahlen)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "index-methode",
          kind: "run",
          surface: "shell",
          program: `[7, 8, 9, 8].index(8)`,
          prediction: {
            choices: ["1", "8", "3", "[1, 3]"],
            correctIndex: 0,
          },
          text: `
Die Methode \`.index()\` sucht einen Wert und liefert seine Position – genau das, was du vorhin von Hand programmiert hast. Was gibt das zurück?

    [7, 8, 9, 8].index(8)
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "pop",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2, 3]
print(zahlen.pop(1))
print(zahlen)`,
          prediction: {
            choices: ["2\n[1, 3]", "1\n[2, 3]", "2\n[1, 2, 3]", "[1, 3]\n2"],
            correctIndex: 0,
          },
          text: `
Richtig: \`.index()\` liefert immer den **ersten** Treffer.

\`.pop()\` entfernt das Element an einer Position – und gibt es zurück. Was passiert hier?

    zahlen = [1, 2, 3]
    print(zahlen.pop(1))
    print(zahlen)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "remove",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2, 3]
zahlen.remove(1)
print(zahlen)`,
          prediction: {
            choices: ["[2, 3]", "[1, 3]", "[1, 2]", "[1, 2, 3]"],
            correctIndex: 0,
          },
          text: `
Aufgepasst, jetzt kommt eine beliebte Verwechslung. \`.remove()\` entfernt nicht *an einer Position*, sondern *einen Wert*. Was gibt das aus?

    zahlen = [1, 2, 3]
    zahlen.remove(1)
    print(zahlen)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "kombination-pop-append",
          kind: "run",
          surface: "editor",
          program: `x = ['a', 'b', 'c']
x.append(x.pop(0))
print(x)`,
          text: `
Genau: \`.pop(1)\` entfernt das Element **an Index 1**, \`.remove(1)\` entfernt **den Wert 1**.

Diese Methoden lassen sich verschachteln. Was macht das hier?

    x = ['a', 'b', 'c']
    x.append(x.pop(0))
    print(x)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "letztes-ueberschreiben",
          kind: "run",
          surface: "editor",
          program: `x = ['a', 'b', 'c']
x[len(x) - 1] = x[0]
print(x)`,
          text: `
Das erste Element wird herausgenommen und hinten wieder angehängt – die Liste rotiert also.

Noch ein Beispiel, das Indizierung und Zuweisung kombiniert:

    x = ['a', 'b', 'c']
    x[len(x) - 1] = x[0]
    print(x)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "negativer-index",
          kind: "run",
          surface: "shell",
          program: `x = ['a', 'b', 'c']
print(x[-1])
print(x[-2])`,
          text: `
Eine Kleinigkeit, die dir viel Tipparbeit spart: Statt \`x[len(x) - 1]\` kannst du einfach \`x[-1]\` schreiben. **Negative Indizes zählen von hinten.**

    x = ['a', 'b', 'c']
    print(x[-1])
    print(x[-2])
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "wert-entfernen",
          kind: "run",
          surface: "editor",
          program: `x = [1, 2, 0, 3]
x.pop(x.index(0))
print(x)`,
          text: `
Zum Abschluss eine Kombination aus \`.index()\` und \`.pop()\`:

    x = [1, 2, 0, 3]
    x.pop(x.index(0))
    print(x)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Gut gemacht! Deine Werkzeugkiste für Listen:

| Schreibweise | Wirkung |
| --- | --- |
| \`liste.append(x)\` | hängt \`x\` hinten an |
| \`liste.pop(i)\` | entfernt das Element an Index \`i\` und gibt es zurück |
| \`liste.remove(x)\` | entfernt das erste Vorkommen des **Werts** \`x\` |
| \`liste.index(x)\` | Position des ersten Vorkommens von \`x\` |
| \`liste[i] = x\` | überschreibt die Position \`i\` |
| \`liste[-1]\` | letztes Element |
`,
    },

    /* ================================================================== *
     *  8 – Mehr Funktionen für Listen
     * ================================================================== */
    {
      id: "listen/mehr-funktionen",
      title: "Sortieren, summieren, zählen",
      summary: "`sorted`, `sum`, `in` und `count` – kurze Wege zu häufigen Aufgaben.",
      steps: [
        {
          id: "sorted",
          kind: "run",
          surface: "shell",
          program: `sorted([2, 9, 1, 8, 5, 6])`,
          prediction: {
            choices: [
              "[1, 2, 5, 6, 8, 9]",
              "[9, 8, 6, 5, 2, 1]",
              "[2, 9, 1, 8, 5, 6]",
              "None",
            ],
            correctIndex: 0,
          },
          text: `
Für viele Standardaufgaben bringt Python fertige Funktionen mit. Die ersparen dir jedes Mal eine eigene Schleife.

Was gibt das zurück?

    sorted([2, 9, 1, 8, 5, 6])
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "in-operator",
          kind: "run",
          surface: "editor",
          program: `zahlen = [2, 9, 1, 8, 5, 64]
print(7 in zahlen)
print(2 in zahlen)`,
          prediction: {
            choices: ["False\nTrue", "True\nFalse", "False\nFalse", "True\nTrue"],
            correctIndex: 0,
          },
          text: `
\`sorted\` gibt eine **neue**, sortierte Liste zurück und lässt das Original in Ruhe.

Erinnerst du dich an die Übung, ob eine Liste einen Wert enthält? Dafür gibt es \`in\`:

    zahlen = [2, 9, 1, 8, 5, 64]
    print(7 in zahlen)
    print(2 in zahlen)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "sum",
          kind: "run",
          surface: "shell",
          program: `sum([5, 3, 4])`,
          prediction: {
            choices: ["12", "534", "[5, 3, 4]", "3"],
            correctIndex: 0,
          },
          text: `
Und das Aufsummieren von Zahlen, das du in der ersten Lektion selbst gebaut hast?

    sum([5, 3, 4])
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "count",
          kind: "run",
          surface: "shell",
          program: `[1, 2, 3, 2, 7, 2, 5].count(2)`,
          prediction: {
            choices: ["3", "2", "1", "[1, 3, 5]"],
            correctIndex: 0,
          },
          text: `
\`.count()\` zählt, wie oft ein Wert vorkommt:

    [1, 2, 3, 2, 7, 2, 5].count(2)
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "count-kombiniert",
          kind: "run",
          surface: "editor",
          program: `x = [1, 2, 0, 3]
y = x.count(1) > 0
print(y)`,
          text: `
Diese Bausteine lassen sich beliebig kombinieren. Was macht das hier?

    x = [1, 2, 0, 3]
    y = x.count(1) > 0
    print(y)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "durchschnitt",
          kind: "run",
          surface: "editor",
          program: `x = [15, 12, -6, 3]
y = sum(x) / len(x)
print(y)`,
          text: `
Das ist eine (umständliche) Art zu prüfen, ob \`1\` in der Liste steckt – mit \`1 in x\` ginge es direkter.

Der Durchschnitt einer Zahlenliste ist ein Zweizeiler:

    x = [15, 12, -6, 3]
    y = sum(x) / len(x)
    print(y)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "summe-range",
          kind: "run",
          surface: "editor",
          program: `x = 100
y = sum(range(x + 1))
print(y)`,
          text: `
\`sum\` funktioniert auch mit einem \`range\`. Was ist die Summe aller Zahlen von 0 bis 100?

    x = 100
    y = sum(range(x + 1))
    print(y)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "zweitkleinste",
          kind: "run",
          surface: "editor",
          program: `x = [12, -6, 2, -1, 3]
y = sorted(x)[1]
print(y)`,
          text: `
Beachte das \`x + 1\`: \`range(101)\` geht bis 100 einschließlich.

Zum Schluss ein hübscher Trick – die **zweitkleinste** Zahl einer Liste:

    x = [12, -6, 2, -1, 3]
    y = sorted(x)[1]
    print(y)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Glückwunsch, du beherrschst jetzt die wichtigsten Listenfunktionen!

Sortieren und dann indizieren ist ein häufiges Muster: \`sorted(x)[0]\` ist das Minimum, \`sorted(x)[-1]\` das Maximum, \`sorted(x)[1]\` der zweitkleinste Wert.

Wichtig bleibt der Unterschied zwischen den beiden Sorten von Werkzeugen:

- \`sorted(x)\`, \`sum(x)\`, \`len(x)\` – **Funktionen**, die etwas **zurückgeben**
- \`x.append(1)\`, \`x.remove(1)\` – **Methoden**, die die Liste **verändern**
`,
    },

    /* ================================================================== *
     *  9 – Strings sind unveränderlich
     * ================================================================== */
    {
      id: "listen/strings-unveraenderlich",
      title: "Strings sind unveränderlich",
      summary: "Warum `.upper()` den Originaltext nicht anfasst.",
      steps: [
        {
          id: "in-bei-strings",
          kind: "run",
          surface: "shell",
          program: `print('die' in 'füttere die Katze und die Maus')`,
          text: `
Vieles, was du bei Listen gelernt hast, funktioniert auch bei Strings. \`in\` prüft dort, ob ein Text als **Teilstring** vorkommt:

    print('die' in 'füttere die Katze und die Maus')
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "count-und-index-bei-strings",
          kind: "run",
          surface: "editor",
          program: `text = 'füttere die Katze und die Maus'
print(text.count('die'))
print(text.index('die'))`,
          text: `
Auch \`.count()\` und \`.index()\` gibt es bei Strings:

    text = 'füttere die Katze und die Maus'
    print(text.count('die'))
    print(text.index('die'))
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "kein-append-string",
          kind: "run",
          surface: "shell",
          expectsError: true,
          program: `'Python'.append(' ist cool!')`,
          text: `
Ein entscheidender Unterschied bleibt aber: Eine Liste kannst du **verändern**, einen String nicht. Strings sind *unveränderlich* (englisch **immutable**).

    'Python'.append(' ist cool!')
`,
          task: "Führ das in der Shell aus und lies die Fehlermeldung.",
        },
        {
          id: "upper-veraendert-nicht",
          kind: "run",
          surface: "editor",
          program: `satz = "Python rockt!"
neuer_satz = satz.upper()
print(satz)
print(neuer_satz)`,
          text: `
Es gibt schlicht keine Methode, die einen String an Ort und Stelle verändert. Jede String-Methode gibt stattdessen einen **neuen** String zurück:

    satz = "Python rockt!"
    neuer_satz = satz.upper()
    print(satz)
    print(neuer_satz)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Beachte: \`satz.upper()\` ändert \`satz\` **nicht**. Wer das übersieht, sucht lange nach dem Fehler:

    satz.upper()          # bewirkt praktisch nichts – das Ergebnis verpufft
    satz = satz.upper()   # so ist es richtig

Du kannst solche Methoden natürlich auch direkt in einem größeren Ausdruck verwenden, zum Beispiel:

    if antwort.lower() == 'ja':

Das ist ein guter Trick, damit \`Ja\`, \`JA\` und \`ja\` alle gleich behandelt werden.
`,
    },

    /* ================================================================== *
     *  10 – Informationen selbst finden
     * ================================================================== */
    {
      id: "listen/hilfe-finden",
      title: "Selbst weiterkommen",
      summary: "Die wichtigste Fähigkeit überhaupt: herausfinden, was es schon gibt.",
      steps: [
        {
          id: "max-suchen",
          kind: "run",
          surface: "shell",
          program: `max([21, 55, 4, 91, 62, 49])`,
          text: `
Niemand kennt alle Funktionen auswendig – auch Profis nicht. Der Unterschied ist, dass sie wissen, **wie man nachschaut**.

Angenommen, du brauchst die größte Zahl einer Liste. Du würdest suchen: *„python largest number in list“*. Die Antwort wäre \`max\`:

    max([21, 55, 4, 91, 62, 49])
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "insert",
          kind: "run",
          surface: "editor",
          program: `zahlen = [1, 2, 3, 4, 5]
zahlen.insert(2, 9)
print(zahlen)`,
          text: `
Oder: *„python insert into list at position“* führt dich zu \`.insert()\`:

    zahlen = [1, 2, 3, 4, 5]
    zahlen.insert(2, 9)
    print(zahlen)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "dir",
          kind: "run",
          surface: "shell",
          program: `dir([])`,
          text: `
Python kann dir aber auch direkt sagen, was ein Wert alles kann. \`dir()\` listet alle Attribute auf:

    dir([])
`,
          task: "Führ das in der Shell aus und scroll ans Ende der Liste.",
        },
      ],
      outro: `
\`dir()\` liefert eine Liste der Attribute – überwiegend Methoden. Viele beginnen mit \`__\`, die kannst du fürs Erste ignorieren. Interessant ist das Ende der Liste: Dort stehen \`append\`, \`count\`, \`index\`, \`insert\`, \`pop\`, \`remove\`, \`sort\` und Co.

Drei Werkzeuge, die dich ab jetzt begleiten:

- **Suchmaschine** – formulier dein Problem in Alltagssprache, am besten auf Englisch: *„python how to …“*
- **\`dir(wert)\`** – was kann dieser Wert?
- **\`help(len)\`** – was macht das genau? Probier es ruhig gleich in der Shell aus.

Nachschauen ist kein Schummeln, sondern die Arbeitsweise von Profis.
`,
    },

    /* ================================================================== *
     *  11 – Programme gedanklich nachvollziehen
     * ================================================================== */
    {
      id: "listen/nachvollziehen",
      title: "Programme nachvollziehen",
      summary: "Wenn du nicht weißt, warum etwas schiefgeht: Schritt für Schritt hinschauen.",
      steps: [
        {
          id: "programm-mitverfolgen",
          kind: "run",
          surface: "editor",
          program: `alle_zahlen = [2, 4, 8, 1, 9, 7]

kleine_zahlen = []
grosse_zahlen = []

for zahl in alle_zahlen:
    if zahl <= 5:
        kleine_zahlen.append(zahl)
    else:
        grosse_zahlen.append(zahl)

print(kleine_zahlen)
print(grosse_zahlen)`,
          text: `
Je größer deine Programme werden, desto häufiger passiert es: Es läuft, aber es kommt etwas anderes heraus als gedacht. Dann hilft nur eins – dem Programm **Schritt für Schritt** zusehen.

Führ dieses Programm zuerst aus:

    alle_zahlen = [2, 4, 8, 1, 9, 7]

    kleine_zahlen = []
    grosse_zahlen = []

    for zahl in alle_zahlen:
        if zahl <= 5:
            kleine_zahlen.append(zahl)
        else:
            grosse_zahlen.append(zahl)

    print(kleine_zahlen)
    print(grosse_zahlen)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "print-debugging",
          kind: "run",
          surface: "editor",
          program: `alle_zahlen = [2, 4, 8, 1, 9, 7]

kleine_zahlen = []
grosse_zahlen = []

for zahl in alle_zahlen:
    print('--- Durchlauf mit zahl =', zahl)
    if zahl <= 5:
        kleine_zahlen.append(zahl)
    else:
        grosse_zahlen.append(zahl)
    print('   kleine:', kleine_zahlen)
    print('   grosse:', grosse_zahlen)

print(kleine_zahlen)
print(grosse_zahlen)`,
          text: `
Und jetzt der Trick, den erfahrene Entwicklerinnen und Entwickler täglich benutzen: **print-Debugging**. Du baust zusätzliche \`print\`-Zeilen ein, die dir verraten, was das Programm gerade tut.

Übrigens: \`print\` kann mehrere Werte auf einmal ausgeben, wenn du sie mit Kommas trennst.

    alle_zahlen = [2, 4, 8, 1, 9, 7]

    kleine_zahlen = []
    grosse_zahlen = []

    for zahl in alle_zahlen:
        print('--- Durchlauf mit zahl =', zahl)
        if zahl <= 5:
            kleine_zahlen.append(zahl)
        else:
            grosse_zahlen.append(zahl)
        print('   kleine:', kleine_zahlen)
        print('   grosse:', grosse_zahlen)

    print(kleine_zahlen)
    print(grosse_zahlen)
`,
          task: "Führ das Programm aus und verfolge die Zwischenstände.",
        },
        {
          id: "tabelle-selbst-fuehren",
          kind: "experiment",
          surface: "editor",
          anyValidCode: true,
          example: `woerter = ['rot', 'gelb', 'blau']
gesamt = ''

for wort in woerter:
    print('wort =', wort, '| gesamt vorher =', gesamt)
    gesamt += wort
    print('                | gesamt nachher =', gesamt)

print(gesamt)`,
          hints: [
            "Nimm irgendein Programm aus den letzten Lektionen – zum Beispiel eines, bei dem du dir unsicher warst.",
            "Setz ein `print` an den Anfang des Schleifenrumpfs, das die Schleifenvariable ausgibt.",
            "Setz ein zweites `print` ans Ende, das die Variable ausgibt, die du aufbaust.",
          ],
          text: `
Jetzt du. Nimm ein beliebiges Programm mit einer Schleife und bau \`print\`-Zeilen ein, die dir bei jedem Durchlauf den Zwischenstand zeigen.

Du kannst dafür das Beispiel unten benutzen oder ein eigenes Programm schreiben – Hauptsache, du siehst deinem Code beim Denken zu.
`,
          task: "Schreib ein Programm mit Schleife und lass dir die Zwischenstände ausgeben.",
        },
      ],
      outro: `
Diese Fähigkeit ist Gold wert. Wenn ein Programm nicht das tut, was du erwartest, rate nicht – **schau nach**:

1. Wo genau weicht das Verhalten von deiner Erwartung ab?
2. Welche Werte haben die Variablen an dieser Stelle wirklich?
3. Welche Zeile hat diesen Wert gesetzt?

Ein zweiter, sehr wirksamer Trick: Führ das Programm **im Kopf** aus und schreib die Variablen als Tabelle auf ein Blatt Papier – eine Spalte pro Variable, eine Zeile pro Durchlauf. Genau das macht ein Computer auch, nur schneller.
`,
    },

    /* ================================================================== *
     *  12 – == vs is
     * ================================================================== */
    {
      id: "listen/gleich-vs-is",
      title: "`==` oder `is`?",
      summary: "Zwei gleiche Listen sind noch lange nicht dieselbe Liste.",
      steps: [
        {
          id: "zwei-getrennte-listen",
          kind: "run",
          surface: "editor",
          program: `liste1 = [1, 2, 3]
liste2 = [1, 2, 3]

print(liste1)
print(liste2)
print(liste1 == liste2)

print(liste1 is liste2)

liste1.append(4)
print(liste1)
print(liste2)`,
          text: `
Jetzt kommt ein Thema, das viele Stunden Fehlersuche erspart.

    liste1 = [1, 2, 3]
    liste2 = [1, 2, 3]

    print(liste1)
    print(liste2)
    print(liste1 == liste2)

    print(liste1 is liste2)

    liste1.append(4)
    print(liste1)
    print(liste2)
`,
          task: "Führ das Programm aus und achte auf den Unterschied zwischen `==` und `is`.",
        },
        {
          id: "dieselbe-liste",
          kind: "run",
          surface: "editor",
          program: `liste1 = [1, 2, 3]
liste2 = liste1

print(liste1)
print(liste2)
print(liste1 == liste2)

print(liste1 is liste2)

liste1.append(4)
print(liste1)
print(liste2)`,
          prediction: {
            choices: [
              "[1, 2, 3]\n[1, 2, 3]\nTrue\nTrue\n[1, 2, 3, 4]\n[1, 2, 3, 4]",
              "[1, 2, 3]\n[1, 2, 3]\nTrue\nTrue\n[1, 2, 3, 4]\n[1, 2, 3]",
              "[1, 2, 3]\n[1, 2, 3]\nTrue\nFalse\n[1, 2, 3, 4]\n[1, 2, 3]",
              "[1, 2, 3]\n[1, 2, 3]\nFalse\nFalse\n[1, 2, 3, 4]\n[1, 2, 3]",
            ],
            correctIndex: 0,
          },
          text: `
\`liste1 == liste2\` ist \`True\`: Die beiden Listen **haben denselben Inhalt**.

\`liste1 is liste2\` ist dagegen \`False\`: Es sind **zwei verschiedene Listen**, die zufällig gleich aussehen. Deshalb ändert \`liste1.append(4)\` auch nur die eine.

Jetzt ändern wir eine einzige Zeile. Was passiert dann?

    liste1 = [1, 2, 3]
    liste2 = liste1

    print(liste1)
    print(liste2)
    print(liste1 == liste2)

    print(liste1 is liste2)

    liste1.append(4)
    print(liste1)
    print(liste2)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
      ],
      outro: `
Jetzt ist \`liste1 is liste2\` gleich \`True\`, denn **es gibt nur eine einzige Liste**. Die Namen \`liste1\` und \`liste2\` zeigen beide auf dieselbe. \`liste1.append(4)\` hängt an diese eine Liste an – und das siehst du folgerichtig in beiden \`print\`-Zeilen.

\`liste2 = liste1\` erzeugt aber **keine dauerhafte Verbindung** zwischen den Variablen. Wenn du einer der beiden einen neuen Wert zuweist, etwa \`liste1 = [7, 8, 9]\`, bleibt die andere unberührt und zeigt weiter auf die alte Liste.

Eine Zuweisung

    liste2 = <ausdruck>

heißt immer nur: „Lass \`liste2\` ab jetzt auf das zeigen, was \`<ausdruck>\` ergibt.“

**Merksatz:**

- \`==\` fragt: *Sieht es gleich aus?*
- \`is\` fragt: *Ist es dasselbe Ding?*

Im Alltag willst du fast immer \`==\`. \`is\` benutzt man praktisch nur für \`is None\`.

Und wenn du eine echte Kopie brauchst: \`liste2 = liste1.copy()\`.
`,
    },

    /* ================================================================== *
     *  13 – Verändern während des Durchlaufens
     * ================================================================== */
    {
      id: "listen/waehrend-iteration",
      title: "Die klassische Falle",
      summary: "Niemals eine Liste verändern, während man sie durchläuft.",
      steps: [
        {
          id: "kaputte-schleife",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `zahlen = [10, 7, 8, 3, 12, 15]
for i in range(len(zahlen)):
    zahl = zahlen[i]
    if zahl <= 10:
        zahlen.pop(i)
print(zahlen)`,
          text: `
Zum Abschluss dieses Kapitels ein Fehler, in den wirklich jede und jeder einmal tappt.

Die Aufgabe klingt harmlos: Entferne alle Zahlen, die kleiner oder gleich 10 sind. Führ das aus:

    zahlen = [10, 7, 8, 3, 12, 15]
    for i in range(len(zahlen)):
        zahl = zahlen[i]
        if zahl <= 10:
            zahlen.pop(i)
    print(zahlen)
`,
          task: "Führ das Programm aus und sieh dir den Fehler an.",
        },
        {
          id: "remove-statt-pop",
          kind: "run",
          surface: "editor",
          program: `zahlen = [10, 7, 8, 3, 12, 15]
for zahl in zahlen:
    if zahl <= 10:
        zahlen.remove(zahl)
print(zahlen)`,
          text: `
\`IndexError\` – klar: \`range(len(zahlen))\` wurde einmal am Anfang festgelegt, aber die Liste wird beim Laufen immer kürzer. Am Ende zeigt der Index ins Leere.

Zweiter Versuch, diesmal ohne Indizes. Sieht sauber aus, oder?

    zahlen = [10, 7, 8, 3, 12, 15]
    for zahl in zahlen:
        if zahl <= 10:
            zahlen.remove(zahl)
    print(zahlen)
`,
          prediction: {
            choices: ["[12, 15]", "[8, 12, 15]", "[7, 3, 12, 15]", "eine Fehlermeldung"],
            correctIndex: 2,
          },
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "kopie-durchlaufen",
          kind: "run",
          surface: "editor",
          program: `zahlen = [10, 7, 8, 3, 12, 15]
for zahl in zahlen.copy():
    if zahl <= 10:
        zahlen.remove(zahl)
print(zahlen)`,
          text: `
Überrascht? Die \`7\` und die \`3\` sind noch drin, obwohl beide kleiner als 10 sind – und **es gab keine Fehlermeldung**. Genau das macht diesen Fehler so gefährlich.

Der Grund: Die Schleife merkt sich intern eine Position. Wird ein Element entfernt, rutschen alle nachfolgenden eine Stelle nach vorne – und die Schleife **überspringt** dabei eines. Nach dem Entfernen der \`10\` steht die \`7\` an Position 0, die Schleife schaut aber schon bei Position 1 nach.

Lösung 1: Lauf über eine **Kopie**, verändere aber das Original.

    zahlen = [10, 7, 8, 3, 12, 15]
    for zahl in zahlen.copy():
        if zahl <= 10:
            zahlen.remove(zahl)
    print(zahlen)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "kopie-veraendern",
          kind: "run",
          surface: "editor",
          program: `zahlen = [10, 7, 8, 3, 12, 15]
grosse_zahlen = zahlen.copy()

for zahl in zahlen:
    if zahl <= 10:
        grosse_zahlen.remove(zahl)

print(grosse_zahlen)`,
          text: `
Lösung 2: andersherum – lauf über das Original und verändere die **Kopie**.

    zahlen = [10, 7, 8, 3, 12, 15]
    grosse_zahlen = zahlen.copy()

    for zahl in zahlen:
        if zahl <= 10:
            grosse_zahlen.remove(zahl)

    print(grosse_zahlen)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "neue-liste-bauen",
          kind: "run",
          surface: "editor",
          program: `zahlen = [10, 7, 8, 3, 12, 15]
grosse_zahlen = []

for zahl in zahlen:
    if zahl > 10:
        grosse_zahlen.append(zahl)

print(grosse_zahlen)`,
          text: `
Lösung 3 – und das ist die beste: **gar nichts verändern**, sondern eine neue Liste aufbauen. Genau das Filter-Muster aus der zweiten Lektion.

    zahlen = [10, 7, 8, 3, 12, 15]
    grosse_zahlen = []

    for zahl in zahlen:
        if zahl > 10:
            grosse_zahlen.append(zahl)

    print(grosse_zahlen)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Noch einmal in aller Deutlichkeit: ***Verändere niemals etwas, während du darüber iterierst.*** Du hast drei Auswege:

- Über eine **Kopie** laufen und das Original verändern
- Über das **Original** laufen und die Kopie verändern
- Am besten: **gar nichts verändern** und stattdessen eine neue Liste bauen

Die dritte Variante ist fast immer die klarste – man sieht sofort, was herauskommt, und es gibt keine versteckten Nebenwirkungen.

Damit ist das umfangreichste Kapitel geschafft. Listen sind die Datenstruktur, die du in der Praxis am häufigsten benutzen wirst. 🎉
`,
    },
  ],
};
