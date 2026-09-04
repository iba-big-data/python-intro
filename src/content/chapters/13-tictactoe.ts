import type { Chapter } from "../types";

/** Startcode für die Gewinnprüfungen – wird in mehreren Übungen wiederverwendet. */
const GEWINNER_BAUSTEINE = `def zeilen_gewinner(brett):
    for zeile in brett:
        alle_gleich = True
        zeichen = zeile[0]
        for eintrag in zeile:
            if eintrag == ' ' or zeichen != eintrag:
                alle_gleich = False
                break
        if alle_gleich:
            return True
    return False

def spalten_gewinner(brett):
    for spalte in range(len(brett[0])):
        alle_gleich = True
        zeichen = brett[0][spalte]
        for zeile in brett:
            if zeile[spalte] == ' ' or zeile[spalte] != zeichen:
                alle_gleich = False
                break
        if alle_gleich:
            return True
    return False

def diagonalen_gewinner(brett):
    alle_gleich1 = True
    alle_gleich2 = True
    oben_links = brett[0][0]
    oben_rechts = brett[0][-1]
    for i in range(len(brett)):
        if brett[i][i] == ' ' or brett[i][i] != oben_links:
            alle_gleich1 = False
        if brett[i][-i - 1] == ' ' or brett[i][-i - 1] != oben_rechts:
            alle_gleich2 = False
    return alle_gleich1 or alle_gleich2`;

/** Fertige Bausteine für das Endspiel – kompakter geschrieben als in den Übungen. */
const SPIEL_BAUSTEINE = `def gewinnlinie(zeichen):
    zeichen = set(zeichen)
    return len(zeichen) == 1 and ' ' not in zeichen

def zeilen_gewinner(brett):
    return any(gewinnlinie(zeile) for zeile in brett)

def spalten_gewinner(brett):
    return zeilen_gewinner(zip(*brett))

def haupt_diagonale(brett):
    return gewinnlinie(zeile[i] for i, zeile in enumerate(brett))

def diagonalen_gewinner(brett):
    return haupt_diagonale(brett) or haupt_diagonale(reversed(brett))

def gewinner(brett):
    return zeilen_gewinner(brett) or spalten_gewinner(brett) or diagonalen_gewinner(brett)

def brett_formatieren(brett):
    groesse = len(brett)
    linie = f'\\n  {"+".join("-" * groesse)}\\n'
    zeilen = [f'{i + 1} {"|".join(zeile)}' for i, zeile in enumerate(brett)]
    return f'  {" ".join(str(i + 1) for i in range(groesse))}\\n{linie.join(zeilen)}'

def zug_spielen(brett, spieler):
    print(f'{spieler} ist am Zug:')
    zeile = int(input()) - 1
    spalte = int(input()) - 1
    brett[zeile][spalte] = spieler
    print(brett_formatieren(brett))

def brett_bauen(groesse):
    return [[' '] * groesse for _ in range(groesse)]

def gewinner_ausgeben(spieler):
    print(f'{spieler} gewinnt!')

def unentschieden_ausgeben():
    print('Unentschieden!')`;

const SPIEL_2X2 =
  "  1 2\n1  | \n  -+-\n2  | \nA ist am Zug:\n<Eingabe: 1>\n<Eingabe: 1>\n" +
  "  1 2\n1 A| \n  -+-\n2  | \nB ist am Zug:\n<Eingabe: 1>\n<Eingabe: 2>\n" +
  "  1 2\n1 A|B\n  -+-\n2  | \nA ist am Zug:\n<Eingabe: 2>\n<Eingabe: 1>\n" +
  "  1 2\n1 A|B\n  -+-\n2 A| \nA gewinnt!\n";

const SPIEL_3X3_UNENTSCHIEDEN =
  "  1 2 3\n1  | | \n  -+-+-\n2  | | \n  -+-+-\n3  | | \nX ist am Zug:\n<Eingabe: 1>\n<Eingabe: 1>\n" +
  "  1 2 3\n1 X| | \n  -+-+-\n2  | | \n  -+-+-\n3  | | \nO ist am Zug:\n<Eingabe: 1>\n<Eingabe: 2>\n" +
  "  1 2 3\n1 X|O| \n  -+-+-\n2  | | \n  -+-+-\n3  | | \nX ist am Zug:\n<Eingabe: 1>\n<Eingabe: 3>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2  | | \n  -+-+-\n3  | | \nO ist am Zug:\n<Eingabe: 2>\n<Eingabe: 2>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2  |O| \n  -+-+-\n3  | | \nX ist am Zug:\n<Eingabe: 2>\n<Eingabe: 1>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2 X|O| \n  -+-+-\n3  | | \nO ist am Zug:\n<Eingabe: 2>\n<Eingabe: 3>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2 X|O|O\n  -+-+-\n3  | | \nX ist am Zug:\n<Eingabe: 3>\n<Eingabe: 2>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2 X|O|O\n  -+-+-\n3  |X| \nO ist am Zug:\n<Eingabe: 3>\n<Eingabe: 1>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2 X|O|O\n  -+-+-\n3 O|X| \nX ist am Zug:\n<Eingabe: 3>\n<Eingabe: 3>\n" +
  "  1 2 3\n1 X|O|X\n  -+-+-\n2 X|O|O\n  -+-+-\n3 O|X|X\nUnentschieden!\n";

export const tictactoe: Chapter = {
  id: "tictactoe",
  number: 13,
  title: "Projekt: Tic-Tac-Toe",
  summary: "Alles Gelernte zu einem echten, spielbaren Spiel zusammensetzen.",
  icon: "🎮",
  track: "project",
  lessons: [
    /* ================================================================== *
     *  1 – Gewinner erkennen
     * ================================================================== */
    {
      id: "tictactoe/gewinner",
      title: "Wer hat gewonnen?",
      summary: "Zeilen, Spalten und Diagonalen auf drei gleiche Zeichen prüfen.",
      steps: [
        {
          id: "uebung-zeilen",
          kind: "exercise",
          mode: "return",
          functionName: "zeilen_gewinner",
          params: ["brett"],
          starter: `def zeilen_gewinner(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", " ", " "],
                  ["A", "A", "B"],
                  ["B", "B", "A"],
                ],
              ],
              expected: false,
            },
            {
              args: [
                [
                  ["S", "S", "S", "S"],
                  ["M", "M", "S", " "],
                  [" ", "S", "M", "S"],
                  [" ", "M", " ", "S"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["X", "O", " ", "X", "X"],
                  ["X", "O", " ", "X", "X"],
                  [" ", "O", "X", "X", " "],
                  ["X", "X", "X", "X", " "],
                  ["X", "O", "O", "X", "O"],
                ],
              ],
              expected: false,
            },
          ],
          solution: `def zeilen_gewinner(brett):
    for zeile in brett:
        alle_gleich = True
        zeichen = zeile[0]
        for eintrag in zeile:
            if eintrag == ' ' or zeichen != eintrag:
                alle_gleich = False
                break
        if alle_gleich:
            return True
    return False`,
          hints: [
            "Du musst jede Zeile des Bretts prüfen – dafür brauchst du eine Schleife.",
            "Wie prüfst du, ob in **einer** Zeile alle Einträge gleich sind? Vergiss das Brett kurz und löse nur dieses Teilproblem.",
            "Die Zeile kann beliebig lang sein, du musst also ganz durchlaufen.",
            "Leg für jede Zeile eine Boolean-Variable an und aktualisiere sie in einer inneren Schleife.",
            "Vergleich alle Einträge mit dem ersten, also `zeile[0]`.",
            "Überleg genau, mit welchem Wert die Variable starten muss und wann sie sich ändert. Tipp: Starte mit `True`.",
            "Achtung, eine Falle: Drei Leerzeichen sind zwar alle gleich – aber kein Gewinn! Leere Felder musst du ausschließen.",
            "Sobald du eine Gewinnzeile gefunden hast, kannst du sofort `return True`. Erst **nach** der ganzen Schleife kommt `return False`.",
          ],
          text: `
Du hast bisher viele kleine, in sich geschlossene Aufgaben gelöst. Jetzt kommt ein **richtiges Projekt**: Du baust ein textbasiertes Tic-Tac-Toe für zwei Spielerinnen und Spieler.

So sieht das fertige Spiel aus:

      1 2 3
    1  | |
      -+-+-
    2  | |
      -+-+-
    3  | |

    X ist am Zug:
    1
    1

      1 2 3
    1 X| |
      -+-+-
    2  | |
      -+-+-
    3  | |

    O ist am Zug:
    ...

Wir zerlegen das Ganze in kleine Teile und lösen eins nach dem anderen – genau so geht man an jedes größere Programm heran.

**Das Brett** ist eine verschachtelte Liste: eine Liste von Zeilen, wobei jede Zeile eine Liste von Feldern ist. Ein leeres Feld ist \`' '\`.

    brett = [
        ['X', 'O', ' '],
        [' ', 'X', 'O'],
        [' ', ' ', 'X']
    ]

**Erste Aufgabe:** Schreib \`zeilen_gewinner(brett)\`. Die Funktion gibt \`True\` zurück, wenn **irgendeine Zeile** komplett mit demselben Zeichen gefüllt ist – und \`False\` sonst.

Sie muss für Bretter **jeder Größe** funktionieren, nicht nur 3×3. Und Achtung: Eine Zeile aus lauter Leerzeichen ist **kein** Gewinn.
`,
          task: "Schreib `zeilen_gewinner(brett)` für Bretter beliebiger Größe.",
        },
        {
          id: "uebung-spalten",
          kind: "exercise",
          mode: "return",
          functionName: "spalten_gewinner",
          params: ["brett"],
          starter: `def spalten_gewinner(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", "A", "B"],
                  [" ", "A", "B"],
                  [" ", "B", "A"],
                ],
              ],
              expected: false,
            },
            {
              args: [
                [
                  ["S", "M", " ", "M"],
                  ["S", "M", "S", " "],
                  ["S", "S", "M", "S"],
                  ["S", "M", " ", "S"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["X", "O", " ", "X", "O"],
                  ["O", "O", "O", "O", "O"],
                  ["X", "O", "O", "O", " "],
                  ["X", "O", "O", "X", " "],
                  ["O", "X", " ", "O", "O"],
                ],
              ],
              expected: false,
            },
          ],
          solution: `def spalten_gewinner(brett):
    for spalte in range(len(brett[0])):
        alle_gleich = True
        zeichen = brett[0][spalte]
        for zeile in brett:
            if zeile[spalte] == ' ' or zeile[spalte] != zeichen:
                alle_gleich = False
                break
        if alle_gleich:
            return True
    return False`,
          hints: [
            "Fang mit einer Kopie von `zeilen_gewinner` an und bau sie um.",
            "Über Spalten kann man nicht so direkt laufen wie über Zeilen.",
            "Was **ist** eine Spalte? Die erste Spalte besteht aus dem ersten Element jeder Zeile.",
            "Du musst also über die Positionen laufen: erste, zweite, dritte …",
            "Die Anzahl der Spalten ist `len(brett[0])` – die Länge der ersten Zeile.",
            "Die äußere Schleife geht über `range(len(brett[0]))`, die innere über die Zeilen.",
            "Auf ein Feld greifst du dann mit `zeile[spalte]` zu.",
          ],
          text: `
Klasse gemacht!

Jetzt eine ähnliche Funktion \`spalten_gewinner(brett)\`, die eine gewinnende **Spalte** (eine senkrechte Linie) erkennt:

    assert_equal(
        spalten_gewinner([
            ['X', 'O', ' '],
            ['X', 'O', ' '],
            ['O', 'X', ' ']
        ]),
        False
    )

Auch hier gilt: beliebige Brettgrößen, und Leerzeichen zählen nicht.
`,
          task: "Schreib `spalten_gewinner(brett)`.",
        },
        {
          id: "uebung-diagonalen",
          kind: "exercise",
          mode: "return",
          functionName: "diagonalen_gewinner",
          params: ["brett"],
          starter: `def diagonalen_gewinner(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", "A", " "],
                  ["B", " ", "B"],
                  [" ", "B", " "],
                ],
              ],
              expected: false,
            },
            {
              args: [
                [
                  ["S", "M", " ", "M"],
                  ["S", "S", "S", " "],
                  ["S", "S", "S", "S"],
                  [" ", "M", " ", "S"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["S", "M", " ", "M"],
                  [" ", "S", "M", " "],
                  ["S", "M", " ", "S"],
                  ["M", " ", " ", "M"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["X", " ", " ", " ", "X"],
                  [" ", "O", " ", "X", " "],
                  [" ", " ", "X", " ", " "],
                  [" ", "X", " ", "O", " "],
                  ["O", " ", " ", " ", "O"],
                ],
              ],
              expected: false,
            },
          ],
          solution: `def diagonalen_gewinner(brett):
    alle_gleich1 = True
    alle_gleich2 = True
    oben_links = brett[0][0]
    oben_rechts = brett[0][-1]
    for i in range(len(brett)):
        if brett[i][i] == ' ' or brett[i][i] != oben_links:
            alle_gleich1 = False
        if brett[i][-i - 1] == ' ' or brett[i][-i - 1] != oben_rechts:
            alle_gleich2 = False
    return alle_gleich1 or alle_gleich2`,
          hints: [
            "Wie viele Diagonalen hat ein quadratisches Brett? Immer genau zwei – egal wie groß es ist.",
            "Diesmal kannst du nicht einfach `brett[0][0]` und `brett[2][2]` vergleichen, weil du die Länge nicht kennst.",
            "Nimm dir zuerst nur die Diagonale von oben links nach unten rechts vor.",
            "Welche Felder sind das? `brett[0][0]`, `brett[1][1]`, `brett[2][2]` …",
            "Siehst du das Muster? Beide Indizes sind gleich: `brett[i][i]`.",
            "Jetzt die andere Diagonale, von oben rechts nach unten links: `brett[0][-1]`, `brett[1][-2]`, `brett[2][-3]` …",
            "Auch hier gibt es ein Muster: `brett[i][-i - 1]`.",
            "Du kannst beide Diagonalen in **einer** Schleife prüfen – mit zwei Boolean-Variablen.",
          ],
          text: `
Ausgezeichnet, das war anspruchsvoll!

Bleiben die **Diagonalen**. Im vorigen Kapitel hattest du dafür schon eine Lösung – allerdings nur für 3×3-Bretter:

    def diagonaler_gewinner(brett):
        mitte = brett[1][1]
        return (
            (mitte == brett[0][0] and mitte == brett[2][2])
            or (mitte == brett[0][2] and mitte == brett[2][0])
        )

Schreib jetzt \`diagonalen_gewinner(brett)\` so, dass es für quadratische Bretter **jeder** Größe funktioniert: 4×4, 5×5 und so weiter.
`,
          task: "Schreib `diagonalen_gewinner(brett)` für beliebige Brettgrößen.",
        },
        {
          id: "uebung-gewinner",
          kind: "exercise",
          mode: "return",
          functionName: "gewinner",
          params: ["brett"],
          starter: `${GEWINNER_BAUSTEINE}

def gewinner(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", "A", "B"],
                  [" ", "A", "B"],
                  [" ", "B", "A"],
                ],
              ],
              expected: false,
            },
            {
              args: [
                [
                  [" ", "A", "A"],
                  [" ", "A", "B"],
                  ["B", "B", "B"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["S", "M", " ", "M"],
                  ["S", "M", "S", " "],
                  ["S", "S", "M", "S"],
                  ["S", "M", " ", "S"],
                ],
              ],
              expected: true,
            },
            {
              args: [
                [
                  ["O", "O", " ", "X", "X"],
                  ["X", "O", "O", "X", "X"],
                  ["X", "O", "O", "O", " "],
                  ["X", "O", "O", "O", " "],
                  ["O", "X", " ", "O", "O"],
                ],
              ],
              expected: true,
            },
          ],
          solution: `${GEWINNER_BAUSTEINE}

def gewinner(brett):
    return zeilen_gewinner(brett) or spalten_gewinner(brett) or diagonalen_gewinner(brett)`,
          hints: [
            "Die Lösung ist ganz kurz – du musst nur die drei Funktionen richtig benutzen.",
            "Wann gibt `gewinner(brett)` `True` zurück? Wenn **mindestens eine** der drei Prüfungen zutrifft.",
            "Welcher boolesche Operator bedeutet „mindestens eines davon“?",
            "`return zeilen_gewinner(brett) or spalten_gewinner(brett) or diagonalen_gewinner(brett)`",
          ],
          text: `
Bravo! Das war richtig knifflig.

Jetzt setzen wir die drei Funktionen zusammen. Schreib \`gewinner(brett)\`, das \`True\` zurückgibt, wenn das Brett eine gewinnende Zeile, Spalte **oder** Diagonale enthält.

Deine Lösung soll die drei Funktionen **aufrufen**. \`gewinner\` selbst braucht keine einzige Schleife und keinen Index.
`,
          task: "Schreib `gewinner(brett)` mit Hilfe der drei Funktionen.",
        },
      ],
      outro: `
Hervorragend! Der erste große Baustein steht.

Was du hier gemacht hast, ist die wichtigste Technik der Softwareentwicklung überhaupt: **ein großes Problem in kleine zerlegen**, jedes einzeln lösen und am Ende zusammensetzen.

Beachte auch, wie kurz \`gewinner\` geworden ist. Guter Code liest sich am Ende oft fast wie eine Beschreibung des Problems – die ganze Komplexität steckt in den Bausteinen darunter.
`,
    },

    /* ================================================================== *
     *  2 – Brett anzeigen
     * ================================================================== */
    {
      id: "tictactoe/brett-anzeigen",
      title: "Das Brett anzeigen",
      summary: "Mehrzeilige Texte bauen – mit `\\n` und dreifachen Anführungszeichen.",
      steps: [
        {
          id: "brett-zeilenweise",
          kind: "run",
          surface: "editor",
          program: `brett = [
    ['X', 'O', ' '],
    [' ', 'X', 'O'],
    [' ', ' ', 'X']
]

for zeile in brett:
    print(''.join(zeile))`,
          text: `
Das Brett zu prüfen ist die eine Hälfte – man muss es auch **anzeigen** können.

Der naheliegende Weg ist, Zeile für Zeile auszugeben:

    brett = [
        ['X', 'O', ' '],
        [' ', 'X', 'O'],
        [' ', ' ', 'X']
    ]

    for zeile in brett:
        print(''.join(zeile))

(\`''.join(zeile)\` hängt alle Zeichen der Liste zu einem String zusammen – genau das, was du in Kapitel 6 selbst gebaut hast.)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "mehrzeiliger-string",
          kind: "run",
          surface: "editor",
          program: `text = """Zeile eins
Zeile zwei
Zeile drei"""

print(text)`,
          text: `
Das funktioniert, ist aber unflexibel: Die Funktion **druckt** das Brett, statt es **zurückzugeben**. Und wie du in Kapitel 8 gelernt hast, ist eine Funktion, die etwas zurückgibt, viel vielseitiger.

Wir brauchen also einen **mehrzeiligen String**. Dafür gibt es dreifache Anführungszeichen:

    text = """Zeile eins
    Zeile zwei
    Zeile drei"""

    print(text)

Achtung beim Abtippen: Die Fortsetzungszeilen dürfen **nicht** eingerückt sein, sonst landen die Leerzeichen im String. Schreib sie ganz links.
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "newline-zeichen",
          kind: "run",
          surface: "shell",
          program: `"Zeile eins\\nZeile zwei"`,
          prediction: {
            choices: [
              "'Zeile eins\\nZeile zwei'",
              "'Zeile eins\nZeile zwei'",
              "Zeile eins\nZeile zwei",
              "eine Fehlermeldung",
            ],
            correctIndex: 0,
          },
          text: `
Es gibt noch einen zweiten, oft praktischeren Weg: das **Zeilenumbruchzeichen** \`\\n\`.

Der Backslash \`\\\` leitet in Strings eine Sonderbedeutung ein: \`\\n\` steht für „neue Zeile“. Es ist **ein einziges Zeichen**, auch wenn es beim Tippen wie zwei aussieht.

Gib das in der Shell ein – und achte darauf, dass die Shell dir den String so zeigt, wie man ihn **schreibt**:

    "Zeile eins\\nZeile zwei"
`,
          task: "Sag die Ausgabe voraus und führ es in der Shell aus.",
        },
        {
          id: "newline-gedruckt",
          kind: "run",
          surface: "shell",
          program: `print("Zeile eins\\nZeile zwei")`,
          text: `
Die Shell zeigt den String in seiner Quelltext-Form. Mit \`print\` siehst du dagegen, was das Zeichen tatsächlich bewirkt:

    print("Zeile eins\\nZeile zwei")
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "uebung-brett-formatieren",
          kind: "exercise",
          mode: "return",
          functionName: "brett_formatieren",
          params: ["brett"],
          starter: `def brett_formatieren(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", " ", " "],
                  ["X", "X", "O"],
                  ["O", "O", "X"],
                ],
              ],
              expected: "   \nXXO\nOOX",
            },
            {
              args: [
                [
                  ["X", "X", "X", "X"],
                  ["O", "O", "X", " "],
                  [" ", "X", "O", "O"],
                  [" ", "O", " ", "O"],
                ],
              ],
              expected: "XXXX\nOOX \n XOO\n O O",
            },
          ],
          solution: `def brett_formatieren(brett):
    ergebnis = ''
    for i in range(len(brett)):
        for zeichen in brett[i]:
            ergebnis += zeichen
        if i != len(brett) - 1:
            ergebnis += '\\n'
    return ergebnis`,
          hints: [
            "Die Funktion soll den Text **zurückgeben**, nicht ausgeben – also kein `print` am Ende.",
            "Bau den String Stück für Stück auf, so wie in Kapitel 6.",
            "Für jede Zeile hängst du erst die Zeichen an, dann einen Zeilenumbruch `'\\n'`.",
            "Aber Vorsicht: Nach der **letzten** Zeile darf kein Umbruch mehr kommen.",
            "Das ist genau dasselbe Problem wie damals mit dem Trennzeichen zwischen den Wörtern!",
            "Alternativ – und viel kürzer: Sammle die Zeilen in einer Liste und benutze `'\\n'.join(zeilen)`.",
          ],
          text: `
Jetzt du. Schreib \`brett_formatieren(brett)\`, das das Brett als **einen** mehrzeiligen String zurückgibt.

Für

    brett = [
        [' ', ' ', ' '],
        ['X', 'X', 'O'],
        ['O', 'O', 'X']
    ]

soll \`print(brett_formatieren(brett))\` dies ausgeben:

    ␣␣␣
    XXO
    OOX

(Die erste Zeile besteht aus drei Leerzeichen.)

Wichtig: **Kein** Zeilenumbruch am Ende des Strings.
`,
          task: "Schreib `brett_formatieren(brett)`, das einen mehrzeiligen String zurückgibt.",
        },
        {
          id: "uebung-brett-mit-linien",
          kind: "exercise",
          mode: "return",
          functionName: "brett_formatieren",
          params: ["brett"],
          starter: `def brett_formatieren(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", " ", " "],
                  ["X", "X", "O"],
                  ["O", "O", "X"],
                ],
              ],
              expected: " | | \n-+-+-\nX|X|O\n-+-+-\nO|O|X",
            },
            {
              args: [
                [
                  ["X", "X", "X", "X"],
                  ["O", "O", "X", " "],
                  [" ", "X", "O", "X"],
                  [" ", "O", " ", "X"],
                ],
              ],
              expected: "X|X|X|X\n-+-+-+-\nO|O|X| \n-+-+-+-\n |X|O|X\n-+-+-+-\n |O| |X",
            },
          ],
          solution: `def brett_formatieren(brett):
    zeilen = []
    for zeile in brett:
        zeilen.append("|".join(zeile))

    groesse = len(brett)
    trenner = "\\n" + "+".join("-" * groesse) + "\\n"
    return trenner.join(zeilen)`,
          hints: [
            "Zwei Teilprobleme: die Felder innerhalb einer Zeile trennen und die Zeilen untereinander trennen.",
            "Innerhalb einer Zeile trennt ein `|`: `'|'.join(zeile)`.",
            "Zwischen den Zeilen steht eine Linie wie `-+-+-`.",
            "Diese Linie hängt von der Brettgröße ab: bei 3 Spalten `-+-+-`, bei 4 Spalten `-+-+-+-`.",
            "Auch die bekommst du mit join: `'+'.join('-' * groesse)`.",
            "Der Trenner zwischen zwei Zeilen ist also `'\\n' + linie + '\\n'`.",
            "Und dann wieder: `trenner.join(zeilen)`.",
          ],
          text: `
Sehr gut! Das sieht aber noch nicht nach einem Spielbrett aus. Machen wir es hübscher – mit Trennlinien:

     | |
    -+-+-
    X|X|O
    -+-+-
    O|O|X

Schreib \`brett_formatieren\` so um, dass es dieses Format erzeugt. Es muss weiterhin für **jede** Brettgröße funktionieren.

Diese Aufgabe ist deutlich einfacher, wenn du \`join\` benutzt – überleg dir, was womit verbunden werden muss.
`,
          task: "Erweitere `brett_formatieren` um die Trennlinien.",
        },
      ],
      outro: `
Sieht doch schon nach etwas aus! 🎯

Zwei Dinge zum Mitnehmen:

- \`\\n\` ist **ein** Zeichen, das einen Zeilenumbruch bewirkt. Die Shell zeigt es als \`\\n\`, \`print\` führt es aus.
- \`trenner.join(liste)\` fügt Strings mit einem Trennzeichen dazwischen zusammen – das Problem, das du in Kapitel 6 mühsam von Hand gelöst hast, in einem Aufruf.

Achte darauf, wie beide Lösungen dasselbe Muster benutzen, nur auf zwei Ebenen: Felder zu einer Zeile verbinden, Zeilen zu einem Brett verbinden.
`,
    },

    /* ================================================================== *
     *  3 – Typen
     * ================================================================== */
    {
      id: "tictactoe/typen",
      title: "Datentypen",
      summary: "Warum `'2' + 2` nicht funktioniert – und wie man es repariert.",
      steps: [
        {
          id: "typen-anzeigen",
          kind: "run",
          surface: "editor",
          program: `print(type('Hallo'))
print(type(42))
print(type(3.14))
print(type(True))
print(type([1, 2, 3]))`,
          text: `
Bevor wir das Spiel interaktiv machen, brauchst du ein Konzept, das bisher im Hintergrund lief: **Datentypen**.

Jeder Wert in Python hat einen Typ. \`type()\` verrät ihn dir:

    print(type('Hallo'))
    print(type(42))
    print(type(3.14))
    print(type(True))
    print(type([1, 2, 3]))
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "gleich-aussehend",
          kind: "run",
          surface: "editor",
          program: `x = 1
y = '1'
print(x)
print(y)
print(x == y)
print(type(x))
print(type(y))`,
          prediction: {
            choices: [
              "1\n1\nFalse\n<class 'int'>\n<class 'str'>",
              "1\n1\nTrue\n<class 'int'>\n<class 'str'>",
              "1\n'1'\nFalse\n<class 'int'>\n<class 'str'>",
              "eine Fehlermeldung",
            ],
            correctIndex: 0,
          },
          text: `
Die fünf wichtigsten Typen: \`str\` (Text), \`int\` (ganze Zahl), \`float\` (Kommazahl), \`bool\` (Wahrheitswert) und \`list\` (Liste).

Der Haken: Zwei Werte können **gleich aussehen** und trotzdem verschiedene Typen haben.

    x = 1
    y = '1'
    print(x)
    print(y)
    print(x == y)
    print(type(x))
    print(type(y))
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "plus-zwei-bedeutungen",
          kind: "run",
          surface: "editor",
          program: `print(2 + 2)
print('2' + '2')`,
          prediction: {
            choices: ["4\n22", "4\n4", "22\n22", "eine Fehlermeldung"],
            correctIndex: 0,
          },
          text: `
Genau das ist der Grund, warum dasselbe Symbol je nach Typ etwas völlig anderes tut. \`+\` addiert Zahlen – und verkettet Strings:

    print(2 + 2)
    print('2' + '2')
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "typfehler",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `print('2' + 2)`,
          text: `
Und was passiert, wenn du beide mischst?

    print('2' + 2)
`,
          prediction: {
            choices: ["4", "22", "'22'", "eine Fehlermeldung"],
            correctIndex: 3,
          },
          task: "Sag voraus, was passiert, und führ das Programm aus.",
        },
        {
          id: "uebung-umwandeln",
          kind: "exercise",
          mode: "stdout",
          params: ["zahl"],
          starter: `for i in range(zahl):
    print('Achtung … ' + i + 1)
print('Los!')`,
          tests: [
            { args: ["1"], expected: "Achtung … 1\nLos!\n" },
            { args: ["2"], expected: "Achtung … 1\nAchtung … 2\nLos!\n" },
            {
              args: ["3"],
              expected: "Achtung … 1\nAchtung … 2\nAchtung … 3\nLos!\n",
            },
          ],
          solution: `for i in range(int(zahl)):
    print('Achtung … ' + str(i + 1))
print('Los!')`,
          hints: [
            "Im Programm stecken **zwei** Typfehler.",
            "Erstens: `zahl` ist ein String, `range` braucht aber eine Zahl.",
            "Aus einem String machst du mit `int(...)` eine ganze Zahl.",
            "Zweitens: `'Achtung … ' + i + 1` verbindet Text mit einer Zahl.",
            "Aus einer Zahl machst du mit `str(...)` einen Text.",
            "Achte auf die Klammern: Erst `i + 1` rechnen, dann umwandeln – also `str(i + 1)`.",
          ],
          text: `
\`TypeError\` – Python weigert sich zu raten, was du meinst.

Die Lösung sind **Typumwandlungen**: \`int('2')\` macht aus dem Text die Zahl 2, \`str(2)\` aus der Zahl den Text \`'2'\`.

Übung: Das Programm unten ist kaputt. Die Variable \`zahl\` enthält einen **String** wie \`'3'\`. Für \`zahl = '3'\` soll herauskommen:

    Achtung … 1
    Achtung … 2
    Achtung … 3
    Los!

Repariere es mit den passenden Umwandlungen.
`,
          task: "Repariere beide Typfehler.",
        },
        {
          id: "uebung-brett-mit-nummern",
          kind: "exercise",
          mode: "return",
          functionName: "brett_formatieren",
          params: ["brett"],
          starter: `def brett_formatieren(brett):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", " ", " "],
                  ["X", "X", "O"],
                  ["O", "O", "X"],
                ],
              ],
              expected: "  1 2 3\n1  | | \n  -+-+-\n2 X|X|O\n  -+-+-\n3 O|O|X",
            },
            {
              args: [
                [
                  ["X", "X", "X", "X"],
                  ["O", "O", "X", " "],
                  [" ", "X", "O", "X"],
                  [" ", "O", " ", "X"],
                ],
              ],
              expected:
                "  1 2 3 4\n1 X|X|X|X\n  -+-+-+-\n2 O|O|X| \n  -+-+-+-\n3  |X|O|X\n  -+-+-+-\n4  |O| |X",
            },
          ],
          solution: `def brett_formatieren(brett):
    groesse = len(brett)

    kopfzeile = ' '
    for i in range(groesse):
        kopfzeile += ' ' + str(i + 1)

    zeilen = [kopfzeile]
    for i, zeile in enumerate(brett):
        zeilen.append(str(i + 1) + ' ' + '|'.join(zeile))

    trennlinie = '  ' + '+'.join('-' * groesse)

    ergebnis = zeilen[0]
    for zeile in zeilen[1:]:
        if zeile is not zeilen[1]:
            ergebnis += '\\n' + trennlinie
        ergebnis += '\\n' + zeile
    return ergebnis`,
          hints: [
            "Bau auf deiner Lösung mit den Trennlinien auf.",
            "Neu sind: eine Kopfzeile mit den Spaltennummern und eine Nummer vor jeder Zeile.",
            "Die Nummern sind Zahlen, der Rest ist Text – du brauchst also `str(...)`.",
            "Denk daran, dass Menschen ab 1 zählen, Python aber ab 0: Die Zeile mit Index `i` heißt für Spielende `i + 1`.",
            "Die Kopfzeile beginnt mit einem Leerzeichen, dann folgt je Spalte ein Leerzeichen und die Nummer.",
            "Die Trennlinien müssen jetzt um zwei Zeichen eingerückt sein, damit sie unter dem Brett stehen.",
            "`enumerate(brett)` gibt dir Index und Zeile gleichzeitig – praktisch für die Zeilennummern.",
          ],
          text: `
Sehr gut!

Zum Spielen brauchen wir noch die **Feldnummern** – sonst weiß niemand, wie man einen Zug angibt. So soll das Brett am Ende aussehen:

      1 2 3
    1  | |
      -+-+-
    2 X|X|O
      -+-+-
    3 O|O|X

Erweitere \`brett_formatieren\` entsprechend. Auch das muss für jede Brettgröße funktionieren – hier wirst du die Typumwandlung von eben brauchen.
`,
          task: "Ergänze Kopfzeile und Zeilennummern.",
        },
      ],
      outro: `
Perfekt! Das Brett ist jetzt spielbereit.

Die Kernbotschaft dieser Lektion:

- \`type(x)\` verrät dir den Typ – dein bester Freund bei unerklärlichen Fehlern.
- \`int(x)\` und \`str(x)\` wandeln um.
- \`TypeError\` heißt fast immer: Irgendwo trifft ein Text auf eine Zahl.

Und der Grund, warum das gleich wichtig wird: Alles, was Nutzerinnen und Nutzer eintippen, kommt in Python **immer als String** an – auch wenn es eine Zahl ist.
`,
    },

    /* ================================================================== *
     *  4 – Eingaben
     * ================================================================== */
    {
      id: "tictactoe/eingaben",
      title: "Auf Eingaben reagieren",
      summary: "`input()` macht aus einem Programm ein Gespräch.",
      steps: [
        {
          id: "erstes-input",
          kind: "run",
          surface: "editor",
          stdin: ["Alice"],
          program: `print('Wie heißt du?')
name = input()
print('Hallo ' + name + '!')`,
          text: `
Bisher liefen deine Programme von oben nach unten durch, ohne je nachzufragen. Mit \`input()\` ändert sich das: Das Programm hält an und wartet auf eine Eingabe.

**Hinweis zu dieser Lernumgebung:** Eine echte Tastatureingabe mitten im Programmlauf ist im Browser nicht möglich. Deshalb sind die Antworten hier vorher festgelegt – in diesem Fall \`Alice\`. In der Ausgabe siehst du sie als \`<Eingabe: Alice>\`, damit du den Ablauf nachvollziehen kannst. Auf deinem eigenen Rechner würdest du an dieser Stelle einfach tippen.

    print('Wie heißt du?')
    name = input()
    print('Hallo ' + name + '!')
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "uebung-raten",
          kind: "exercise",
          mode: "stdout",
          params: ["geheimzahl"],
          starter: `print('An welche Zahl denke ich?')
tipp = input()
...
`,
          tests: [
            {
              args: [7],
              stdin: ["7"],
              expected:
                "An welche Zahl denke ich?\n<Eingabe: 7>\nUnglaublich! Bist du hellsehend?\n",
            },
            {
              args: [7],
              stdin: ["0"],
              expected: "An welche Zahl denke ich?\n<Eingabe: 0>\nLeider nicht!\n",
            },
            {
              args: [3],
              stdin: ["3"],
              expected:
                "An welche Zahl denke ich?\n<Eingabe: 3>\nUnglaublich! Bist du hellsehend?\n",
            },
          ],
          solution: `print('An welche Zahl denke ich?')
tipp = input()
if int(tipp) == geheimzahl:
    print('Unglaublich! Bist du hellsehend?')
else:
    print('Leider nicht!')`,
          hints: [
            "Du brauchst ein `if`/`else`, das den Tipp mit `geheimzahl` vergleicht.",
            "Aber Achtung: `input()` liefert immer einen **String**.",
            "`geheimzahl` ist dagegen eine Zahl – direkt vergleichen geht also schief.",
            "Wandle den Tipp mit `int(...)` um: `if int(tipp) == geheimzahl:`",
          ],
          text: `
Zeit für eine Übung. Die Variable \`geheimzahl\` enthält eine Zahl, die dein Programm nicht kennt.

Frag nach einem Tipp und antworte:

- bei richtigem Tipp: \`Unglaublich! Bist du hellsehend?\`
- sonst: \`Leider nicht!\`

Denk an die Lektion von eben – hier lauert eine Typfalle.
`,
          task: "Vergleiche den Tipp mit der Geheimzahl.",
        },
      ],
      outro: `
Sehr gut!

\`input()\` gibt **immer** einen String zurück – auch wenn jemand \`42\` eintippt. Willst du damit rechnen oder vergleichen, musst du \`int(...)\` benutzen. Das ist einer der häufigsten Anfängerfehler überhaupt.
`,
    },

    /* ================================================================== *
     *  5 – Züge spielen
     * ================================================================== */
    {
      id: "tictactoe/zuege",
      title: "Züge auf dem Brett",
      summary: "Verschachtelte Listen gezielt verändern.",
      steps: [
        {
          id: "liste-in-funktion-aendern",
          kind: "run",
          surface: "editor",
          program: `def ans_ende(liste):
    liste.append('neu')

meine_liste = ['a', 'b']
ans_ende(meine_liste)
print(meine_liste)`,
          prediction: {
            choices: [
              "['a', 'b', 'neu']",
              "['a', 'b']",
              "['neu']",
              "eine Fehlermeldung",
            ],
            correctIndex: 0,
          },
          text: `
Ein Zug bedeutet: ein Feld auf dem Brett ändern. Dafür brauchst du zwei Dinge.

**Erstens:** Erinnerst du dich an \`==\` gegen \`is\` aus Kapitel 6? Eine Liste, die du an eine Funktion übergibst, ist **dieselbe** Liste – keine Kopie. Änderungen darin sind also auch draußen sichtbar:

    def ans_ende(liste):
        liste.append('neu')

    meine_liste = ['a', 'b']
    ans_ende(meine_liste)
    print(meine_liste)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "verschachtelte-zuweisung",
          kind: "run",
          surface: "editor",
          program: `brett = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' ']
]

# Zeile 0, Spalte 2
brett[0][2] = 'X'

# Schritt für Schritt gedacht:
zeile = brett[1]
zeile[1] = 'O'

for z in brett:
    print(z)`,
          text: `
**Zweitens:** Bei verschachtelten Listen brauchst du **zwei** Indizes. \`brett[0]\` liefert die erste Zeile (selbst eine Liste), \`brett[0][2]\` das dritte Feld darin.

Und man kann so einer Stelle auch etwas **zuweisen**:

    brett = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ]

    # Zeile 0, Spalte 2
    brett[0][2] = 'X'

    # Schritt für Schritt gedacht:
    zeile = brett[1]
    zeile[1] = 'O'

    for z in brett:
        print(z)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "uebung-zug-spielen",
          kind: "exercise",
          mode: "stdout",
          functionName: "zug_spielen",
          params: ["brett", "spieler"],
          starter: `def brett_formatieren(brett):
    groesse = len(brett)
    linie = f'\\n  {"+".join("-" * groesse)}\\n'
    zeilen = [f'{i + 1} {"|".join(zeile)}' for i, zeile in enumerate(brett)]
    return f'  {" ".join(str(i + 1) for i in range(groesse))}\\n{linie.join(zeilen)}'

def zug_spielen(brett, spieler):
    ...
`,
          tests: [
            {
              args: [
                [
                  [" ", " ", " "],
                  [" ", " ", " "],
                  [" ", " ", " "],
                ],
                "X",
              ],
              stdin: ["2", "1"],
              expected:
                "X ist am Zug:\n<Eingabe: 2>\n<Eingabe: 1>\n  1 2 3\n1  | | \n  -+-+-\n2 X| | \n  -+-+-\n3  | | \n",
            },
            {
              args: [
                [
                  ["X", " "],
                  [" ", " "],
                ],
                "O",
              ],
              stdin: ["2", "2"],
              expected:
                "O ist am Zug:\n<Eingabe: 2>\n<Eingabe: 2>\n  1 2\n1 X| \n  -+-\n2  |O\n",
            },
          ],
          solution: `def brett_formatieren(brett):
    groesse = len(brett)
    linie = f'\\n  {"+".join("-" * groesse)}\\n'
    zeilen = [f'{i + 1} {"|".join(zeile)}' for i, zeile in enumerate(brett)]
    return f'  {" ".join(str(i + 1) for i in range(groesse))}\\n{linie.join(zeilen)}'

def zug_spielen(brett, spieler):
    print(f'{spieler} ist am Zug:')
    zeile = int(input()) - 1
    spalte = int(input()) - 1
    brett[zeile][spalte] = spieler
    print(brett_formatieren(brett))`,
          hints: [
            "Der Ablauf: ankündigen, wer dran ist – Zeile einlesen – Spalte einlesen – Feld setzen – Brett ausgeben.",
            "Die Ankündigung lautet genau `X ist am Zug:` (mit Doppelpunkt).",
            "`input()` liefert einen String, du brauchst aber eine Zahl: `int(input())`.",
            "Und Spielende zählen ab 1, Python ab 0 – zieh also 1 ab.",
            "`zeile = int(input()) - 1`",
            "Das Feld setzt du mit `brett[zeile][spalte] = spieler`.",
            "Zum Schluss `print(brett_formatieren(brett))` – die Funktion ist schon vorgegeben.",
          ],
          text: `
Jetzt bringen wir beides zusammen. Schreib \`zug_spielen(brett, spieler)\`. Die Funktion soll:

1. ausgeben, wer am Zug ist – im Format \`X ist am Zug:\`
2. die **Zeilennummer** einlesen
3. die **Spaltennummer** einlesen
4. das entsprechende Feld mit dem Zeichen des Spielers belegen
5. das aktualisierte Brett ausgeben

Wichtig: Spielende geben Nummern **ab 1** an, Python zählt **ab 0**. Diese Umrechnung ist deine Aufgabe.

\`brett_formatieren\` ist bereits vorgegeben – in einer kompakteren Schreibweise, als du sie geschrieben hast. Sie tut aber genau dasselbe.
`,
          task: "Schreib `zug_spielen(brett, spieler)`.",
        },
      ],
      outro: `
Ausgezeichnet! Der Zug-Mechanismus steht.

Das Wichtigste hier war die Umrechnung zwischen **Menschenzählung** (ab 1) und **Pythonzählung** (ab 0). Solche Umrechnungen sind eine klassische Fehlerquelle – der berühmte *Off-by-one-Fehler*. Mach sie immer an genau **einer** Stelle, direkt beim Einlesen, dann kann später nichts mehr durcheinandergeraten.
`,
    },

    /* ================================================================== *
     *  6 – Brett bauen
     * ================================================================== */
    {
      id: "tictactoe/brett-bauen",
      title: "Ein leeres Brett bauen",
      summary: "Eine tückische Falle bei verschachtelten Listen.",
      steps: [
        {
          id: "naives-brett",
          kind: "run",
          surface: "editor",
          program: `zeile = [' '] * 3
brett = [zeile] * 3

for z in brett:
    print(z)

brett[0][0] = 'X'
print('Nach brett[0][0] = X:')
for z in brett:
    print(z)`,
          text: `
Ein Baustein fehlt noch: das leere Brett zu Spielbeginn.

Der naheliegende Versuch nutzt aus, dass man Listen mit \`*\` vervielfachen kann. Führ das aus – und schau genau hin, was am Ende passiert:

    zeile = [' '] * 3
    brett = [zeile] * 3

    for z in brett:
        print(z)

    brett[0][0] = 'X'
    print('Nach brett[0][0] = X:')
    for z in brett:
        print(z)
`,
          task: "Führ das Programm aus und achte auf die letzte Ausgabe.",
        },
        {
          id: "uebung-brett-bauen",
          kind: "exercise",
          mode: "return",
          functionName: "brett_bauen",
          params: ["groesse"],
          starter: `def brett_bauen(groesse):
    ...
`,
          tests: [
            {
              args: [2],
              expected: [
                [" ", " "],
                [" ", " "],
              ],
            },
            {
              args: [3],
              expected: [
                [" ", " ", " "],
                [" ", " ", " "],
                [" ", " ", " "],
              ],
            },
          ],
          solution: `def brett_bauen(groesse):
    brett = []
    for _ in range(groesse):
        zeile = []
        for _ in range(groesse):
            zeile.append(' ')
        brett.append(zeile)
    return brett`,
          hints: [
            "Das Problem ist, dass `[zeile] * 3` dreimal **dieselbe** Liste einträgt.",
            "Du musst für jede Zeile eine **eigene, neue** Liste erzeugen.",
            "Also: eine äußere Schleife über die Zeilen.",
            "Und darin jedes Mal eine frische Liste anlegen – `zeile = []`.",
            "Die füllst du mit einer inneren Schleife mit Leerzeichen.",
            "Am Ende jedes Durchlaufs hängst du sie ans Brett an.",
            "Die Kurzschreibweise `[' '] * groesse` ist übrigens erlaubt – sie erzeugt bei jedem Aufruf eine neue Liste. Nur `[zeile] * groesse` ist das Problem.",
          ],
          text: `
Huch! Ein einziges \`X\` erscheint in **allen drei** Zeilen.

Der Grund ist genau der aus Kapitel 6: \`[zeile] * 3\` erzeugt keine drei Zeilen, sondern trägt **dreimal dieselbe Liste** ein. Alle drei Einträge zeigen auf dasselbe Objekt – änderst du eines, änderst du alle.

Schreib \`brett_bauen(groesse)\` so, dass es ein quadratisches Brett aus lauter Leerzeichen liefert – mit **eigenständigen** Zeilen.

\`brett_bauen(2)\` soll also ergeben:

    [[' ', ' '], [' ', ' ']]
`,
          task: "Schreib `brett_bauen(groesse)` mit eigenständigen Zeilen.",
        },
      ],
      outro: `
Geschafft – und du hast dabei eine der gemeinsten Python-Fallen kennengelernt.

Merksatz: **\`*\` vervielfacht Verweise, nicht Inhalte.** Bei Listen aus Zahlen oder Strings ist das egal, weil man die ohnehin nicht verändern kann. Bei Listen **aus Listen** wird es gefährlich.

Erfahrene Entwicklerinnen schreiben dafür übrigens:

    [[' '] * groesse for _ in range(groesse)]

Das ist eine *List Comprehension* – eine Kurzschreibweise für genau deine Schleife. Du musst sie nicht können, aber du wirst sie überall sehen.
`,
    },

    /* ================================================================== *
     *  7 – Das ganze Spiel
     * ================================================================== */
    {
      id: "tictactoe/das-ganze-spiel",
      title: "Das ganze Spiel",
      summary: "Alle Bausteine zu einem spielbaren Tic-Tac-Toe zusammensetzen.",
      steps: [
        {
          id: "uebung-spiel",
          kind: "exercise",
          mode: "stdout",
          functionName: "spiel_spielen",
          params: ["brettgroesse", "spieler1", "spieler2"],
          starter: `${SPIEL_BAUSTEINE}

def spiel_spielen(brettgroesse, spieler1, spieler2):
    brett = brett_bauen(brettgroesse)
    print(brett_formatieren(brett))

    spieler = spieler1
    zug_spielen(brett, spieler)
    # … und weiter?
`,
          tests: [
            {
              args: [2, "A", "B"],
              stdin: ["1", "1", "1", "2", "2", "1"],
              expected: SPIEL_2X2,
            },
            {
              args: [3, "X", "O"],
              stdin: [
                "1", "1", "1", "2", "1", "3",
                "2", "2", "2", "1", "2", "3",
                "3", "2", "3", "1", "3", "3",
              ],
              expected: SPIEL_3X3_UNENTSCHIEDEN,
            },
          ],
          solution: `${SPIEL_BAUSTEINE}

def spiel_spielen(brettgroesse, spieler1, spieler2):
    brett = brett_bauen(brettgroesse)
    print(brett_formatieren(brett))

    spieler = spieler1
    for _ in range(brettgroesse * brettgroesse):
        zug_spielen(brett, spieler)

        if gewinner(brett):
            gewinner_ausgeben(spieler)
            return

        if spieler == spieler1:
            spieler = spieler2
        else:
            spieler = spieler1

    unentschieden_ausgeben()`,
          hints: [
            "Du brauchst eine Schleife, die abwechselnd Züge spielen lässt.",
            "Wie oft kann höchstens gezogen werden? Genau so oft, wie es Felder gibt.",
            "Bei einem Brett der Größe `n` sind das `n * n` Felder – also `for _ in range(brettgroesse * brettgroesse):`.",
            "Nach **jedem** Zug musst du prüfen, ob jemand gewonnen hat.",
            "Wenn ja: `gewinner_ausgeben(spieler)` aufrufen und mit `return` die Funktion beenden.",
            "Denk daran, was `return` in Kapitel 8 gemacht hat: Es beendet die **ganze** Funktion, samt Schleife. Genau das willst du hier.",
            "Danach ist der andere Spieler dran – das brauchst du ein `if`/`else`, das zwischen `spieler1` und `spieler2` umschaltet.",
            "Läuft die Schleife komplett durch, ohne dass jemand gewonnen hat, ist das Brett voll: `unentschieden_ausgeben()`.",
            "Diese letzte Zeile steht **außerhalb** der Schleife, ganz am Ende der Funktion.",
          ],
          text: `
Jetzt kommt alles zusammen! 🎉

Unten findest du alle Bausteine fertig vorgegeben – teils in kompakterer Schreibweise, als du sie entwickelt hast, aber inhaltlich identisch. **Ändere sie nicht.**

Deine Aufgabe ist \`spiel_spielen\`. Die aktuelle Fassung zeigt nur, wie das Spiel beginnt, und hört dann auf. Sie soll:

- für **jede** Brettgröße funktionieren,
- so lange abwechselnd Züge spielen lassen, bis das Spiel entschieden ist,
- am Ende entweder \`gewinner_ausgeben(spieler)\` aufrufen, wenn \`gewinner(brett)\` zutrifft,
- oder \`unentschieden_ausgeben()\`, wenn das Brett voll ist und niemand gewonnen hat.

Du darfst davon ausgehen, dass immer gültige Eingaben kommen – also Zahlen von 1 bis \`brettgroesse\`, die auf ein noch freies Feld zeigen.

**Tipp zum Vorgehen:** Überleg zuerst, wie oft überhaupt gezogen werden kann. Danach: Was muss nach jedem einzelnen Zug passieren?
`,
          task: "Vervollständige `spiel_spielen`.",
        },
      ],
      outro: `
## Du hast es geschafft! 🏆

Du hast ein vollständiges, spielbares Tic-Tac-Toe geschrieben – für Bretter beliebiger Größe, mit Gewinnerkennung, Unentschieden und Benutzereingaben.

Halt einen Moment inne und schau, was da alles drinsteckt:

| Baustein | Was du dafür brauchtest |
| --- | --- |
| \`gewinnlinie\`, \`zeilen_gewinner\` … | Schleifen, Vergleiche, boolesche Operatoren |
| \`brett_formatieren\` | Strings aufbauen, \`join\`, \`\\n\`, Typumwandlung |
| \`zug_spielen\` | \`input()\`, verschachtelte Listen, Zuweisung an Indizes |
| \`brett_bauen\` | verschachtelte Schleifen, Referenzen vs. Kopien |
| \`spiel_spielen\` | Schleife, \`if\`/\`else\`, \`return\`, Funktionsaufrufe |

Das ist kein Übungsprogramm mehr – das ist Software. Und das Wichtigste hast du nebenbei gelernt: **Ein großes Problem löst man, indem man es in kleine zerlegt, die man einzeln lösen und einzeln testen kann.**

### Wie geht es weiter?

Bau das Spiel aus! Ein paar Ideen, von einfach nach anspruchsvoll:

- Prüfe, ob das gewählte Feld schon belegt ist, und frag gegebenenfalls nochmal.
- Fang ungültige Eingaben ab (Buchstaben, Zahlen außerhalb des Bretts).
- Lass die Spielenden am Anfang ihre Namen und die Brettgröße wählen.
- Zähl mit, wer wie oft gewonnen hat.
- Bau einen einfachen Computergegner – zuerst einen, der zufällig zieht, dann einen, der einen möglichen Sieg auch erkennt.

Viel Spaß beim Weiterprogrammieren! 🚀
`,
    },
  ],
};
