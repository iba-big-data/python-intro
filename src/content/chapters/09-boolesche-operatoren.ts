import type { Chapter } from "../types";

export const boolescheOperatoren: Chapter = {
  id: "boolesche-operatoren",
  number: 9,
  title: "Bedingungen verknüpfen",
  summary: "`and`, `or` und `not` – mehrere Bedingungen zu einer zusammenfassen.",
  icon: "🔀",
  track: "basics",
  lessons: [
    /* ================================================================== *
     *  1 – or
     * ================================================================== */
    {
      id: "boolesche-operatoren/oder",
      title: "`or` – eines von beiden",
      summary: "Zwei Bedingungen so verbinden, dass eine davon reicht.",
      steps: [
        {
          id: "freunde-mit-elif",
          kind: "run",
          surface: "editor",
          program: `def ist_befreundet(name):
    if name == "Alice":
        return True
    elif name == "Bob":
        return True
    else:
        return False

assert_equal(ist_befreundet("Alice"), True)
assert_equal(ist_befreundet("Bob"), True)
assert_equal(ist_befreundet("Charlie"), False)`,
          text: `
Booleans (\`True\` und \`False\`) kennst du aus dem Kapitel über \`if\`-Anweisungen, ebenso die Vergleichsoperatoren \`==\`, \`<\`, \`>\`, \`<=\`, \`>=\`, die Booleans liefern.

Jetzt geht es darum, Booleans zu **kombinieren**, um komplexere Bedingungen zu prüfen.

Ein Beispiel: Du hast zwei Freunde, Alice und Bob. Die Funktion unten bekommt einen Namen und prüft, ob die Person zu deinen Freunden gehört.

    def ist_befreundet(name):
        if name == "Alice":
            return True
        elif name == "Bob":
            return True
        else:
            return False

    assert_equal(ist_befreundet("Alice"), True)
    assert_equal(ist_befreundet("Bob"), True)
    assert_equal(ist_befreundet("Charlie"), False)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "true-or-true",
          kind: "run",
          surface: "shell",
          program: `True or True`,
          prediction: { choices: ["True", "False"], correctIndex: 0 },
          text: `
Das funktioniert – aber es geht deutlich eleganter. Wir können \`if\` und \`elif\` mit **\`or\`** zusammenfassen.

\`or\` ist ein **boolescher Operator**: ein Operator wie \`+\` oder \`-\`, der zwei Booleans verknüpft.

Der Ausdruck \`A or B\` ist \`True\`, wenn \`A\` **oder** \`B\` \`True\` ist – oder beide. \`False\` ist er nur, wenn beide \`False\` sind.

Probier es in der Shell:

    True or True
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "true-or-false",
          kind: "run",
          surface: "shell",
          program: `True or False`,
          prediction: { choices: ["True", "False"], correctIndex: 0 },
          text: `
Gut. Und jetzt:

    True or False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "false-or-false",
          kind: "run",
          surface: "shell",
          program: `False or False`,
          prediction: { choices: ["True", "False"], correctIndex: 1 },
          text: `
Und zum Schluss:

    False or False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "mit-or-verbessern",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def ist_befreundet(name):
    if name == "Alice" or name == "Bob":
        return True
    else:
        return False

assert_equal(ist_befreundet("Alice"), True)
assert_equal(ist_befreundet("Bob"), True)
assert_equal(ist_befreundet("Charlie"), False)`,
          text: `
Jetzt bau die Funktion um. Ersetz

    if name == "Alice":
        return True
    elif name == "Bob":
        return True

durch

    if name == "Alice" or name == "Bob":
        return True

\`ist_befreundet\` gibt jetzt genau dann \`True\` zurück, wenn \`name\` entweder Alice oder Bob ist. Das \`or\` steht dabei **zwischen den beiden Booleans** \`name == "Alice"\` und \`name == "Bob"\`.
`,
          task: "Fasse `if` und `elif` mit `or` zusammen.",
        },
        {
          id: "noch-kuerzer",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def ist_befreundet(name):
    return name == "Alice" or name == "Bob"

assert_equal(ist_befreundet("Alice"), True)
assert_equal(ist_befreundet("Bob"), True)
assert_equal(ist_befreundet("Charlie"), False)`,
          text: `
Es geht noch besser. Schau genau hin:

    name == "Alice" or name == "Bob"

ist selbst schon ein Boolean. Und beide \`return\`-Zweige geben Booleans zurück. Die Funktion

- gibt \`True\` zurück, wenn der Ausdruck \`True\` ist, und
- gibt \`False\` zurück, wenn der Ausdruck \`False\` ist.

Wir können also einfach **den Ausdruck selbst** zurückgeben!

Das ist ein Muster, das du dir merken solltest. Wann immer du Code wie diesen schreibst:

    if x:
        return True
    else:
        return False

wobei \`x\` bereits ein Boolean ist, kannst du ihn immer zu

    return x

vereinfachen. Wende das jetzt auf \`ist_befreundet\` an.
`,
          task: "Vereinfache die Funktion zu einer einzigen `return`-Zeile.",
        },
        {
          id: "haeufiger-fehler",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def ist_befreundet(name):
    return name == "Alice" or "Bob"

assert_equal(ist_befreundet("Alice"), True)
assert_equal(ist_befreundet("Bob"), True)
assert_equal(ist_befreundet("Charlie"), False)`,
          text: `
Achte jetzt sehr genau darauf, wie die Bedingung geschrieben ist:

    return name == "Alice" or name == "Bob"

Ein häufiger Fehler ist, stattdessen das hier zu schreiben:

    return name == "Alice" or "Bob"

Auf Deutsch gelesen klingt das völlig richtig:

> Gib zurück, ob \`name\` gleich \`"Alice"\` oder \`"Bob"\` ist.

Aber Python ist kein Deutsch. Ersetz die \`return\`-Zeile durch die falsche Variante und führ das Programm aus.
`,
          task: "Führ die fehlerhafte Variante aus und sieh dir an, was die Tests melden.",
        },
        {
          id: "uebung-prozent",
          kind: "exercise",
          mode: "return",
          functionName: "ist_gueltiger_prozentwert",
          params: ["x"],
          tests: [
            { args: [-1], expected: false },
            { args: [0], expected: true },
            { args: [50], expected: true },
            { args: [100], expected: true },
            { args: [101], expected: false },
          ],
          solution: `def ist_gueltiger_prozentwert(x):
    if x < 0 or x > 100:
        return False
    else:
        return True`,
          // `and` löst die Aufgabe ebenso elegant (`0 <= x and x <= 100`) und
          // wurde bisher als richtig gewertet – obwohl es erst im nächsten
          // Kapitel drankommt und dieselbe Aufgabe dort noch einmal mit `and`
          // gestellt wird. Hier soll `or` geübt werden.
          disallowedAst: {
            nodes: ["And"],
            message:
              "Mit `and` geht das auch – das kommt aber erst im nächsten Kapitel dran. Versuch es hier mit `or`.",
          },
          hints: [
            "Mit den Vergleichsoperatoren `<`, `>`, `<=`, `>=`, `==` erzeugst du Booleans.",
            "Du musst `x` mit 0 und mit 100 vergleichen.",
            "Und die beiden Vergleiche mit `or` zu einem Boolean verbinden.",
            "Achtung: Der Trick von eben (`return <vergleich> or <vergleich>`) klappt hier **nicht** direkt!",
            "Denn `x < 0 or x > 100` ist `True`, wenn der Wert **un**gültig ist – also genau andersherum.",
            "Du brauchst also doch ein `if` mit `return False` und `return True` – nur eben vertauscht.",
          ],
          text: `
Interessant, oder? Der dritte Test schlägt fehl, und der zweite gibt \`'Bob'\` zurück statt \`True\`.

Der Grund: Python liest

    name == "Alice" or "Bob"

nicht als

    name == ("Alice" or "Bob")

sondern als

    (name == "Alice") or ("Bob")

Wenn \`name == "Alice"\` also \`False\` ist, wird der ganze Ausdruck zu \`"Bob"\` – und ein nicht leerer String gilt in Python als „wahr“.

**Die Regel, die du dir merken musst:** Setz immer auf **beide** Seiten von \`or\` einen echten Boolean. \`name == "Alice" or "Bob"\` verletzt diese Regel.

Zeit für eine Übung. Schreib eine Funktion \`ist_gueltiger_prozentwert\`, die prüft, ob eine Zahl ein gültiger Prozentwert ist – also zwischen 0 und 100 liegt (beides einschließlich).

    assert_equal(ist_gueltiger_prozentwert(-1), False)
    assert_equal(ist_gueltiger_prozentwert(0), True)
    assert_equal(ist_gueltiger_prozentwert(50), True)
    assert_equal(ist_gueltiger_prozentwert(100), True)
    assert_equal(ist_gueltiger_prozentwert(101), False)
`,
          task: "Schreib `ist_gueltiger_prozentwert(x)` mit `or`.",
        },
      ],
      outro: `
Gut gemacht!

\`or\` in der Übersicht:

| Ausdruck | Ergebnis |
| --- | --- |
| \`True or True\` | \`True\` |
| \`True or False\` | \`True\` |
| \`False or True\` | \`True\` |
| \`False or False\` | \`False\` |

Kurz: **\`or\` ist nur dann \`False\`, wenn beide Seiten \`False\` sind.**
`,
    },

    /* ================================================================== *
     *  2 – and
     * ================================================================== */
    {
      id: "boolesche-operatoren/und",
      title: "`and` – beides zugleich",
      summary: "Bedingungen verbinden, die alle erfüllt sein müssen.",
      steps: [
        {
          id: "true-and-true",
          kind: "run",
          surface: "shell",
          program: `True and True`,
          prediction: { choices: ["True", "False"], correctIndex: 0 },
          text: `
Der zweite boolesche Operator ist \`and\`. Der Ausdruck \`A and B\` ist nur dann \`True\`, wenn **beide** \`True\` sind. Sonst ist er \`False\`.

Probier es in der Shell:

    True and True
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "true-and-false",
          kind: "run",
          surface: "shell",
          program: `True and False`,
          prediction: { choices: ["True", "False"], correctIndex: 1 },
          text: `
Und was erwartest du hier?

    True and False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "false-and-false",
          kind: "run",
          surface: "shell",
          program: `False and False`,
          prediction: { choices: ["True", "False"], correctIndex: 1 },
          text: `
Zum Schluss:

    False and False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "uebung-prozent-mit-and",
          kind: "exercise",
          mode: "return",
          functionName: "ist_gueltiger_prozentwert",
          params: ["x"],
          tests: [
            { args: [-1], expected: false },
            { args: [0], expected: true },
            { args: [50], expected: true },
            { args: [100], expected: true },
            { args: [101], expected: false },
          ],
          solution: `def ist_gueltiger_prozentwert(x):
    if 0 <= x and x <= 100:
        return True
    else:
        return False`,
          hints: [
            "Wenn bei dir `x < 0 and x > 100` steht, bist du auf dem Holzweg – das ist für **jede** Zahl `False`!",
            "Die Lösung mit `and` unterscheidet sich in mehreren Punkten von der mit `or`.",
            "Die `or`-Lösung prüft zuerst auf **un**gültig. Mit `and` machst du es genau andersherum: Du prüfst direkt auf gültig.",
            "Entsprechend musst du auch `return True` und `return False` vertauschen.",
            "Und du musst die Vergleiche umdrehen: `0 <= x and x <= 100`.",
          ],
          text: `
Üben wir. Eben hast du \`ist_gueltiger_prozentwert\` mit \`or\` geschrieben. Hier eine mögliche Lösung:

    def ist_gueltiger_prozentwert(x):
        if x < 0 or x > 100:
            return False
        else:
            return True

Schreib diese Funktion jetzt mit **\`and\`** statt \`or\`.
`,
          task: "Schreib `ist_gueltiger_prozentwert(x)` neu – diesmal mit `and`.",
        },
        {
          id: "uebung-alle-gleich",
          kind: "exercise",
          mode: "return",
          functionName: "alle_gleich",
          params: ["reihe"],
          tests: [
            { args: [["O", "O", "O"]], expected: true },
            { args: [["X", "X", "X"]], expected: true },
            { args: [["O", "X", "O"]], expected: false },
            { args: [["O", "O", "X"]], expected: false },
            { args: [["X", "O", "O"]], expected: false },
          ],
          solution: `def alle_gleich(reihe):
    return reihe[0] == reihe[1] and reihe[0] == reihe[2]`,
          hints: [
            "Die Liste hat immer genau 3 Elemente.",
            "Du brauchst also keine Schleife.",
            "An das erste Element kommst du mit `reihe[0]`.",
            "Erstes, zweites und drittes Element müssen alle gleich sein.",
            "Das heißt: Das erste muss gleich dem zweiten sein **und** gleich dem dritten.",
          ],
          text: `
Ausgezeichnet! Eine mögliche Lösung ist:

    def ist_gueltiger_prozentwert(x):
        if 0 <= x and x <= 100:
            return True
        else:
            return False

Die kennst du inzwischen vereinfachen:

    def ist_gueltiger_prozentwert(x):
        return 0 <= x and x <= 100

Und es geht noch kürzer – mit **Vergleichsketten**. Jede Bedingung der Form

    a < b and b < c

lässt sich verkürzen, indem man das \`and b\` weglässt:

    a < b < c

Das funktioniert mit allen Vergleichsoperatoren, auch mit \`==\`, und die beiden dürfen sogar verschieden sein. Die Lösung wird damit zu:

    def ist_gueltiger_prozentwert(x):
        return 0 <= x <= 100

Nächste Übung – ein erster Baustein für Tic-Tac-Toe. Gegeben ist eine Liste \`reihe\` mit genau drei Einträgen. Schreib \`alle_gleich\`, das prüft, ob alle drei gleich sind:

    assert_equal(alle_gleich(["X", "X", "X"]), True)
    assert_equal(alle_gleich(["O", "O", "O"]), True)
    assert_equal(alle_gleich(["X", "O", "X"]), False)
`,
          task: "Schreib `alle_gleich(reihe)` für genau drei Einträge.",
        },
      ],
      outro: `
Gut gemacht. Hier sind mehrere richtige Lösungen möglich:

    def alle_gleich(reihe):
        return reihe[0] == reihe[1] and reihe[0] == reihe[2]

oder wieder mit Vergleichskette:

    return reihe[0] == reihe[1] == reihe[2]

oder mit dem Trick, gegen eine Liste aus drei gleichen Einträgen zu vergleichen:

    return reihe == [reihe[0], reihe[0], reihe[0]]

\`and\` in der Übersicht:

| Ausdruck | Ergebnis |
| --- | --- |
| \`True and True\` | \`True\` |
| \`True and False\` | \`False\` |
| \`False and True\` | \`False\` |
| \`False and False\` | \`False\` |

Kurz: **\`and\` ist nur dann \`True\`, wenn beide Seiten \`True\` sind.**
`,
    },

    /* ================================================================== *
     *  3 – Mehrzeilige Ausdrücke
     * ================================================================== */
    {
      id: "boolesche-operatoren/mehrzeilig",
      title: "Lange Zeilen umbrechen",
      summary: "Eine Anweisung sauber über mehrere Zeilen verteilen.",
      steps: [
        {
          id: "kaputter-umbruch",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `name = "Bob"

ist_befreundet = name == "Alice" or
                 name == "Bob"`,
          text: `
Unsere Zeilen werden allmählich lang. Python bietet mehrere Wege, eine Anweisung über mehrere Zeilen zu verteilen – aber das passiert nicht automatisch. Du musst Python deutlich machen, dass die Zeile noch weitergeht.

Dieser Code ist zum Beispiel ungültig:

    name = "Bob"

    ist_befreundet = name == "Alice" or
                     name == "Bob"
`,
          task: "Führ den Code aus und lies die Fehlermeldung.",
        },
        {
          id: "gueltige-umbrueche",
          kind: "run",
          surface: "editor",
          program: `name = "Bob"

ist_befreundet = name == "Alice" or \\
                 name == "Bob"
print(ist_befreundet)

ist_befreundet = (name == "Alice" or
                  name == "Bob")
print(ist_befreundet)

print(name == "Alice" or
      name == "Bob")`,
          text: `
Python versucht, das als zwei getrennte Zeilen zu lesen, und kommt durcheinander. Du musst ihm sagen, dass die erste Zeile in der zweiten weitergeht.

Dafür gibt es zwei Wege:

1. Ein \`\\\` am Zeilenende „entwertet“ den Zeilenumbruch.
2. Der Umbruch steht **innerhalb von Klammern**. Python wartet dann automatisch, bis alle Klammern geschlossen sind. Wenn du ohnehin schon Klammern hast – etwa bei einem Funktionsaufruf oder einer Liste – musst du gar nichts tun. Ansonsten kannst du um jeden Ausdruck einfach Klammern setzen.

Hier ein paar Beispiele. Achte genau auf die Details:

    name = "Bob"

    ist_befreundet = name == "Alice" or \\
                     name == "Bob"
    print(ist_befreundet)

    ist_befreundet = (name == "Alice" or
                      name == "Bob")
    print(ist_befreundet)

    print(name == "Alice" or
          name == "Bob")
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
In der Praxis nimmt man fast immer die **Klammer-Variante**. Der Backslash ist unbeliebt: Ein einziges Leerzeichen hinter ihm, und der Code ist kaputt – ohne dass man sieht, warum.

Nützlich ist das vor allem bei langen Bedingungen, weil man dann jede Teilbedingung in eine eigene Zeile schreiben kann:

    darf_rein = (
        alter >= 18
        and hat_ticket
        and not ist_gesperrt
    )
`,
    },

    /* ================================================================== *
     *  4 – and und or kombinieren
     * ================================================================== */
    {
      id: "boolesche-operatoren/kombinieren",
      title: "Vorrang beachten",
      summary: "`and` bindet stärker als `or` – und was das für dich bedeutet.",
      steps: [
        {
          id: "vorrang-ausprobieren",
          kind: "run",
          surface: "shell",
          program: `True or False and False`,
          prediction: { choices: ["True", "False"], correctIndex: 0 },
          text: `
Wenn du \`and\` und \`or\` in einem Ausdruck mischst, ist das ganz ähnlich wie beim Mischen von \`*\` und \`+\`: Die Operatoren werden in einer festen Reihenfolge ausgewertet.

Probier das in der Shell aus. Was erwartest du?

    True or False and False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "uebung-diagonale",
          kind: "exercise",
          mode: "return",
          functionName: "diagonaler_gewinner",
          params: ["brett"],
          tests: [
            {
              args: [
                [
                  ["X", "O", "X"],
                  ["X", "X", "O"],
                  ["O", "O", "X"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["X", "O", "O"],
                  ["X", "O", "X"],
                  ["O", "X", "X"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["X", "O", "X"],
                  ["X", "O", "X"],
                  ["O", "O", "X"],
                ],
              ],
              expected: false,
            },
          ],
          solution: `def diagonaler_gewinner(brett):
    mitte = brett[1][1]
    return (
        (mitte == brett[0][0] and mitte == brett[2][2])
        or (mitte == brett[0][2] and mitte == brett[2][0])
    )`,
          hints: [
            "Wie viele Diagonalen hat ein 3×3-Brett? Zwei.",
            "Welche Felder gehören zu welcher Diagonale? Und wie kommst du an sie heran?",
            "`brett` ist eine Liste von Listen. `brett[0]` ist die erste Zeile, `brett[0][2]` das dritte Feld der ersten Zeile.",
            "Jede Liste hat immer genau 3 Einträge – du brauchst keine Schleife.",
            "Es sind zwei Teilprobleme: „ist eine bestimmte Diagonale voll?“ und „ist mindestens eine der beiden voll?“",
            "Das eine löst du mit `and`, das andere mit `or`.",
            "Beide Diagonalen laufen durch die Mitte `brett[1][1]`. Leg dir die als Variable an.",
            "Setz Klammern um die beiden `and`-Teile, damit die Reihenfolge eindeutig ist.",
          ],
          text: `
Wenn man das flüchtig von links nach rechts liest, denkt man vielleicht, dass

    True or False and False

dasselbe ist wie

    (True or False) and False

Tatsächlich ist es aber gleichbedeutend mit

    True or (False and False)

denn **\`and\` hat höheren Vorrang als \`or\`**. Und das macht einen echten Unterschied: Die erste Lesart ergibt \`True and False\`, also \`False\` – die zweite \`True or False\`, also \`True\`.

**Die Lehre daraus: Sei besonders vorsichtig, wenn du Operatoren mischst.** Setz im Zweifel Klammern oder zerleg den Ausdruck in kleinere Teile mit eigenen Variablen. Das macht deinen Code eindeutig, lesbar – und erspart dir schmerzhafte Fehler.

Zeit für eine anspruchsvolle Übung. Ein Tic-Tac-Toe-Brett ist eine Liste aus drei Zeilen, jede Zeile eine Liste mit drei Feldern:

    brett = [
        ['X', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', 'O', 'X']
    ]

Schreib \`diagonaler_gewinner(brett)\`, das \`True\` zurückgibt, wenn eine der beiden **Diagonalen** komplett mit demselben Zeichen belegt ist.

Im Beispiel oben ist das der Fall: oben links, Mitte und unten rechts sind alle \`'X'\`.
`,
          task: "Schreib `diagonaler_gewinner(brett)` für beide Diagonalen.",
        },
      ],
      outro: `
Stark! Das war eine harte Nuss. Hier zwei mögliche Lösungen:

    def diagonaler_gewinner(brett):
        mitte = brett[1][1]
        return (
            (mitte == brett[0][0] and mitte == brett[2][2])
            or (mitte == brett[0][2] and mitte == brett[2][0])
        )

oder – wenn du \`alle_gleich\` von vorhin wiederverwendest – deutlich lesbarer:

    def diagonaler_gewinner(brett):
        diagonale1 = alle_gleich([brett[0][0], brett[1][1], brett[2][2]])
        diagonale2 = alle_gleich([brett[2][0], brett[1][1], brett[0][2]])
        return diagonale1 or diagonale2

Die zweite Variante zeigt schön, wozu Funktionen da sind: Ein einmal gelöstes Teilproblem löst du nie wieder.
`,
    },

    /* ================================================================== *
     *  5 – not
     * ================================================================== */
    {
      id: "boolesche-operatoren/nicht",
      title: "`not` – das Gegenteil",
      summary: "Eine Bedingung umdrehen.",
      steps: [
        {
          id: "not-true",
          kind: "run",
          surface: "shell",
          program: `not True`,
          prediction: { choices: ["True", "False"], correctIndex: 1 },
          text: `
Anders als \`and\` und \`or\`, die zwischen **zwei** Booleans stehen (man nennt sie *binäre* Operatoren), steht \`not\` vor einem **einzelnen** Boolean – es ist ein *unärer* Operator.

\`not\` dreht den Ausdruck um, ein bisschen wie ein Minuszeichen. Probier es in der Shell:

    not True
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "not-false",
          kind: "run",
          surface: "shell",
          program: `not False`,
          prediction: { choices: ["True", "False"], correctIndex: 0 },
          text: `
Und entsprechend:

    not False
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "not-vorrang",
          kind: "run",
          surface: "editor",
          program: `b = True
print(not b or b)
print((not b) or b)
print(not (b or b))`,
          text: `
Welchen Vorrang hat \`not\` gegenüber \`and\` und \`or\`? Finden wir es heraus:

    b = True
    print(not b or b)
    print((not b) or b)
    print(not (b or b))
`,
          task: "Führ das Programm aus und vergleiche die drei Ausgaben.",
        },
        {
          id: "uebung-ungueltiges-bild",
          kind: "exercise",
          mode: "return",
          functionName: "ungueltiges_bild",
          params: ["dateiname"],
          tests: [
            { args: ["hund.png"], expected: false },
            { args: ["katze.jpg"], expected: false },
            { args: ["rechnung.pdf"], expected: true },
          ],
          solution: `def ungueltiges_bild(dateiname):
    return not (dateiname.endswith(".png") or dateiname.endswith(".jpg"))`,
          hints: [
            "Mit `dateiname.endswith(\".png\")` prüfst du, ob der Name auf `.png` endet – das ergibt einen Boolean.",
            "Eine gültige Datei endet auf `.png` **oder** auf `.jpg`.",
            "Gefragt ist aber das Gegenteil: ob die Datei **un**gültig ist.",
            "Dreh die ganze Bedingung mit `not` um – und setz Klammern darum!",
            "`return not (... or ...)`",
          ],
          text: `
Wie du siehst, liest Python

    not b or b

als

    (not b) or b

und nicht als

    not (b or b)

\`not\` hat also **höheren Vorrang** als \`or\` – genauso wie \`-1 + 2\` als \`(-1) + 2\` gelesen wird und nicht als \`-(1 + 2)\`. Auch gegenüber \`and\` hat \`not\` höheren Vorrang.

Und wieder gilt: Im Zweifel Klammern setzen oder Zwischenvariablen benutzen.

Übung: Stell dir vor, du schreibst ein Programm, das Bilder verarbeitet. Nur bestimmte Dateitypen sind erlaubt. Bei allen anderen soll eine Fehlermeldung erscheinen:

    if ungueltiges_bild(dateiname):
        print(f"{dateiname} kann ich nicht verarbeiten.")

Schreib \`ungueltiges_bild\`, das \`True\` zurückgibt, wenn der Dateiname **nicht** auf \`.png\` oder \`.jpg\` endet:

    assert_equal(ungueltiges_bild("hund.png"), False)
    assert_equal(ungueltiges_bild("katze.jpg"), False)
    assert_equal(ungueltiges_bild("rechnung.pdf"), True)
`,
          task: "Schreib `ungueltiges_bild(dateiname)` mit `not`.",
        },
      ],
      outro: `
Stark! Zwei gültige Lösungen:

    def ungueltiges_bild(dateiname):
        return not (dateiname.endswith(".png") or dateiname.endswith(".jpg"))

    def ungueltiges_bild(dateiname):
        return not dateiname.endswith(".png") and not dateiname.endswith(".jpg")

(Falls es dich interessiert: Die beiden sind wegen der *De-Morgan-Regel* gleichwertig – ein \`not\` vor einer Klammer dreht \`or\` in \`and\` um.)

Und noch ein Vereinfachungsmuster, passend zu dem vom Anfang des Kapitels. Wenn dein Code so aussieht:

    if x:
        return False
    else:
        return True

wobei \`x\` ein Boolean ist, kannst du ihn immer zu

    return not x

verkürzen.

Damit sind die Python-Grundlagen abgeschlossen – du hast jetzt alles beisammen, was man zum Programmieren wirklich braucht. 🎉
`,
    },
  ],
};
