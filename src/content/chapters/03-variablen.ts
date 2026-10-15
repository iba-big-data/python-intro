import type { Chapter } from "../types";

export const variablen: Chapter = {
  id: "variablen",
  number: 3,
  title: "Variablen",
  summary: "Werte benennen, ändern und wiederverwenden – ab hier werden Programme interessant.",
  icon: "📦",
  track: "basics",
  lessons: [
    {
      id: "variablen/einfuehrung",
      title: "Was Variablen sind",
      summary: "Ein Name, hinter dem ein Wert steckt – und der Unterschied zu Anführungszeichen.",
      steps: [
        {
          id: "zuweisen",
          kind: "run",
          surface: "shell",
          program: "wort = 'Hallo'",
          text: `
Bisher haben wir immer mit denselben, fest eingetippten Werten gearbeitet. Für interessante Programme brauchen wir aber etwas, das auf Werte verweist, die vorher noch nicht feststehen und sich ändern können – Werte, die **variieren**. Genau dafür gibt es **Variablen**.

Führ diesen Code aus:

    wort = 'Hallo'

Das Gleichheitszeichen bedeutet hier nicht "ist gleich" im mathematischen Sinn. Lies es eher als: *"Merk dir unter dem Namen \`wort\` den Wert \`'Hallo'\`."*
`,
          task: "Führe `wort = 'Hallo'` in der Shell aus.",
        },
        {
          id: "name-in-anfuehrungszeichen",
          kind: "run",
          surface: "shell",
          program: "'wort'",
          prediction: {
            choices: ["wort", "'wort'", "Hallo", "'Hallo'"],
            correctIndex: 1,
          },
          text: `
Gut. Führ jetzt zum Vergleich \`'wort'\` in der Shell aus – **mit** Anführungszeichen.
`,
          task: "Führe `'wort'` in der Shell aus.",
        },
        {
          id: "unbekannter-name",
          kind: "run",
          expectsError: true,
          surface: "shell",
          program: "sonnenschein",
          prediction: {
            choices: ["sonnenschein", "'sonnenschein'", "Hallo", "eine Fehlermeldung"],
            correctIndex: 3,
          },
          text: `
Du siehst: Die Anführungszeichen machen den ganzen Unterschied. \`'wort'\` ist einfach nur \`'wort'\` – ein sogenanntes *String-Literal*, also ein wörtlich hingeschriebener Text. \`wort\` dagegen ist eine Variable, deren Wert alles Mögliche sein kann.

Genauso ist \`'sonnenschein'\` einfach \`'sonnenschein'\`. Aber was ist \`sonnenschein\` **ohne** Anführungszeichen?
`,
          task: "Führe `sonnenschein` in der Shell aus.",
        },
      ],
      outro: `
Die Antwort: \`sonnenschein\` sieht für Python wie ein Variablenname aus. Python sucht also nach einem Wert unter diesem Namen – und weil wir nie eine solche Variable angelegt haben, gibt es einen Fehler.

Merk dir diese Fehlermeldung. Der \`NameError\` ist einer der häufigsten Fehler überhaupt, und meistens steckt einfach ein Tippfehler dahinter.
`,
    },
    {
      id: "variablen/verwenden",
      title: "Variablen nutzen und `print()`",
      summary: "Eigene Variablen anlegen, Werte überschreiben und sauber ausgeben.",
      steps: [
        {
          id: "eigene-variable",
          kind: "experiment",
          surface: "shell",
          requireVariable: { name: "dein_name", type: "str", nonEmpty: true, noLeadingSpace: true },
          example: "dein_name = 'Alex'",
          text: `
Eben haben wir mit dieser Zeile eine Variable namens \`wort\` mit dem Wert \`'Hallo'\` angelegt:

    wort = 'Hallo'

Jetzt bist du dran: Leg eine Variable namens \`dein_name\` an, deren Wert ein beliebiger Text ist – zum Beispiel dein Vorname.

Das Zeichen \`_\` in \`dein_name\` heißt **Unterstrich**. Damit trennt man Wörter in Variablennamen, denn Leerzeichen sind darin nicht erlaubt. Auf den meisten Tastaturen tippst du ihn mit Umschalt (Shift) und der Bindestrich-Taste.
`,
          task: "Lege eine Variable `dein_name` mit einem Text als Wert an.",
          hints: [
            "Der Aufbau ist immer derselbe: erst der Name, dann `=`, dann der Wert.",
            "Der Wert muss ein String sein, also in Anführungszeichen stehen.",
            "Zum Beispiel: `dein_name = 'Alex'` – nimm ruhig deinen eigenen Namen.",
          ],
        },
        {
          id: "hallo-plus-name",
          kind: "run",
          surface: "shell",
          program: "'Hallo ' + dein_name",
          text: `
Variablen kannst du in Berechnungen genauso einsetzen wie fest hingeschriebene Werte. Probier zum Beispiel:

    'Hallo ' + dein_name
`,
          task: "Führe `'Hallo ' + dein_name` in der Shell aus.",
        },
        {
          id: "wert-aendern",
          kind: "run",
          surface: "shell",
          program: "wort = 'Tschüss'",
          text: `
Perfekt!

Variablen können ihren Wert im Lauf der Zeit ändern – daher der Name. Gerade hat \`wort\` den Wert \`'Hallo'\`. Du änderst ihn genau so, wie du ihn beim ersten Mal gesetzt hast:

    wort = 'Tschüss'
`,
          task: "Weise `wort` den neuen Wert `'Tschüss'` zu.",
        },
        {
          id: "wirkung-sehen",
          kind: "run",
          surface: "shell",
          program: "wort + ' ' + dein_name",
          text: `
Schau dir jetzt an, was die Änderung bewirkt hat. Führ dazu Folgendes aus:

    wort + ' ' + dein_name
`,
          task: "Führe `wort + ' ' + dein_name` aus.",
        },
        {
          id: "erstes-print",
          kind: "run",
          surface: "shell",
          program: "print(wort + ' ' + dein_name)",
          text: `
Diese Anführungszeichen um die Ergebnisse gehen langsam auf die Nerven. Probier mal das hier:

    print(wort + ' ' + dein_name)
`,
          task: "Führe `print(wort + ' ' + dein_name)` aus.",
        },
      ],
      outro: `
Hurra, keine Anführungszeichen mehr!

Was genau da passiert, sehen wir uns später noch im Detail an. Für den Moment reicht: \`print(<etwas>)\` zeigt \`<etwas>\` in der Shell an. Und zwar den **tatsächlichen Inhalt** eines Strings – nicht die Darstellung, die man bräuchte, um ihn wieder in Code zu schreiben.

Übrigens: Das englische Wort \`print\` heißt hier nicht "drucken" im Sinne von Papier. Es geht nur um Anzeigen auf dem Bildschirm.
`,
    },
    {
      id: "variablen/programme",
      title: "Erste echte Programme",
      summary: "Raus aus der Shell, rein in den Editor – mehrere Zeilen nacheinander.",
      steps: [
        {
          id: "hallo-welt-editor",
          kind: "run",
          surface: "editor",
          program: `wort = 'Hallo'
name = 'Welt'
print(wort + ' ' + name)
wort = 'Tschüss'
print(wort + ' ' + name)`,
          text: `
Zeit, die Shell nicht mehr für alles zu benutzen. Rechts ist jetzt der Reiter **Editor** offen. Dort schreibst du längere Programme. Die Shell bleibt super zum Ausprobieren – aber echte Programme leben im Editor.

Tippe das folgende Programm in den Editor und klick dann auf **Ausführen**:

    wort = 'Hallo'
    name = 'Welt'
    print(wort + ' ' + name)
    wort = 'Tschüss'
    print(wort + ' ' + name)
`,
          task: "Tippe das Programm in den Editor und führ es aus.",
        },
      ],
      outro: `
Glückwunsch, das war dein erstes richtiges Programm!

Nimm dir kurz Zeit, es zu verstehen. Python arbeitet die Zeilen **eine nach der anderen von oben nach unten** ab. Versuch, diesen Ablauf im Kopf nachzuspielen: Was macht jede einzelne Zeile? Wie hat sich der Wert von \`wort\` geändert, und was hat das bewirkt? Und: Bei mehreren \`print\`-Aufrufen landet jede Ausgabe in einer eigenen Zeile.

Drei Dinge, die du über den Editor wissen solltest:

1. **Programme starten bei null.** Vor jedem Lauf werden alle alten Variablen vergessen. Wenn du die erste Zeile löschst und nochmal ausführst, bekommst du einen Fehler, weil \`wort\` dann nicht existiert.
2. **Im Editor musst du \`print\` benutzen.** In der Shell wird der Wert einer Zeile automatisch angezeigt. Im Editor passiert das nicht. Schreibst du dort nur \`wort + ' ' + name\`, siehst du nichts.
3. **Die Reihenfolge ist alles.** Eine Variable muss angelegt sein, bevor du sie benutzt.

Probier diese drei Punkte am besten selbst einmal aus – kaputt geht nichts.
`,
    },
    {
      id: "variablen/berechnungen-speichern",
      title: "Ergebnisse zwischenspeichern",
      summary: "Warum eine Variable kein Tabellenkalkulations-Formel ist.",
      steps: [
        {
          id: "satz-bauen",
          kind: "run",
          surface: "editor",
          program: `wort = 'Hallo'
name = 'Welt'
satz = wort + ' ' + name
print(satz)`,
          prediction: {
            choices: [
              "satz",
              "wort + ' ' + name",
              "Hallo + ' ' + Welt",
              "'Hallo' + ' ' + 'Welt'",
              "Hallo Welt",
              "'Hallo Welt'",
            ],
            correctIndex: 4,
          },
          text: `
Sehr oft speicherst du das **Ergebnis einer Berechnung** in einer Variablen. Damit lassen sich größere Programme übersichtlich aufbauen. Probier dieses Programm:

    wort = 'Hallo'
    name = 'Welt'
    satz = wort + ' ' + name
    print(satz)
`,
          task: "Führ das Programm im Editor aus.",
        },
        {
          id: "satz-aendert-sich-nicht",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `wort = 'Hallo'
name = 'Welt'
satz = wort + ' ' + name
print(satz)
wort = 'Tschüss'
print(satz)`,
          prediction: {
            choices: [
              "Hallo Welt\nHallo Welt",
              "Hallo Welt\nTschüss Welt",
              "Tschüss Welt\nTschüss Welt",
            ],
            correctIndex: 0,
          },
          text: `
Jetzt hat \`satz\` den Wert \`'Hallo Welt'\` und du kannst ihn beliebig oft verwenden. Diesen Wert behält er so lange, bis er direkt neu zugewiesen wird – also bis irgendwo \`satz = <etwas>\` steht.

Häng die folgenden zwei Zeilen ans Ende deines Programms an:

    wort = 'Tschüss'
    print(satz)

Überleg vorher genau, was jetzt herauskommt.
`,
          task: "Ergänze die zwei Zeilen und führ das Programm aus.",
        },
      ],
      outro: `
Das ist ein wichtiger Unterschied zu einer Tabellenkalkulation: Dort aktualisiert sich eine Formel automatisch, wenn sich eine Zelle ändert.

In Python ist das **nicht** so. \`satz\` merkt sich nicht, wie er berechnet wurde. Er hat einmalig ein Ergebnis bekommen – und dabei bleibt es, egal was danach mit \`wort\` oder \`name\` passiert.
`,
    },
  ],
};
