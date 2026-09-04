import type { Chapter } from "../types";

export const numpy: Chapter = {
  id: "numpy",
  number: 10,
  title: "NumPy",
  summary: "Rechnen mit Arrays und Matrizen – die Grundlage jeder Datenanalyse.",
  icon: "🔢",
  track: "data",
  lessons: [
    /* ================================================================== *
     *  1 – Grundlagen
     * ================================================================== */
    {
      id: "numpy/grundlagen",
      title: "Arrays erzeugen",
      summary: "Die wichtigste Datenstruktur der Datenanalyse kennenlernen.",
      steps: [
        {
          id: "numpy-importieren",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

print(np.__version__)`,
          text: `
Willkommen im Data-Analytics-Teil! Ab hier arbeitest du mit den Werkzeugen, die in Forschung und Industrie tatsächlich eingesetzt werden.

**NumPy** ist die Grundlagenbibliothek für numerische Berechnungen in Python. Sie stellt große, mehrdimensionale **Arrays** und Matrizen bereit sowie eine Sammlung mathematischer Funktionen, die darauf arbeiten. Praktisch jede andere Datenbibliothek – auch Pandas und scikit-learn – baut darauf auf.

Los geht's mit dem Import. Die Abkürzung \`np\` ist weltweit üblich, halte dich daran:

    import numpy as np

    print(np.__version__)

Beim ersten Mal dauert das einen Moment – die Bibliothek wird in deinen Browser geladen.
`,
          task: "Führ das Programm aus und warte, bis NumPy geladen ist.",
        },
        {
          id: "arrays-erzeugen",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

# Ein eindimensionales Array
array_1d = np.array([1, 2, 3, 4, 5])
print('array_1d:')
print(array_1d)

# Ein zweidimensionales Array
array_2d = np.array([[1, 2, 3], [4, 5, 6]])
print('array_2d:')
print(array_2d)`,
          text: `
Arrays speichern Sammlungen von Elementen – ähnlich wie Listen, aber mit zwei entscheidenden Unterschieden:

- Alle Elemente haben **denselben Datentyp**.
- Rechenoperationen sind dadurch um ein Vielfaches **schneller**.

Indizierung und Slicing funktionieren wie bei Listen. Ein Array erzeugst du mit \`np.array()\` aus einer Python-Liste:

    import numpy as np

    # Ein eindimensionales Array
    array_1d = np.array([1, 2, 3, 4, 5])
    print('array_1d:')
    print(array_1d)

    # Ein zweidimensionales Array
    array_2d = np.array([[1, 2, 3], [4, 5, 6]])
    print('array_2d:')
    print(array_2d)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "form-und-dimension",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Form des Arrays (Zeilen, Spalten)
print('shape:', array.shape)

# Anzahl der Dimensionen
print('ndim:', array.ndim)`,
          text: `
Beachte, wie das 2D-Array ausgegeben wird: als Tabelle mit zwei Zeilen und drei Spalten.

Zu jedem Array kannst du seine Eigenschaften abfragen. Am wichtigsten ist die **Form** (\`shape\`):

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Form des Arrays (Zeilen, Spalten)
    print('shape:', array.shape)

    # Anzahl der Dimensionen
    print('ndim:', array.ndim)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "groesse-und-typ",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Gesamtzahl der Elemente
print('size:', array.size)

# Datentyp der Elemente
print('dtype:', array.dtype)`,
          text: `
\`shape\` ist \`(2, 3)\`: zwei Zeilen, drei Spalten. Und \`ndim\` ist \`2\`, weil das Array zweidimensional ist.

Zwei weitere Eigenschaften brauchst du ständig: die Gesamtzahl der Elemente und den Datentyp.

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Gesamtzahl der Elemente
    print('size:', array.size)

    # Datentyp der Elemente
    print('dtype:', array.dtype)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Sehr gut! Deine vier Grundeigenschaften:

| Eigenschaft | Bedeutung |
| --- | --- |
| \`array.shape\` | Form, z. B. \`(2, 3)\` für 2 Zeilen × 3 Spalten |
| \`array.ndim\` | Anzahl der Dimensionen |
| \`array.size\` | Gesamtzahl der Elemente |
| \`array.dtype\` | Datentyp der Elemente, z. B. \`int64\` |

\`shape\` ist die mit Abstand wichtigste: Die meisten Fehler in der Datenanalyse sind Formfehler. Wenn etwas nicht funktioniert, ist \`print(array.shape)\` fast immer der erste sinnvolle Schritt.
`,
    },

    /* ================================================================== *
     *  2 – Fortgeschritten
     * ================================================================== */
    {
      id: "numpy/fortgeschritten",
      title: "Arrays aufbauen und zuschneiden",
      summary: "Fertige Arrays erzeugen, Elemente auswählen, Form ändern.",
      steps: [
        {
          id: "arrays-initialisieren",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

# Array voller Nullen
print('zeros:')
print(np.zeros((3, 3)))

# Array voller Einsen
print('ones:')
print(np.ones((2, 4)))

# Einheitsmatrix
print('eye:')
print(np.eye(3))

# Array mit Zufallswerten
print('random:')
print(np.random.random((2, 3)))

# Array mit einer Zahlenfolge
print('arange:')
print(np.arange(0, 10, 2))`,
          text: `
Arrays musst du selten von Hand hinschreiben. NumPy bietet mehrere Wege, sie fertig erzeugen zu lassen:

    import numpy as np

    # Array voller Nullen
    print('zeros:')
    print(np.zeros((3, 3)))

    # Array voller Einsen
    print('ones:')
    print(np.ones((2, 4)))

    # Einheitsmatrix
    print('eye:')
    print(np.eye(3))

    # Array mit Zufallswerten
    print('random:')
    print(np.random.random((2, 3)))

    # Array mit einer Zahlenfolge
    print('arange:')
    print(np.arange(0, 10, 2))
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "indizierung",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Ein einzelnes Element: zweite Zeile, dritte Spalte
element = array[1, 2]
print('element:', element)`,
          text: `
\`np.arange(0, 10, 2)\` funktioniert wie \`range\`: von 0 bis (ausschließlich) 10 in Zweierschritten.

Auf einzelne Elemente greifst du wie bei Listen zu – nur eleganter: Bei mehrdimensionalen Arrays schreibst du **alle Indizes in eine einzige Klammer**, durch Komma getrennt.

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Ein einzelnes Element: zweite Zeile, dritte Spalte
    element = array[1, 2]
    print('element:', element)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "slicing",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Teilbereich: erste beide Zeilen, Spalten 2 bis 3
teilarray = array[0:2, 1:3]
print('teilarray:')
print(teilarray)`,
          text: `
\`array[1, 2]\` ist also das Element in Zeile 1 und Spalte 2 – **beides ab 0 gezählt**, also die zweite Zeile und die dritte Spalte.

Mit **Slicing** greifst du auf ganze Bereiche zu. Die Schreibweise \`von:bis\` schließt \`von\` ein und \`bis\` aus:

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Teilbereich: erste beide Zeilen, Spalten 2 bis 3
    teilarray = array[0:2, 1:3]
    print('teilarray:')
    print(teilarray)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "umformen",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array_1d = np.array([1, 2, 3, 4, 5])
print('array_1d:', array_1d)
print('shape:', array_1d.shape)

# Aus 1D mach 2D
umgeformt = np.reshape(array_1d, (5, 1))
print('umgeformt:')
print(umgeformt)
print('shape:', umgeformt.shape)`,
          text: `
Die Form eines Arrays lässt sich jederzeit ändern, solange die Anzahl der Elemente gleich bleibt:

    import numpy as np

    array_1d = np.array([1, 2, 3, 4, 5])
    print('array_1d:', array_1d)
    print('shape:', array_1d.shape)

    # Aus 1D mach 2D
    umgeformt = np.reshape(array_1d, (5, 1))
    print('umgeformt:')
    print(umgeformt)
    print('shape:', umgeformt.shape)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Sehr gut! Achte auf den Unterschied zwischen \`(5,)\` und \`(5, 1)\`: Das erste ist eine flache Zahlenreihe, das zweite eine Spalte mit fünf Zeilen. Für dich sieht das ähnlich aus – für NumPy sind es verschiedene Dinge, und viele Bibliotheken bestehen auf der einen oder der anderen Form.

Ein Tipp, der dir Tipparbeit spart: Bei \`reshape\` darfst du eine Dimension als \`-1\` angeben. NumPy rechnet sie dann selbst aus:

    np.reshape(array_1d, (-1, 1))   # so viele Zeilen wie nötig, 1 Spalte
`,
    },

    /* ================================================================== *
     *  3 – Matrixoperationen
     * ================================================================== */
    {
      id: "numpy/matrizen",
      title: "Rechnen mit Arrays",
      summary: "Elementweise Operationen, Statistik und Matrixalgebra.",
      steps: [
        {
          id: "elementweise",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Elementweise Addition
print('array + 10:')
print(array + 10)

# Elementweise Multiplikation
print('array * 2:')
print(array * 2)

# Elementweise Quadrierung
print('array ** 2:')
print(array ** 2)`,
          text: `
Jetzt kommt der eigentliche Grund, warum es NumPy gibt. Rechenoperationen wirken **auf alle Elemente gleichzeitig** – ganz ohne Schleife:

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Elementweise Addition
    print('array + 10:')
    print(array + 10)

    # Elementweise Multiplikation
    print('array * 2:')
    print(array * 2)

    # Elementweise Quadrierung
    print('array ** 2:')
    print(array ** 2)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "statistik",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

print('mean:', np.mean(array))
print('sum:', np.sum(array))
print('min:', np.min(array))
print('max:', np.max(array))
print('std:', np.std(array))

# Spaltenweise statt über alles
print('Summe je Spalte:', np.sum(array, axis=0))
print('Summe je Zeile:', np.sum(array, axis=1))`,
          text: `
Halt kurz inne und mach dir klar, wie viel Arbeit dir das erspart: Um in reinem Python jedes Element eines 2D-Arrays zu verdoppeln, bräuchtest du zwei verschachtelte Schleifen. Hier steht \`array * 2\`.

Genauso einfach sind statistische Kennzahlen:

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    print('mean:', np.mean(array))
    print('sum:', np.sum(array))
    print('min:', np.min(array))
    print('max:', np.max(array))
    print('std:', np.std(array))

    # Spaltenweise statt über alles
    print('Summe je Spalte:', np.sum(array, axis=0))
    print('Summe je Zeile:', np.sum(array, axis=1))
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "transponieren",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6]])
print('array_2d:')
print(array_2d)
print('shape:', array_2d.shape)

# Zeilen und Spalten tauschen
print('transponiert:')
print(array_2d.T)
print('shape:', array_2d.T.shape)`,
          text: `
Merk dir \`axis\`: \`axis=0\` rechnet **über die Zeilen hinweg** (also spaltenweise), \`axis=1\` **über die Spalten hinweg** (also zeilenweise). Ohne \`axis\` wird über alles gerechnet.

Beim **Transponieren** werden Zeilen und Spalten vertauscht:

    import numpy as np

    array_2d = np.array([[1, 2, 3], [4, 5, 6]])
    print('array_2d:')
    print(array_2d)
    print('shape:', array_2d.shape)

    # Zeilen und Spalten tauschen
    print('transponiert:')
    print(array_2d.T)
    print('shape:', array_2d.T.shape)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "lineare-algebra",
          kind: "run",
          surface: "editor",
          program: `import numpy as np

array = np.array([[1, 2, 3], [4, 5, 6]])
print('array:')
print(array)

# Matrixmultiplikation (nicht elementweise!)
print('array @ array.T:')
print(np.dot(array, array.T))

quadratisch = array[:2, :2]
print('quadratisch:')
print(quadratisch)

# Determinante
print('Determinante:', np.linalg.det(quadratisch))

# Inverse
print('Inverse:')
print(np.linalg.inv(quadratisch))`,
          text: `
Für lineare Algebra bringt NumPy das komplette Programm mit. Wichtig ist der Unterschied zwischen \`*\` (elementweise) und \`np.dot\` bzw. \`@\` (echte Matrixmultiplikation):

    import numpy as np

    array = np.array([[1, 2, 3], [4, 5, 6]])
    print('array:')
    print(array)

    # Matrixmultiplikation (nicht elementweise!)
    print('array @ array.T:')
    print(np.dot(array, array.T))

    quadratisch = array[:2, :2]
    print('quadratisch:')
    print(quadratisch)

    # Determinante
    print('Determinante:', np.linalg.det(quadratisch))

    # Inverse
    print('Inverse:')
    print(np.linalg.inv(quadratisch))
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Gut gemacht!

Warum \`array.T\` bei der Matrixmultiplikation? Weil die Formen zusammenpassen müssen: \`(2, 3)\` mal \`(3, 2)\` ergibt \`(2, 2)\`. Ohne Transponieren würde NumPy sich beschweren – und zwar mit einer Fehlermeldung über die Formen. Du weißt jetzt, wo du dann als Erstes hinschaust.

NumPy ist riesig. Was du hier gelernt hast, deckt den Alltag ab – für alles andere lohnt sich ein Blick in die Dokumentation unter [numpy.org/doc](https://numpy.org/doc/stable/).
`,
    },

    /* ================================================================== *
     *  4 – Quiz
     * ================================================================== */
    {
      id: "numpy/quiz",
      title: "Zeig, was du kannst",
      summary: "Neun Aufgaben quer durch alles, was du über NumPy gelernt hast.",
      steps: [
        {
          id: "quiz-arange",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_1d = ?
print('array_1d: ')
print(array_1d)`,
          tests: [{ args: [], expected: "array_1d: \n[10 11 12 13 14 15 16 17 18 19 20]\n" }],
          solution: `import numpy as np

array_1d = np.arange(10, 21)
print('array_1d: ')
print(array_1d)`,
          hints: [
            "Für eine Zahlenfolge gibt es `np.arange`.",
            "`np.arange(start, stopp)` erzeugt die Zahlen von `start` bis **ausschließlich** `stopp`.",
            "Die 20 soll dabei sein – also musst du bis 21 gehen: `np.arange(10, 21)`.",
          ],
          text: `
Zeit für ein Quiz! In jeder Aufgabe ersetzt du das \`?\` durch den passenden Code.

**Aufgabe 1:** Erzeuge ein eindimensionales NumPy-Array mit den ganzen Zahlen von 10 bis 20 (einschließlich).
`,
          task: "Ersetze das `?` durch den passenden Code.",
        },
        {
          id: "quiz-eigenschaften",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6]])

form = ?
groesse = ?
dimensionen = ?
print(f"Form: {form}, Groesse: {groesse}, Dimensionen: {dimensionen}")`,
          tests: [{ args: [], expected: "Form: (2, 3), Groesse: 6, Dimensionen: 2\n" }],
          solution: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6]])

form = array_2d.shape
groesse = array_2d.size
dimensionen = array_2d.ndim
print(f"Form: {form}, Groesse: {groesse}, Dimensionen: {dimensionen}")`,
          hints: [
            "Die drei Eigenschaften stehen in der Tabelle am Ende der ersten Lektion.",
            "Es sind Eigenschaften, keine Funktionen – also ohne Klammern dahinter.",
            "`array_2d.shape`, `array_2d.size` und `array_2d.ndim`.",
          ],
          text: `
**Aufgabe 2:** Ermittle für \`array_2d\` die Form, die Anzahl der Elemente und die Anzahl der Dimensionen.
`,
          task: "Ersetze die drei `?`.",
        },
        {
          id: "quiz-slicing",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

teilarray = ?
print('teilarray:')
print(teilarray)`,
          tests: [{ args: [], expected: "teilarray:\n[[4 5]\n [7 8]]\n" }],
          solution: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

teilarray = array_2d[1:3, 0:2]
print('teilarray:')
print(teilarray)`,
          hints: [
            "Du brauchst Slicing mit zwei Bereichen: `array_2d[zeilen, spalten]`.",
            "Die 4 steht in Zeile 1, die 7 in Zeile 2 – du brauchst also die Zeilen 1 bis 2.",
            "Denk daran, dass die obere Grenze **nicht** dazugehört: `1:3`.",
            "Bei den Spalten brauchst du die ersten beiden: `0:2`.",
          ],
          text: `
**Aufgabe 3:** Schneide aus \`array_2d\` den Teilbereich \`[[4, 5], [7, 8]]\` heraus.
`,
          task: "Ersetze das `?` durch das passende Slicing.",
        },
        {
          id: "quiz-quadrieren",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_1d = np.array([1, 2, 3, 4, 5])

quadrate = ?
print('quadrate: ')
print(quadrate)`,
          tests: [{ args: [], expected: "quadrate: \n[ 1  4  9 16 25]\n" }],
          solution: `import numpy as np

array_1d = np.array([1, 2, 3, 4, 5])

quadrate = array_1d ** 2
print('quadrate: ')
print(quadrate)`,
          hints: [
            "Rechenoperationen wirken bei NumPy automatisch auf alle Elemente – du brauchst keine Schleife.",
            "Potenzieren geht in Python mit `**`.",
            "`array_1d ** 2`",
          ],
          text: `
**Aufgabe 4:** Quadriere jedes Element von \`array_1d\`.
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "quiz-full",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_2d = ?
print('array_2d: ')
print(array_2d)`,
          tests: [{ args: [], expected: "array_2d: \n[[7 7 7]\n [7 7 7]\n [7 7 7]]\n" }],
          solution: `import numpy as np

array_2d = np.full((3, 3), 7)
print('array_2d: ')
print(array_2d)`,
          hints: [
            "`np.zeros` und `np.ones` kennst du – für einen beliebigen Wert gibt es etwas Ähnliches.",
            "Die Funktion heißt `np.full`.",
            "`np.full(form, wert)` – also `np.full((3, 3), 7)`.",
          ],
          text: `
**Aufgabe 5:** Erzeuge ein 2D-Array der Form \`(3, 3)\`, in dem alle Elemente den Wert 7 haben.
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "quiz-reshape",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_1d = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])

neue_form = ?
print('neue_form:')
print(neue_form)`,
          tests: [{ args: [], expected: "neue_form:\n[[1 2 3]\n [4 5 6]\n [7 8 9]]\n" }],
          solution: `import numpy as np

array_1d = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9])

neue_form = array_1d.reshape(3, 3)
print('neue_form:')
print(neue_form)`,
          hints: [
            "Die Form ändert man mit `reshape`.",
            "Das geht als Funktion (`np.reshape(array, (3, 3))`) oder als Methode.",
            "`array_1d.reshape(3, 3)`",
          ],
          text: `
**Aufgabe 6:** Forme \`array_1d\` in eine 3×3-Matrix um.
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "quiz-statistik",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

mittelwert = ?
summe = ?
print(f"Mittelwert: {mittelwert}, Summe: {summe}")`,
          tests: [{ args: [], expected: "Mittelwert: 5.0, Summe: 45\n" }],
          solution: `import numpy as np

array_2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

mittelwert = np.mean(array_2d)
summe = np.sum(array_2d)
print(f"Mittelwert: {mittelwert}, Summe: {summe}")`,
          hints: [
            "Beide Funktionen hast du in der Lektion über das Rechnen kennengelernt.",
            "Gib kein `axis` an – gefragt ist der Wert über **alle** Elemente.",
            "`np.mean(array_2d)` und `np.sum(array_2d)`.",
          ],
          text: `
**Aufgabe 7:** Berechne den Mittelwert und die Summe aller Elemente von \`array_2d\`.
`,
          task: "Ersetze die beiden `?`.",
        },
        {
          id: "quiz-matrixmultiplikation",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

produkt = ?
print('produkt:')
print(produkt)`,
          tests: [{ args: [], expected: "produkt:\n[[19 22]\n [43 50]]\n" }],
          solution: `import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

produkt = np.dot(A, B)
print('produkt:')
print(produkt)`,
          hints: [
            "Achtung: `A * B` wäre elementweise – das ist hier nicht gemeint.",
            "Für echte Matrixmultiplikation gibt es `np.dot`.",
            "`np.dot(A, B)` – oder kürzer `A @ B`.",
          ],
          text: `
**Aufgabe 8:** Multipliziere die beiden Matrizen \`A\` und \`B\` miteinander (echte Matrixmultiplikation, nicht elementweise).
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "quiz-inverse",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import numpy as np

C = np.array([[1, 2], [3, 4]])

inverse_C = ?
print('inverse_C:')
print(inverse_C)`,
          tests: [{ args: [], expected: "inverse_C:\n[[-2.   1. ]\n [ 1.5 -0.5]]\n" }],
          solution: `import numpy as np

C = np.array([[1, 2], [3, 4]])

inverse_C = np.linalg.inv(C)
print('inverse_C:')
print(inverse_C)`,
          hints: [
            "Die Funktionen für lineare Algebra liegen im Untermodul `np.linalg`.",
            "Die Inverse berechnet `np.linalg.inv`.",
            "`np.linalg.inv(C)`",
          ],
          text: `
**Aufgabe 9:** Berechne die Inverse der Matrix \`C\`.
`,
          task: "Ersetze das `?`.",
        },
      ],
      outro: `
Alle neun geschafft – stark! 🎉

Damit hast du ein solides Fundament für NumPy. Du kannst Arrays erzeugen, ihre Form prüfen und ändern, Bereiche herausschneiden, elementweise rechnen, Statistiken bilden und mit Matrizen arbeiten.

Das nächste Kapitel baut direkt darauf auf: **Pandas** nimmt NumPy-Arrays und legt Spaltennamen darüber – damit wird aus Zahlensalat eine echte Tabelle.
`,
    },
  ],
};
