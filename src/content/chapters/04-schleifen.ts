import type { Chapter } from "../types";

export const schleifen: Chapter = {
  id: "schleifen",
  number: 4,
  title: "For-Schleifen",
  summary: "Dasselbe wieder und wieder tun lassen – ohne es wieder und wieder zu tippen.",
  icon: "🔁",
  track: "basics",
  lessons: [
    {
      id: "schleifen/einfuehrung",
      title: "Die erste Schleife",
      summary: "Für jedes Zeichen in einem Text etwas tun.",
      steps: [
        {
          id: "erste-for-schleife",
          kind: "run",
          surface: "editor",
          program: `name = 'Welt'
for zeichen in name: print(zeichen)`,
          text: `
Gute Nachricht: Die trockenen Grundlagen hast du hinter dir. Ab jetzt schreiben wir Programme, die wirklich etwas können.

Eines der mächtigsten Konzepte beim Programmieren ist die **Schleife** (englisch *loop*). Damit lässt du denselben Code wieder und wieder laufen. Python kennt zwei Arten: \`for\`-Schleifen und \`while\`-Schleifen. Hier ist eine \`for\`-Schleife – führ das Programm aus:

    name = 'Welt'
    for zeichen in name: print(zeichen)
`,
          task: "Führ das Programm im Editor aus.",
        },
      ],
      outro: `
Du kannst den Code fast wie einen deutschen Satz lesen:

> **Für jedes** \`zeichen\` **in** \`name\`: gib dieses Zeichen aus.

Jedes Zeichen ist dabei ein ganz normaler String. Und \`zeichen\` ist eine ganz normale Variable, die vor jedem Durchlauf einen neuen Wert bekommt. Der Code oben macht also genau dasselbe wie:

    name = 'Welt'

    zeichen = 'W'
    print(zeichen)

    zeichen = 'e'
    print(zeichen)

    zeichen = 'l'
    print(zeichen)

    zeichen = 't'
    print(zeichen)

Der Name \`zeichen\` ist frei gewählt – du könntest die Variable auch \`x\` nennen. \`zeichen\` macht es nur verständlicher.

Eine \`for\`-Schleife hat immer diesen Aufbau:

    for <variable> in <sammlung>: <code, der wiederholt wird>

Die Wörter \`for\` und \`in\` sowie der Doppelpunkt \`:\` sind Pflicht.
`,
    },
    {
      id: "schleifen/einrueckung",
      title: "Einrückung",
      summary: "Leerzeichen am Zeilenanfang sind in Python keine Kosmetik, sondern Bedeutung.",
      steps: [
        {
          id: "fehlende-einrueckung",
          kind: "run",
          expectsError: true,
          surface: "editor",
          program: `for zeichen in name:
print(zeichen)`,
          text: `
Die Schleife von eben:

    for zeichen in name: print(zeichen)

funktioniert zwar, wird aber normalerweise so geschrieben:

    for zeichen in name:
        print(zeichen)

Der zu wiederholende Code – der **Schleifenrumpf** – beginnt also in einer neuen Zeile nach dem Doppelpunkt. Und er muss **eingerückt** sein, also ein paar Leerzeichen davor haben.

Der Code unten ist ohne Einrückung. Führ ihn aus und sieh dir die Fehlermeldung an:

    for zeichen in name:
    print(zeichen)
`,
          task: "Führ den (fehlerhaften) Code aus und lies die Fehlermeldung.",
        },
        {
          id: "zwei-eingerueckte-zeilen",
          kind: "run",
          surface: "editor",
          program: `name = 'Welt'

for zeichen in name:
    print(zeichen)
    print('---')`,
          text: `
Die Leerzeichen sagen Python, welche Zeilen zum Rumpf der Schleife gehören. Das wird wichtig, sobald die Schleife mehrere Zeilen umfasst – und das tut sie oft. Führ zum Beispiel diesen Code aus:

    name = 'Welt'

    for zeichen in name:
        print(zeichen)
        print('---')
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "eine-eingerueckte-zeile",
          kind: "run",
          surface: "editor",
          program: `name = 'Welt'

for zeichen in name:
    print(zeichen)
print('---')`,
          text: `
Es waren zwei eingerückte Zeilen, also gehören beide zum Rumpf – deshalb kam \`---\` nach jedem Zeichen.

Führ jetzt denselben Code aus, aber **ohne** Einrückung in der letzten Zeile:

    name = 'Welt'

    for zeichen in name:
        print(zeichen)
    print('---')
`,
          task: "Führ die Variante ohne Einrückung in der letzten Zeile aus.",
        },
        {
          id: "uneinheitliche-einrueckung",
          kind: "run",
          expectsError: true,
          surface: "editor",
          program: `for zeichen in name:
    print(zeichen)
  print('---')`,
          text: `
Weil \`print('---')\` nicht eingerückt ist, gehört es nicht mehr zum Schleifenrumpf. Es läuft deshalb nur **ein einziges Mal**, nachdem die ganze Schleife durch ist. Beide Programme sind korrekt – sie tun nur etwas anderes.

Das Programm unten ist dagegen ungültig: Beide Zeilen im Rumpf sind eingerückt, aber unterschiedlich weit. Die erste mit 4 Leerzeichen, die zweite mit 2. Probier es aus:

    for zeichen in name:
        print(zeichen)
      print('---')
`,
          task: "Führ den Code aus und schau, was Python dazu sagt.",
        },
      ],
      outro: `
Rück immer um **4 Leerzeichen** ein. Technisch wäre jede einheitliche Einrückung erlaubt, aber 4 Leerzeichen sind die Konvention, an die sich praktisch alle halten.

Der Editor hilft dir dabei: Drückst du die Tab-Taste, fügt er die 4 Leerzeichen für dich ein.
`,
    },
    {
      id: "schleifen/erste-uebungen",
      title: "Erste Schleifen-Übungen",
      summary: "Zwei kleine Aufgaben, die du komplett selbst löst.",
      steps: [
        {
          id: "uebung-praefix",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          starter: `name = 'Welt'

for zeichen in name:
    print(zeichen)
    print('---')`,
          tests: [
            { args: ["Welt"], expected: "---W\n---e\n---l\n---t\n" },
            { args: ["Bob"], expected: "---B\n---o\n---b\n" },
          ],
          solution: `for zeichen in name:
    print('---' + zeichen)`,
          hints: [
            "Du brauchst nur **ein** `print`, denn jedes `print` schreibt in eine neue Zeile.",
            "Du musst zwei Strings zusammensetzen. Womit ging das nochmal?",
            "Mit `+`: `print('---' + zeichen)`",
          ],
          text: `
Zeit für Übungen! Ändere dieses Programm:

    name = 'Welt'

    for zeichen in name:
        print(zeichen)
        print('---')

so ab, dass stattdessen das hier herauskommt:

    ---W
    ---e
    ---l
    ---t

Die erste Zeile (\`name = ...\`) darfst du stehen lassen – geprüft wird nur, was dein Programm mit verschiedenen Namen macht.
`,
          task: "Setze die Striche vor jedes Zeichen statt darunter.",
        },
        {
          id: "uebung-name-wiederholen",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "Welt\nWelt\nWelt\nWelt\n" },
            { args: ["Bob"], expected: "Bob\nBob\nBob\n" },
          ],
          solution: `for _ in name:
    print(name)`,
          hints: [
            "Vergiss die Schleife kurz: Wie würdest du `name` einfach dreimal ausgeben?",
            "Die Lösung sieht den bisherigen Programmen sehr ähnlich.",
            "Die Schleife legt zwar eine Variable an (z. B. `zeichen`), aber dein Programm muss sie gar nicht benutzen.",
          ],
          text: `
Klasse! Jetzt schreib ein Programm, das \`name\` **einmal pro Zeichen** in \`name\` ausgibt.

Für \`name = 'Amy'\` also:

    Amy
    Amy
    Amy

Und für \`name = 'Welt'\`:

    Welt
    Welt
    Welt
    Welt

Du kannst \`name\` in der ersten Zeile auf irgendetwas setzen – geprüft wird nur der Rest.
`,
          task: "Gib `name` so oft aus, wie er Zeichen hat.",
        },
      ],
      outro: `
Richtig gut! Du löst Aufgaben und schreibst eigenen Code. Machen wir es interessanter.
`,
    },
    {
      id: "schleifen/strings-aufbauen",
      title: "Strings Stück für Stück aufbauen",
      summary: "Das Muster, das dir ab jetzt überall begegnet: leer anfangen, dann anhängen.",
      steps: [
        {
          id: "plus-gleich-vorschau",
          kind: "run",
          surface: "editor",
          program: `hallo = 'Hallo'
print(hallo)
hallo = hallo + '!'
print(hallo)`,
          prediction: {
            choices: ["Hallo\nHallo", "Hallo\nHallo!", "Hallo!\nHallo!"],
            correctIndex: 1,
          },
          text: `
Bevor wir weitere Schleifen anschauen, brauchen wir noch ein Konzept. Sieh dir dieses Programm an:

    hallo = 'Hallo'
    print(hallo)
    hallo = hallo + '!'
    print(hallo)

Was macht wohl die Zeile \`hallo = hallo + '!'\`? Rate erst, dann führ es aus.
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "dreieck",
          kind: "run",
          surface: "editor",
          program: `name = 'Welt'
zeile = '-'
for zeichen in name:
    zeile = zeile + zeichen
    print(zeile)`,
          prediction: {
            choices: [
              "-\nW\n-\ne\n-\nl\n-\nt",
              "-W\n-e\n-l\n-t",
              "-Welt",
              "-W\n-We\n-Wel\n-Welt",
              "-Welt\n-Wel\n-We\n-W",
              "-Welt\n-Welt\n-Welt\n-Welt",
            ],
            correctIndex: 3,
          },
          text: `
Python stört es nicht, dass \`hallo\` links **und** rechts vom \`=\` steht. Es macht einfach, was es immer macht: Zuerst wird die rechte Seite ausgerechnet – \`hallo + '!'\` ist zu diesem Zeitpunkt \`'Hallo' + '!'\`, also \`'Hallo!'\`. Und *dieses* Ergebnis wird der neue Wert von \`hallo\`.

Falls es hilft, denk dir die Zeile in zwei Schritte zerlegt:

    zwischenwert = hallo + '!'
    hallo = zwischenwert

In einer Schleife ist das ausgesprochen nützlich. Probier dieses Programm:

    name = 'Welt'
    zeile = '-'
    for zeichen in name:
        zeile = zeile + zeichen
        print(zeile)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "dreieck-vertauscht",
          kind: "run",
          surface: "editor",
          program: `name = 'Welt'
zeile = '-'
for zeichen in name:
    print(zeile)
    zeile = zeile + zeichen`,
          prediction: {
            choices: ["-W\n-We\n-Wel\n-Welt", "-We\n-Wel\n-Welt", "-\n-W\n-We\n-Wel"],
            correctIndex: 2,
          },
          text: `
Nimm dir Zeit, dieses Programm wirklich zu verstehen. Es passiert Folgendes:

    zeile = '-'

    zeichen = 'W'
    zeile = zeile + zeichen
          = '-'   + 'W'
          = '-W'
    print('-W')

    zeichen = 'e'
    zeile = zeile + zeichen
          = '-W'  + 'e'
          = '-We'
    print('-We')

    ...

Die Details sind wichtig. Was passiert, wenn du die letzten beiden Zeilen **vertauschst**?

    name = 'Welt'
    zeile = '-'
    for zeichen in name:
        print(zeile)
        zeile = zeile + zeichen
`,
          task: "Führ die vertauschte Variante aus.",
        },
        {
          id: "leerer-string",
          kind: "run",
          surface: "shell",
          program: "'' + '' + ''",
          prediction: {
            choices: ["''", "' '", "'  '", "'   '", "'' + '' + ''", "eine Fehlermeldung"],
            correctIndex: 0,
          },
          text: `
Das letzte Zeichen von \`name\` wird erst **am Ende** des Durchlaufs an \`zeile\` gehängt – da hat \`print(zeile)\` schon zum letzten Mal gearbeitet. Deshalb tauchen dieses Zeichen und der vollständige Name unten nie auf.

Falls dich das verwirrt: Setz einfach mal \`print(zeile)\` sowohl **vor** als auch **nach** \`zeile = zeile + zeichen\`.

Kommen wir zu den störenden \`-\` in der Ausgabe. Vielleicht ahnst du schon, wie wir sie loswerden.

Ein **leerer String** ist ein String, der überhaupt kein Zeichen enthält. Man schreibt ihn als zwei Anführungszeichen ohne etwas dazwischen: \`''\`. Er ist so etwas wie die Null unter den Strings: Hängst du ihn an einen anderen String, ändert sich nichts – genau wie \`0 + 5\` einfach \`5\` ergibt.

Probier das in der Shell:

    '' + '' + ''
`,
          task: "Führe `'' + '' + ''` in der Shell aus.",
        },
        {
          id: "dreieck-sauber",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "W\nWe\nWel\nWelt\n" },
            { args: ["Bob"], expected: "B\nBo\nBob\n" },
          ],
          solution: `zeile = ''
for zeichen in name:
    zeile = zeile + zeichen
    print(zeile)`,
          hints: [
            "Achte darauf, dass du von der **funktionierenden** Version ausgehst: `zeile = zeile + zeichen` muss **vor** `print(zeile)` stehen.",
            "Ansonsten brauchst du nur eine ***winzige*** Änderung.",
            "Wir wollen das `-` loswerden. Also mach genau das – wörtlich.",
            "Nimm den leeren String: `zeile = ''`",
          ],
          text: `
Verwechsle den leeren String nicht mit \`' '\` – das ist ein String mit **einem** Zeichen, nämlich einem Leerzeichen.

Repariere jetzt das Dreiecks-Programm so, dass die Striche verschwinden. Für \`name = 'Welt'\` soll herauskommen:

    W
    We
    Wel
    Welt
`,
          task: "Baue das Dreieck ohne die Striche.",
        },
      ],
      outro: `
Sieht doch schön aus, oder?

Das Muster – **leer anfangen und in einer \`for\`-Schleife Stück für Stück aufbauen** – ist extrem verbreitet, und du wirst es noch oft brauchen. Typische leere Startwerte sind \`''\`, \`0\` und \`[]\` (eine leere Liste, die kommt bald).
`,
    },
    {
      id: "schleifen/uebungen",
      title: "Übungen: Muster zeichnen",
      summary: "Vier Aufgaben vom Dreieck bis zum Namens-Kasten.",
      steps: [
        {
          id: "dreieck-mit-abstand",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "W\nW e\nW e l\nW e l t\n" },
            { args: ["Bob"], expected: "B\nB o\nB o b\n" },
          ],
          solution: `zeile = ''
for zeichen in name:
    zeile = zeile + zeichen + ' '
    print(zeile)`,
          hints: [
            "Du brauchst ein weiteres `+`.",
            "Und einen String, der nur aus einem Leerzeichen besteht: `' '`",
          ],
          text: `
Ändere dieses Programm:

    name = 'Welt'
    zeile = ''
    for zeichen in name:
        zeile = zeile + zeichen
        print(zeile)

so ab, dass nach jedem Zeichen ein Leerzeichen steht:

    W
    W e
    W e l
    W e l t

(Am Zeilenende darf ruhig ein Leerzeichen stehen – das fällt nicht auf.)
`,
          task: "Setze ein Leerzeichen zwischen die Zeichen.",
        },
        {
          id: "dreieck-rueckwaerts",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "W\neW\nleW\ntleW\n" },
            { args: ["Amy"], expected: "A\nmA\nymA\n" },
          ],
          solution: `zeile = ''
for zeichen in name:
    zeile = zeichen + zeile
    print(zeile)`,
          hints: [
            "Die Lösung ist dem Original-Dreieck sehr ähnlich – eine kleine Änderung genügt.",
            "Du hängst weiterhin ein Zeichen an `zeile`. Die Frage ist nur: **wo**?",
            "Die Zeilen sollen umgedreht sein – also musst du irgendwo die Reihenfolge umdrehen.",
            "Setz das Zeichen **vor** den String statt dahinter: `zeile = zeichen + zeile`",
          ],
          text: `
Großartig! Jetzt bau das Programm so um, dass jede Zeile rückwärts läuft:

    W
    eW
    leW
    tleW

Kleiner Denkanstoß: \`3 + 7\` ist dasselbe wie \`7 + 3\`. Gilt das bei Strings auch?
`,
          task: "Dreh die Reihenfolge in jeder Zeile um.",
        },
        {
          id: "unterstrichen",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "Welt\n----\n" },
            { args: ["Bob"], expected: "Bob\n---\n" },
          ],
          solution: `zeile = ''
for _ in name:
    zeile += '-'
print(name)
print(zeile)`,
          hints: [
            "Schau dir das Dreiecks-Programm zur Inspiration an.",
            "Und das Programm, das `name` einmal pro Zeichen ausgegeben hat.",
            "Du musst einen String aus Bindestrichen aufbauen – ein Zeichen pro Durchlauf.",
            "Die Schleifenvariable brauchst du dabei gar nicht. Nenn sie einfach `_`.",
            "Erst die Schleife komplett durchlaufen lassen, **dann** beide `print` außerhalb der Schleife.",
          ],
          text: `
Sehr gut!

Code wie

    zeile = zeile + zeichen

ist so häufig, dass Python eine Kurzschreibweise dafür anbietet. Das hier bedeutet genau dasselbe:

    zeile += zeichen

(Für \`zeile = zeichen + zeile\` gibt es keine solche Abkürzung.)

Schreib jetzt mit \`+=\` und einer \`for\`-Schleife ein Programm, das \`name\` "unterstreicht":

    Welt
    ----

Für jedes Zeichen in \`name\` soll genau ein \`-\` erscheinen.
`,
          task: "Unterstreiche den Namen mit passend vielen Strichen.",
        },
        {
          id: "kasten",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "+----+\n|Welt|\n+----+\n" },
            { args: ["Bob"], expected: "+---+\n|Bob|\n+---+\n" },
          ],
          solution: `zeile = ''
for _ in name:
    zeile += '-'
zeile = '+' + zeile + '+'
print(zeile)
print('|' + name + '|')
print(zeile)`,
          hints: [
            "Fang mit deiner Lösung von eben an – die Strichzeile hast du schon.",
            "Setz vor und hinter die Strichzeile jeweils ein `+`.",
            "Die mittlere Zeile ist `'|' + name + '|'`.",
            "Die Strichzeile brauchst du zweimal: einmal oben, einmal unten.",
          ],
          text: `
Fantastisch!

Übrigens: Wenn du eine Variable gar nicht brauchst, nennt man sie üblicherweise \`_\` (Unterstrich), also \`for _ in name:\`. Am Ablauf ändert das nichts, aber wer den Code liest, weiß sofort Bescheid.

Machen wir es hübscher. Erweitere dein Programm so, dass es einen Kasten um den Namen zeichnet:

    +----+
    |Welt|
    +----+
`,
          task: "Zeichne einen Kasten um den Namen.",
        },
        {
          id: "namens-kasten",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            {
              args: ["Welt"],
              expected: "+Welt+\nW    W\ne    e\nl    l\nt    t\n+Welt+\n",
            },
            { args: ["Bob"], expected: "+Bob+\nB   B\no   o\nb   b\n+Bob+\n" },
          ],
          solution: `zeile = '+' + name + '+'
leerraum = ''
for _ in name:
    leerraum += ' '

print(zeile)
for zeichen in name:
    print(zeichen + leerraum + zeichen)
print(zeile)`,
          hints: [
            "Du brauchst **zwei** getrennte Schleifen über `name`.",
            "Alle Zeilen außer der ersten und letzten haben in der Mitte dasselbe – das kannst du wiederverwenden.",
            "Bau dir zuerst eine Variable, die nur aus Leerzeichen besteht.",
            "Erste Schleife: Leerzeichen aufbauen. Zweite Schleife: Zeilen ausgeben.",
          ],
          text: `
Du wirst richtig gut darin! Dann brauchst du wohl eine echte Herausforderung.

Wie wäre es, wenn der Name nicht *in* einem Kasten steht, sondern selbst *der Kasten* ist? Schreib ein Programm, das das hier ausgibt:

    +Welt+
    W    W
    e    e
    l    l
    t    t
    +Welt+
`,
          task: "Lass den Namen selbst den Kasten bilden.",
        },
        {
          id: "diagonale",
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["Welt"], expected: "W\n e\n  l\n   t\n" },
            { args: ["Bob"], expected: "B\n o\n  b\n" },
          ],
          solution: `leerraum = ''
for zeichen in name:
    print(leerraum + zeichen)
    leerraum += ' '`,
          hints: [
            "Vor dem ersten Buchstaben stehen 0 Leerzeichen, vor dem zweiten 1, vor dem dritten 2 …",
            "Sammle die Leerzeichen wie gehabt in einer Variablen.",
            "Der Unterschied: Du musst Buchstaben ausgeben, **während** du die Leerzeichen aufbaust.",
            "Also eine einzige Schleife, die beides macht.",
            "Weil vor dem ersten Buchstaben noch nichts steht, kommt das Anhängen **nach** dem `print`.",
          ],
          text: `
Stark, du hast den Dreh raus!

Zum Abschluss eine Bonusaufgabe. Schreib ein Programm, das \`name\` diagonal ausgibt:

    W
     e
      l
       t
`,
          task: "Gib den Namen diagonal aus.",
        },
      ],
      outro: `
Wow, dich hält nichts mehr auf!
`,
    },
    {
      id: "schleifen/fachbegriffe",
      title: "Ein paar Fachbegriffe",
      summary: "Ausdruck, Anweisung, Auswertung, Iteration – kurz erklärt.",
      steps: [
        {
          id: "begriffe",
          kind: "read",
          text: `
Ein paar Wörter, die du kennen solltest – sie tauchen in jeder Fehlermeldung und jedem Tutorial auf.

### Ausdruck (*expression*)

Ein **Ausdruck** ist ein Stück Code, das einen Wert **hat**. In dieser Zeile:

    satz = 'Hallo ' + name

stecken drei Ausdrücke:

1. \`'Hallo '\`
2. \`name\`
3. \`'Hallo ' + name\`

### Anweisung (*statement*)

Die vollständige Zeile \`satz = ...\` ist dagegen eine **Anweisung**. Sie befiehlt dem Computer, etwas zu tun, hat aber selbst keinen Wert. Deshalb kann man Anweisungen auch nicht addieren – dieser Code ist ungültig:

    (wort = 'Hallo') + (name = 'Bob')

Eine Anweisung, die einer Variablen einen Wert gibt, heißt **Zuweisung** (*assignment*).

Ein Programm ist eine Liste von Anweisungen, die der Reihe nach ausgeführt werden. Eine \`for\`-Schleife ist eine **zusammengesetzte Anweisung**: Sie hat einen eigenen Rumpf mit weiteren Anweisungen darin. Anweisungen enthalten meistens Ausdrücke, und Ausdrücke können kleinere Ausdrücke enthalten – aber Ausdrücke enthalten nie Anweisungen.

### Auswertung (*evaluation*)

Der Vorgang, den Wert eines Ausdrucks zu berechnen, heißt **Auswertung**. Der Computer *wertet* \`1 + 2\` *aus* und erhält den Wert \`3\`.

### Iteration

Das Durchlaufen einer Schleife heißt **Iteration**. Code wie \`for zeichen in 'Hallo':\` *iteriert über* den String \`'Hallo'\`. Dass das geht, bedeutet: Strings sind **iterierbar**. Zahlen sind das nicht – genau das sagt dir Python auch, wenn du \`for zeichen in 3:\` versuchst. Jeder Durchlauf ist **eine Iteration**; im Beispiel gibt es also 5 davon.
`,
        },
      ],
      outro: `
Diese Begriffe musst du nicht auswendig lernen. Aber wenn sie dir das nächste Mal begegnen, weißt du, wovon die Rede ist.
`,
    },
  ],
};
