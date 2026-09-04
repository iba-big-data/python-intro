import type { Chapter } from "../types";

export const shell: Chapter = {
  id: "shell",
  number: 1,
  title: "Die Shell",
  summary: "Dein Spielplatz: Code eintippen, Enter drücken, sofort ein Ergebnis sehen.",
  icon: "⚡",
  track: "basics",
  lessons: [
    {
      id: "shell/einstieg",
      title: "Erste Befehle",
      summary: "Python als Taschenrechner – und warum Ausprobieren hier nichts kaputt macht.",
      steps: [
        {
          id: "erster-ausdruck",
          kind: "run",
          surface: "shell",
          program: "1+2",
          text: `
Rechts siehst du die **Shell**. Das ist der Ort, an dem du kleine Stücke Python-Code laufen lassen kannst: Code eintippen, Enter drücken, fertig. Probier es gleich aus:

1. Klick irgendwo in die Shell (der dunkle Bereich).
2. Tippe \`1+2\`
3. Drück die Enter-Taste.
`,
          task: "Tippe `1+2` in die Shell und drücke Enter.",
        },
        {
          id: "weiterrechnen",
          kind: "experiment",
          surface: "shell",
          requireAst: ["Mult", "Div", "Sub"],
          example: "5 - 6",
          text: `
Sauber! Python hat \`1+2\` ausgerechnet und das Ergebnis \`3\` angezeigt.

Die Shell ist dein wichtigstes Werkzeug beim Lernen, und du solltest richtig viel Zeit darin verbringen. Sei neugierig! Frag dich ständig: "Was würde wohl passieren, wenn ich X ausführe?" – und beantworte die Frage sofort, indem du es ausprobierst.

**Du kannst hier nichts kaputt machen.** Wenn etwas schiefgeht, passiert genau nichts Schlimmes. Python meckert kurz, und du probierst weiter.

Rechne jetzt selbst noch ein bisschen. Multiplizieren geht mit \`*\`, dividieren mit \`/\` und subtrahieren mit \`-\`. Klammern \`(\` und \`)\` funktionieren auch.
`,
          task: "Führe eine Rechnung aus, die `*`, `/` oder `-` benutzt.",
          hints: [
            "Tippe zum Beispiel `5 - 6` oder `7 * 3` in die Shell.",
            "Zum Multiplizieren nimmt Python das Sternchen `*`, nicht den Buchstaben `x`.",
          ],
        },
      ],
      outro: `
Stark! Experimentier ruhig noch weiter – und wenn du bereit bist, geht's weiter.
`,
    },
    {
      id: "shell/verlauf",
      title: "Verlauf nutzen",
      summary: "Ein Tastendruck spart dir hundert Mal Tippen.",
      steps: [
        {
          id: "pfeiltasten",
          kind: "read",
          text: `
Ein Profi-Tipp, der dir ab jetzt sehr viel Tipparbeit spart:

Oft willst du Code, den du schon eingegeben hast, noch einmal ausführen – oder leicht verändert erneut probieren. Kopieren und Einfügen ist mühsam und bremst dich beim Experimentieren aus.

Drück stattdessen in der Shell die **Pfeil-nach-oben-Taste** ⬆️. Damit holst du dir die zuletzt eingegebene Zeile zurück. Drück sie mehrfach, um weiter in die Vergangenheit zu gehen – und **Pfeil nach unten** ⬇️, wenn du zu weit gegangen bist.

Probier es direkt in der Shell aus.
`,
        },
      ],
      outro: `
Merk dir diesen Trick. Du wirst ihn ab jetzt ständig brauchen.
`,
    },
  ],
};
