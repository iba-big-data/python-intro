import type { Chapter } from "../types";

export const stringsFortgeschritten: Chapter = {
  id: "strings-fortgeschritten",
  number: 7,
  title: "Strings, aber richtig",
  summary: "Anführungszeichen souverän einsetzen und Texte elegant zusammenbauen.",
  icon: "✍️",
  track: "basics",
  lessons: [
    /* ================================================================== *
     *  1 – Einfache und doppelte Anführungszeichen
     * ================================================================== */
    {
      id: "strings-fortgeschritten/anfuehrungszeichen",
      title: "Einfach oder doppelt?",
      summary: "Was tun, wenn im Text selbst ein Anführungszeichen steckt?",
      steps: [
        {
          id: "apostroph-problem",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `print('Alice's Café')`,
          text: `
Bisher hast du Strings immer mit einfachen Anführungszeichen geschrieben:

    name = 'Alice'

Solange nur harmlose Zeichen im Text stehen, geht das gut. Aber was, wenn der Text selbst ein Anführungszeichen enthält? Führ das hier aus:

    print('Alice's Café')
`,
          task: "Führ das (fehlerhafte) Programm aus und lies die Fehlermeldung.",
        },
        {
          id: "mit-doppelten-loesen",
          kind: "run",
          surface: "editor",
          program: `print("Alice's Café")`,
          text: `
Ein \`SyntaxError\`. Der Grund: Der Apostroph zählt als einfaches Anführungszeichen und **beendet** den String \`'Alice'\`. Der Rest, \`s Café'\`, ergibt für Python keinen Sinn mehr.

Zum Glück kennt Python noch eine zweite Schreibweise für Strings – mit **doppelten** Anführungszeichen \`"\`:

    print("Alice's Café")
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "beide-sind-gleich",
          kind: "run",
          surface: "shell",
          program: `'Alice' == "Alice"`,
          prediction: {
            choices: ["True", "False"],
            correctIndex: 0,
          },
          text: `
Denk immer daran: Anführungszeichen sind nur **Notation für Menschen**. Sie gehören nicht zum String selbst. Was ergibt das also?

    'Alice' == "Alice"
`,
          task: "Sag das Ergebnis voraus und führ es in der Shell aus.",
        },
        {
          id: "uebung-apostroph",
          kind: "exercise",
          mode: "stdout",
          params: [],
          tests: [
            {
              args: [],
              expected: "Sonderfälle sind nicht so speziell, dass sie's rechtfertigen, Regeln zu brechen.\n",
            },
          ],
          solution: `print("Sonderfälle sind nicht so speziell, dass sie's rechtfertigen, Regeln zu brechen.")`,
          hints: [
            "Wie definierst du den String – mit einfachen oder mit doppelten Anführungszeichen?",
            "Im Text kommt ein Apostroph vor (`sie's`). Also darfst du keine einfachen Anführungszeichen nehmen.",
            "Du brauchst genau einen String. Du musst nichts mit `+` zusammensetzen.",
          ],
          text: `
Python betrachtet beide Schreibweisen also als denselben String.

Jetzt du: Schreib ein Programm, das genau diese Zeile aus dem *Zen of Python* ausgibt:

    Sonderfälle sind nicht so speziell, dass sie's rechtfertigen, Regeln zu brechen.

Das Programm soll aus einer einzigen Zeile mit \`print()\` bestehen – ohne Variablen.
`,
          task: "Gib den Satz mit einem einzigen `print()` aus.",
        },
        {
          id: "uebung-doppeltes-zitat",
          kind: "exercise",
          mode: "stdout",
          params: [],
          tests: [
            {
              args: [],
              expected: '"Reden ist billig. Zeig mir den Code." – Linus Torvalds\n',
            },
          ],
          solution: `print('"Reden ist billig. Zeig mir den Code." – Linus Torvalds')`,
          hints: [
            "Denk einfach! Wie würdest du es normalerweise machen?",
            "Wenn ein String ein einfaches Anführungszeichen enthält, nimmst du doppelte zum Definieren.",
            "Was ist also, wenn der String doppelte Anführungszeichen enthält? Dann eben andersherum.",
          ],
          text: `
Ausgezeichnet!

Jetzt gib dieses Zitat exakt aus – **inklusive der Anführungszeichen**:

    "Reden ist billig. Zeig mir den Code." – Linus Torvalds

Auch hier: eine einzige Zeile mit \`print()\`, keine Variablen.
`,
          task: "Gib das Zitat samt Anführungszeichen mit einem `print()` aus.",
        },
      ],
      outro: `
Gut gemacht!

Meistens kannst du frei wählen, ob du \`'\` oder \`"\` benutzt – nimm einfach, was dir besser gefällt, und bleib dabei konsequent.

Die Regel greift nur, wenn im Text selbst ein Anführungszeichen vorkommt:

- Text enthält \`'\` → mit \`"\` definieren
- Text enthält \`"\` → mit \`'\` definieren

Und wenn beides vorkommt? Dann hilft ein Backslash: \`'Er sagte: "Alice\\'s Café"'\`. Das braucht man aber selten.
`,
    },

    /* ================================================================== *
     *  2 – f-Strings
     * ================================================================== */
    {
      id: "strings-fortgeschritten/f-strings",
      title: "f-Strings",
      summary: "Werte direkt in Text einsetzen – ohne Plus-Wüste.",
      steps: [
        {
          id: "erster-f-string",
          kind: "run",
          surface: "editor",
          program: `name = "Alice"
freundin = 'Bob'
mahlzeit = "Mittagessen"
print(f"{name} war mit {freundin} beim {mahlzeit}.")`,
          prediction: {
            choices: [
              "Alice war mit Bob beim Mittagessen.",
              "{name} war mit {freundin} beim {mahlzeit}.",
              'f"{name} war mit {freundin} beim {mahlzeit}."',
              "'Alice' war mit 'Bob' beim 'Mittagessen'.",
            ],
            correctIndex: 0,
          },
          text: `
Bisher hast du Strings mit \`+\` zusammengesetzt:

    name = "Alice"
    freundin = 'Bob'
    mahlzeit = "Mittagessen"
    print(name + " war mit " + freundin + " beim " + mahlzeit + ".")

Das wird schnell mühsam und unübersichtlich – man verzählt sich bei den Leerzeichen und übersieht ein \`+\`. Viel eleganter geht es mit einem **f-String**. Achte auf das \`f\` direkt vor dem Anführungszeichen:

    name = "Alice"
    freundin = 'Bob'
    mahlzeit = "Mittagessen"
    print(f"{name} war mit {freundin} beim {mahlzeit}.")
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "string-plus-zahl",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `name = "Alice"
alter = 20
print("Hallo " + name + ". Du bist " + alter + " Jahre alt.")`,
          text: `
Ein f-String beginnt mit \`f\`, danach folgt ein ganz normaler String. Alles in geschweiften Klammern \`{}\` wird durch den Wert der Variable ersetzt – automatisch in Text umgewandelt.

Und genau das ist der zweite große Vorteil: Zahlen und Strings lassen sich nicht einfach addieren. Führ das mal aus:

    name = "Alice"
    alter = 20
    print("Hallo " + name + ". Du bist " + alter + " Jahre alt.")
`,
          task: "Führ das Programm aus und lies die Fehlermeldung.",
        },
        {
          id: "uebung-f-string",
          kind: "exercise",
          mode: "stdout",
          params: ["name", "alter"],
          starter: `name = "Alice"
alter = 20
print("Hallo " + name + ". Du bist " + alter + " Jahre alt.")`,
          tests: [
            { args: ["Alice", 20], expected: "Hallo Alice. Du bist 20 Jahre alt.\n" },
            { args: ["Bob", 7], expected: "Hallo Bob. Du bist 7 Jahre alt.\n" },
          ],
          solution: `print(f"Hallo {name}. Du bist {alter} Jahre alt.")`,
          hints: [
            "Das ist genau wie im f-String-Beispiel von eben.",
            "Hast du das `f` vor dem Anführungszeichen vergessen?",
            "Wie viele Paare geschweifter Klammern brauchst du? Zwei – eines für `name`, eines für `alter`.",
          ],
          text: `
\`TypeError\` – zwischen dem String \`"Hallo Alice. Du bist "\` und der Zahl \`alter\` funktioniert \`+\` nicht.

Repariere das: Ersetz **alle** Verkettungen mit \`+\` durch einen einzigen f-String.
`,
          task: "Schreib die `print`-Zeile als f-String.",
        },
        {
          id: "ausdruecke-in-f-strings",
          kind: "run",
          surface: "shell",
          program: `f"2 * 3 + 4 ergibt {2 * 3 + 4}"`,
          text: `
In die geschweiften Klammern darf nicht nur ein Variablenname, sondern **jeder beliebige Python-Ausdruck**. Probier das in der Shell:

    f"2 * 3 + 4 ergibt {2 * 3 + 4}"
`,
          task: "Führ das in der Shell aus.",
        },
        {
          id: "uebung-kaputtes-programm",
          kind: "exercise",
          mode: "stdout",
          params: ["personen"],
          starter: `personen = ["Alice", "Bob", "Charlie"]
print('Es warten' + personen.length() + 'Leute, die erste heißt' + personen.1 + '.')`,
          tests: [
            {
              args: [["Alice", "Bob", "Charlie"]],
              expected: "Es warten 3 Leute, die erste heißt Alice.\n",
            },
            {
              args: [["Dan", "Evelyn", "Frank", "Georg"]],
              expected: "Es warten 4 Leute, die erste heißt Dan.\n",
            },
          ],
          solution: `print(f"Es warten {len(personen)} Leute, die erste heißt {personen[0]}.")`,
          hints: [
            "In dem Ausdruck innerhalb von `print` stecken gleich mehrere Fehler.",
            "Erstens: Die Anzahl der Elemente bekommt man nicht mit `.length()`.",
            "Sondern mit `len(personen)`.",
            "Zweitens: Auf ein Element greift man nicht mit `personen.1` zu.",
            "Sondern mit `personen[0]` – und denk daran, dass ab 0 gezählt wird.",
            "Drittens: Man kann Strings und Zahlen nicht mit `+` verbinden.",
            "Nimm einen f-String – dann lösen sich alle Probleme auf einmal. Hast du die geschweiften Klammern richtig gesetzt?",
          ],
          text: `
Wie du siehst, kann man f-Strings genauso mit doppelten Anführungszeichen schreiben. Und wie Anführungszeichen sind auch f-Strings reine Notation: Sobald der Ausdruck ausgewertet ist, weiß der Computer nicht mehr, dass da mal ein f-String stand – er hat nur noch das fertige Ergebnis.

Hier ist ein gründlich kaputtes Programm:

    personen = ["Alice", "Bob", "Charlie"]
    print('Es warten' + personen.length() + 'Leute, die erste heißt' + personen.1 + '.')

Repariere es! Deine Lösung muss für **jede** Liste von Namen funktionieren. Für das Beispiel oben soll herauskommen:

    Es warten 3 Leute, die erste heißt Alice.
`,
          task: "Repariere das Programm mit einem f-String.",
        },
      ],
      outro: `
Ausgezeichnet!

Ab jetzt darfst du überall f-Strings statt \`+\` benutzen – sie sind lesbarer, kürzer und ersparen dir die Typumwandlung. Profis machen es genauso.

Ein paar nützliche Extras für später:

    f"{preis:.2f}"      # Zahl mit 2 Nachkommastellen
    f"{name!r}"         # mit Anführungszeichen, wie die Shell es anzeigt
    f"{2 * 3 + 4 = }"   # gibt "2 * 3 + 4 = 10" aus – super zum Debuggen!
`,
    },
  ],
};
