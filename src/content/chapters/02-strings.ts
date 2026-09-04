import type { Chapter } from "../types";

export const strings: Chapter = {
  id: "strings",
  number: 2,
  title: "Strings",
  summary: "Text statt Zahlen: Zeichenketten anlegen und zusammensetzen.",
  icon: "✏️",
  track: "basics",
  lessons: [
    {
      id: "strings/einstieg",
      title: "Was ist ein String?",
      summary: "Anführungszeichen machen aus Text etwas, mit dem Python arbeiten kann.",
      steps: [
        {
          id: "hallo-welt",
          kind: "run",
          surface: "shell",
          program: "'hallo welt'",
          text: `
Python kann viel mehr als rechnen. Tatsächlich lassen wir Zahlen und Mathe jetzt erstmal links liegen. Stattdessen schauen wir uns **Strings** an – auf Deutsch: Zeichenketten. Ein String ist im Grunde ein Stück Text.

Gib Folgendes in die Shell ein, die Anführungszeichen (\`'\`) gehören dazu:

    'hallo welt'
`,
          task: "Tippe `'hallo welt'` in die Shell – mit Anführungszeichen.",
        },
      ],
      outro: `
Die Shell gibt einfach dasselbe zurück, weil es nichts weiter zu berechnen gibt. \`'hallo'\` ist eben genau \`'hallo'\`.

Ein String ist eine Folge von **Zeichen**. Ein Zeichen ist ein einzelnes Symbol: ein Buchstabe, eine Ziffer, ein Satzzeichen, ein Leerzeichen. Der String \`'hallo'\` enthält also 5 Zeichen.

Wichtig: Die Anführungszeichen gehören **nicht** zum String. Sie sagen Menschen und Computer nur: "Achtung, alles hier drin ist Text."
`,
    },
    {
      id: "strings/addieren",
      title: "Strings verbinden",
      summary: "Mit `+` klebst du Textstücke aneinander.",
      steps: [
        {
          id: "verketten",
          kind: "run",
          surface: "shell",
          program: "'hallo' + 'welt'",
          text: `
Strings lassen sich mit \`+\` zusammenfügen – auch wenn das etwas ganz anderes bedeutet als bei Zahlen. Probier mal:

    'hallo' + 'welt'
`,
          task: "Führe `'hallo' + 'welt'` in der Shell aus.",
        },
        {
          id: "mit-leerzeichen",
          kind: "experiment",
          surface: "shell",
          requireOutput: "hallo welt",
          example: "'hallo ' + 'welt'",
          text: `
Du siehst: \`+\` klebt zwei Strings direkt aneinander. Fachsprachlich heißt das **Konkatenation**.

Jetzt du: Ändere den Code von eben so ab, dass als Ergebnis \`'hallo welt'\` herauskommt – also **mit einem Leerzeichen** zwischen den Wörtern.

Übrigens: Wenn du irgendwo festhängst, findest du unter dem Editor jederzeit einen Tipp.
`,
          task: "Verbinde Strings mit `+`, sodass `'hallo welt'` herauskommt.",
          hints: [
            "Ein Leerzeichen ist auch nur ein Zeichen – es kann also mitten in einem String stehen.",
            "Du könntest das Leerzeichen ans Ende des ersten Strings hängen: `'hallo '`.",
            "Oder du fügst einen dritten String dazwischen ein, der nur aus einem Leerzeichen besteht.",
          ],
        },
      ],
      outro: `
Gut gemacht! Alle diese Lösungen sind richtig:

    'hallo ' + 'welt'
    'hallo' + ' welt'
    'hallo' + ' ' + 'welt'
`,
    },
  ],
};
