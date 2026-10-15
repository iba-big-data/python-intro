import type { Chapter } from "../types";

export const bedingungen: Chapter = {
  id: "bedingungen",
  number: 5,
  title: "Bedingungen",
  summary: "Dein Programm trifft Entscheidungen: if, else, elif und Vergleiche.",
  icon: "🔀",
  track: "basics",
  lessons: [
    {
      id: "bedingungen/einfuehrung",
      title: "if und Wahrheitswerte",
      summary: "True, False – und Code, der nur manchmal läuft.",
      steps: [
        {
          id: "booleans",
          kind: "run",
          surface: "editor",
          program: `bedingung = True
print(bedingung)
bedingung = False
print(bedingung)`,
          text: `
Jetzt bringen wir dem Computer bei, **Entscheidungen** zu treffen und Code nur unter bestimmten Umständen auszuführen. Dafür brauchen wir einen neuen Datentyp.

Du kennst schon Zahlen und Strings – jetzt kommen **Wahrheitswerte** (englisch *booleans*, nach dem Mathematiker George Boole). Davon gibt es genau zwei: \`True\` und \`False\`. Beachte die Großschreibung, die ist Pflicht.

Führ dieses Programm aus:

    bedingung = True
    print(bedingung)
    bedingung = False
    print(bedingung)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "erste-if",
          kind: "run",
          surface: "editor",
          program: `if True:
    print('Das wird ausgegeben')

if False:
    print('Das nicht')`,
          text: `
Wahrheitswerte sind vor allem für **if-Anweisungen** gedacht (auch *Verzweigungen* oder *Bedingungen* genannt).

Hier ein einfaches Beispiel zum Ausführen:

    if True:
        print('Das wird ausgegeben')

    if False:
        print('Das nicht')
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "begeistert",
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
begeistert = True
if begeistert:
    satz += '!'
print(satz)`,
          prediction: {
            choices: ["Hallo Welt", "Hallo Welt!"],
            correctIndex: 1,
          },
          text: `
Beachte: Der Code im ersten \`if\` lief, der im zweiten nicht.

Allgemein sieht eine \`if\`-Anweisung so aus:

    if <bedingung>:
        <rumpf>

Dabei ist \`<bedingung>\` irgendein Ausdruck, der zu einem Wahrheitswert wird, und \`<rumpf>\` eine **eingerückte** Liste von einer oder mehreren Anweisungen. Der Aufbau ähnelt der \`for\`-Schleife sehr – auch hier ist der Doppelpunkt \`:\` Pflicht.

Wenn der Computer \`if <bedingung>:\` sieht, prüft er, ob die Bedingung \`True\` ist. Wenn ja, läuft der Rumpf. Wenn nein, wird er übersprungen und es geht danach weiter.

Hier ein interessanteres Beispiel:

    satz = 'Hallo Welt'
    begeistert = True
    if begeistert:
        satz += '!'
    print(satz)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "begeistert-false",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
begeistert = False
if begeistert:
    satz += '!'
print(satz)`,
          prediction: {
            choices: ["Hallo Welt", "Hallo Welt!"],
            correctIndex: 0,
          },
          text: `
(Erinnerung: \`satz += '!'\` bedeutet dasselbe wie \`satz = satz + '!'\`.)

Ändere jetzt \`begeistert = True\` zu \`begeistert = False\` und führ das Programm nochmal aus.
`,
          task: "Setze `begeistert` auf `False` und führ das Programm aus.",
        },
        {
          id: "verwirrt-uebung",
          carryOver: true,
          kind: "exercise",
          mode: "stdout",
          params: ["satz", "begeistert", "verwirrt"],
          starter: `satz = 'Hallo Welt'
begeistert = False
verwirrt = True

if begeistert:
    satz += '!'
print(satz)`,
          tests: [
            { args: ["Hallo", true, true], expected: "Hallo!?" },
            { args: ["Hallo zusammen", true, false], expected: "Hallo zusammen!" },
            { args: ["Mir ist langweilig", false, false], expected: "Mir ist langweilig" },
            { args: ["Wer bist du", false, true], expected: "Wer bist du?" },
          ],
          solution: `if begeistert:
    satz += '!'
if verwirrt:
    satz += '?'
print(satz)`,
          hints: [
            "Du musst dem bestehenden Programm nur ein paar Zeilen hinzufügen. Alles Vorhandene bleibt stehen.",
            "Der neue Code sieht dem vorhandenen sehr ähnlich.",
            "Ein zweites `if` mit `verwirrt` als Bedingung – und darin `satz += '?'`.",
            "Wichtig: Die beiden `if` stehen nacheinander, nicht ineinander. Dann können auch beide zutreffen.",
          ],
          text: `
Zeit für eine Übung. Erweitere das Programm um einen zweiten Wahrheitswert \`verwirrt\`, sodass es so beginnt:

    satz = 'Hallo Welt'
    begeistert = False
    verwirrt = True

(\`satz\` darf ein beliebiger String sein, die beiden Wahrheitswerte je \`True\` oder \`False\`.)

Wenn \`verwirrt\` wahr ist, soll an den ausgegebenen Satz ein Fragezeichen angehängt werden. Sind **beide** wahr, soll der Satz auf \`!?\` enden.
`,
          task: "Ergänze die Behandlung von `verwirrt`.",
        },
      ],
      outro: `
Gut gemacht! Dieses Programm kann jetzt vier verschiedene Dinge tun – je nachdem, wie du \`begeistert\` und \`verwirrt\` kombinierst. Probier ruhig alle vier durch.
`,
    },
    {
      id: "bedingungen/verschachteln",
      title: "Schleife und Bedingung kombinieren",
      summary: "Zusammengesetzte Anweisungen dürfen ineinander stecken.",
      steps: [
        {
          id: "for-in-if",
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
begeistert = True

if begeistert:
    neuer_satz = ''
    for zeichen in satz:
        neuer_satz += zeichen + '!'
    satz = neuer_satz

print(satz)`,
          prediction: {
            choices: [
              "Hallo Welt",
              "Hallo Welt!",
              "Hallo Welt!!!!!!!!!!",
              "H!a!l!l!o! !W!e!l!t!",
              "!H!a!l!l!o! !W!e!l!t",
            ],
            correctIndex: 3,
          },
          text: `
Zusammengesetzte Anweisungen wie \`for\`-Schleifen und \`if\`-Anweisungen haben einen Rumpf aus weiteren Anweisungen. Und diese inneren Anweisungen können alles Mögliche sein – auch wieder zusammengesetzte Anweisungen.

Hier eine \`for\`-Schleife **innerhalb** einer \`if\`-Anweisung, für den Fall, dass du *wirklich* begeistert bist:

    satz = 'Hallo Welt'
    begeistert = True

    if begeistert:
        neuer_satz = ''
        for zeichen in satz:
            neuer_satz += zeichen + '!'
        satz = neuer_satz

    print(satz)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Sieh dir die Einrückung genau an: Der Rumpf des \`if\` (4 Zeilen) ist wie gewohnt um 4 Leerzeichen eingerückt. Der Rumpf der \`for\`-Schleife (1 Zeile) ist um **weitere** 4 Leerzeichen eingerückt – insgesamt also 8. Allein an der Einrückung erkennst du die Struktur des Programms.

Umgekehrt geht es genauso – ein \`if\` innerhalb einer \`for\`-Schleife:

    satz = 'Hallo Welt'
    begeistert = True

    neuer_satz = ''
    for zeichen in satz:
        neuer_satz += zeichen
        if begeistert:
            neuer_satz += '!'

    satz = neuer_satz
    print(satz)

Beide Programme liefern exakt dasselbe Ergebnis. Das erste ist allerdings effizienter: Es läuft nur dann durch den String, wenn es überhaupt nötig ist. Bei \`begeistert = False\` passiert dort schlicht gar nichts.
`,
    },
    {
      id: "bedingungen/nachvollziehen",
      title: "Programme im Kopf durchspielen",
      summary: "Die wichtigste Fähigkeit überhaupt: Zeile für Zeile mitdenken.",
      steps: [
        {
          id: "ablauf-lesen",
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
uebernehmen = False
neuer_satz = ''
for zeichen in satz:
    if uebernehmen:
        neuer_satz += zeichen
    uebernehmen = True

print(neuer_satz)`,
          text: `
Die wertvollste Fähigkeit beim Programmieren ist nicht Tippen, sondern **Nachvollziehen**: im Kopf durchgehen, was der Computer Zeile für Zeile tut.

Nimm dieses Programm und geh es einmal komplett durch, **bevor** du es ausführst:

    satz = 'Hallo Welt'
    uebernehmen = False
    neuer_satz = ''
    for zeichen in satz:
        if uebernehmen:
            neuer_satz += zeichen
        uebernehmen = True

    print(neuer_satz)

So läuft es ab:

| Durchlauf | \`zeichen\` | \`uebernehmen\` am Anfang | wird angehängt? | \`neuer_satz\` danach |
|---|---|---|---|---|
| 1 | \`'H'\` | \`False\` | nein | \`''\` |
| 2 | \`'a'\` | \`True\` | ja | \`'a'\` |
| 3 | \`'l'\` | \`True\` | ja | \`'al'\` |
| … | … | … | … | … |

Im ersten Durchlauf ist \`uebernehmen\` noch \`False\`, deshalb wird das \`H\` übersprungen. Danach steht \`uebernehmen\` dauerhaft auf \`True\` – also landen alle weiteren Zeichen im Ergebnis.

Führ das Programm jetzt aus und prüf, ob deine Vorhersage stimmt.
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "nur-erstes-zeichen",
          carryOver: true,
          kind: "exercise",
          mode: "stdout",
          params: ["satz"],
          tests: [
            { args: ["Hallo zusammen"], expected: "H" },
            { args: ["Tschüss"], expected: "T" },
          ],
          solution: `uebernehmen = True
neuer_satz = ''
for zeichen in satz:
    if uebernehmen:
        neuer_satz += zeichen
    uebernehmen = False

print(neuer_satz)`,
          hints: [
            "Der Code bleibt fast gleich – zwei kleine Änderungen genügen.",
            "Der Code in `if uebernehmen:` soll gleich im **ersten** Durchlauf laufen. Was muss `uebernehmen` am Anfang also sein?",
            "Und nach dem ersten Durchlauf soll er **nicht mehr** laufen. Was muss dann passieren?",
            "Genau umgekehrt zum Original: `uebernehmen = True` am Anfang, `uebernehmen = False` in der Schleife.",
          ],
          text: `
Jetzt bau das Programm so um, dass es genau das Gegenteil tut: **nur** das erste Zeichen ausgeben, den Rest weglassen.
`,
          task: "Gib nur das erste Zeichen aus.",
        },
      ],
      outro: `
Sehr gut! Du arbeitest mit immer komplexeren Programmen.

Ein Tipp für den Alltag: Wenn du nicht verstehst, was ein Programm tut, streu großzügig \`print(...)\` ein. Gib damit die Werte deiner Variablen an verschiedenen Stellen aus. Das ist keine Notlösung, sondern ein Werkzeug, das auch Profis ständig benutzen.
`,
    },
    {
      id: "bedingungen/else",
      title: "else – der andere Fall",
      summary: "Entweder das eine oder das andere. Und ein Klassiker unter den Fehlern.",
      steps: [
        {
          id: "erstes-else",
          kind: "run",
          surface: "editor",
          program: `bedingung = True
if bedingung:
    print('Ja')
else:
    print('Nein')`,
          text: `
Eine \`if\`-Anweisung kann optional einen \`else\`-Teil haben. Führ dieses Beispiel aus:

    bedingung = True
    if bedingung:
        print('Ja')
    else:
        print('Nein')
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "erstes-else-false",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `bedingung = False
if bedingung:
    print('Ja')
else:
    print('Nein')`,
          text: `
Ändere jetzt die erste Zeile zu \`bedingung = False\` und führ es nochmal aus.
`,
          task: "Setze `bedingung` auf `False`.",
        },
        {
          id: "upper-lower",
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
begeistert = True
if begeistert:
    satz = satz.upper()
else:
    satz = satz.lower()
print(satz)`,
          text: `
Denk bei \`else\` an "andernfalls" oder "sonst". Ist die Bedingung im \`if\` falsch, läuft stattdessen der \`else\`-Rumpf. Egal wie die Bedingung ausfällt: **Genau einer** der beiden Rümpfe läuft immer.

Hier ein interessanteres Beispiel:

    satz = 'Hallo Welt'
    begeistert = True
    if begeistert:
        satz = satz.upper()
    else:
        satz = satz.lower()
    print(satz)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "upper-lower-false",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `satz = 'Hallo Welt'
begeistert = False
if begeistert:
    satz = satz.upper()
else:
    satz = satz.lower()
print(satz)`,
          text: `
\`satz.upper()\` ist eine neue Art von Ausdruck. Was hier passiert: \`satz\` ist ein String, und Strings haben verschiedene **Methoden**, mit denen sich bequem neue Werte berechnen lassen – darunter \`upper\` und \`lower\` (für Groß- bzw. Kleinbuchstaben).

\`'Hallo Welt'.upper()\` ergibt \`'HALLO WELT'\`. Der Inhalt von \`satz\` selbst ändert sich dadurch aber **nicht** – deshalb musst du das Ergebnis mit \`satz = satz.upper()\` wieder zuweisen.

Setz jetzt \`begeistert\` auf \`False\` und führ es erneut aus.
`,
          task: "Setze `begeistert` auf `False`.",
        },
        {
          id: "undefinierte-variable",
          // Kein carryOver: dieser Schritt zeigt ein neues, absichtlich
          // kaputtes Programm und baut nicht auf dem vorherigen auf.
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: `satz = 'Hallo Welt'
begeistert = False

if begeistert:
    zeichen = '!'
satz += zeichen

print(satz)`,
          text: `
Hier ist ein kaputtes Programm:

    satz = 'Hallo Welt'
    begeistert = True

    if begeistert:
        zeichen = '!'
    satz += zeichen

    print(satz)

Siehst du das Problem? Wenn du es so ausführst, sieht alles gut aus. Was könnte schiefgehen?

*Überleg erst selbst. Die Auflösung steht im nächsten Absatz.*

Genau: Was passiert, wenn \`begeistert\` auf \`False\` steht? Probier es aus – setz \`begeistert = False\` und führ es aus.
`,
          task: "Führ die Variante mit `begeistert = False` aus.",
        },
        {
          id: "else-punkt",
          carryOver: true,
          kind: "exercise",
          mode: "stdout",
          params: ["satz", "begeistert"],
          starter: `satz = 'Hallo Welt'
begeistert = False

if begeistert:
    zeichen = '!'
satz += zeichen

print(satz)`,
          tests: [
            { args: ["Hallo zusammen", true], expected: "Hallo zusammen!" },
            { args: ["Tschüss", false], expected: "Tschüss." },
          ],
          solution: `if begeistert:
    zeichen = '!'
else:
    zeichen = '.'
satz += zeichen

print(satz)`,
          hints: [
            "Ändere nichts am Bestehenden, füg nur etwas hinzu.",
            "`else` muss direkt nach dem `if`-Rumpf stehen, ohne etwas dazwischen.",
            "`satz += zeichen` soll in **beiden** Fällen laufen – lass es also draußen.",
            "Benutze `else`, um `zeichen` einen anderen Wert zu geben.",
            "Ist `begeistert` falsch, soll `zeichen` eben `'.'` sein statt `'!'`.",
          ],
          text: `
Ist \`begeistert\` wahr, wird \`zeichen\` angelegt und alles läuft. Andernfalls bekommt \`zeichen\` **nie** einen Wert – und \`satz += zeichen\` scheitert mit einem \`NameError\`.

Das ist ein sehr typischer Anfängerfehler: Eine Variable wird nur in einem Zweig angelegt, aber danach immer benutzt.

Repariere das mit einem \`else\`: Ist \`begeistert\` falsch, soll statt des Ausrufezeichens ein **Punkt** (\`.\`) ans Satzende kommen.
`,
          task: "Ergänze ein `else`, das einen Punkt anhängt.",
        },
        {
          id: "gross-klein",
          kind: "exercise",
          mode: "stdout",
          params: ["satz"],
          tests: [
            { args: ["HALLO ZUSAMMEN"], expected: "Hallo zusammen" },
            { args: ["tschüss"], expected: "Tschüss" },
          ],
          solution: `gross = True
neuer_satz = ''
for zeichen in satz:
    if gross:
        zeichen = zeichen.upper()
    else:
        zeichen = zeichen.lower()
    neuer_satz += zeichen
    gross = False

print(neuer_satz)`,
          hints: [
            "Du hast alles Nötige schon gelernt. Schau dir frühere Programme zur Inspiration an.",
            "Du brauchst eine Schleife, die den neuen Satz Zeichen für Zeichen aufbaut.",
            "Und ein `if/else`, das entscheidet: Groß- oder Kleinbuchstabe?",
            "Die Bedingung muss sich im Lauf der Schleife ändern – also eine Variable, die innerhalb der Schleife neu gesetzt wird.",
            "Im ersten Durchlauf brauchst du einen Großbuchstaben, danach immer Kleinbuchstaben.",
          ],
          text: `
Zeit für eine Herausforderung!

Schreib ein Programm, das zu einem gegebenen String \`satz\` eine veränderte Fassung ausgibt: **der erste Buchstabe groß, alle übrigen klein**.

Bei \`satz = 'hallo welt'\` genauso wie bei \`'HALLO WELT'\` soll also \`Hallo welt\` herauskommen.
`,
          task: "Schreib den Satz mit großem Anfangsbuchstaben.",
        },
        {
          id: "spongebob",
          kind: "exercise",
          mode: "stdout",
          params: ["satz"],
          tests: [
            {
              args: ["Noch eine Übung, dann kannst du entspannen."],
              expected: "NoCh eInE ÜbUnG, dAnN KaNnSt dU EnTsPaNnEn.",
            },
            { args: ["hallo welt"], expected: "HaLlO WeLt" },
          ],
          solution: `gross = True
neuer_satz = ''
for zeichen in satz:
    if gross:
        zeichen = zeichen.upper()
        gross = False
    else:
        zeichen = zeichen.lower()
        gross = True
    neuer_satz += zeichen

print(neuer_satz)`,
          hints: [
            "Ähnlich wie die Aufgabe davor. Der Unterschied liegt darin, **wann** du die Bedingungsvariable umsetzt.",
            "Du brauchst einen Wahrheitswert, der sich in **jedem** Durchlauf umdreht.",
            "Schreib zuerst ein Miniprogramm, das eine Variable umkippt: aus `True` wird `False` und umgekehrt. Ohne Schleife, nur mit `if/else`.",
            "Dazu benutzt du die Variable in der `if`-Bedingung und weist ihr im Rumpf einen neuen Wert zu.",
            "Kombiniere dieses Umkippen mit dem `if/else`, das groß oder klein wählt – beides im selben Rumpf.",
          ],
          text: `
Ausgezeichnet!

Noch eine Übung, dann kannst du entspannen.

Schreib ein Programm, das \`satz\` in spöttischer Schreibweise ausgibt, zum Beispiel:

    NoCh eInE ÜbUnG, dAnN KaNnSt dU EnTsPaNnEn.

Jedes zweite Zeichen wird kleingeschrieben, der Rest groß – beginnend mit einem Großbuchstaben.
`,
          task: "Schreib den Satz abwechselnd groß und klein.",
        },
      ],
      outro: `
Perfekt! Nimm dir einen Moment, um stolz auf dich zu sein. Merkst du, wie dein Gehirn wächst?
`,
    },
    {
      id: "bedingungen/gleichheit",
      title: "Der Gleichheitsoperator",
      summary: "`==` vergleicht, `=` weist zu – ein Zeichen Unterschied, ein Welten-Unterschied.",
      steps: [
        {
          id: "gleichheit",
          kind: "run",
          surface: "editor",
          program: `print(1 + 2 == 3)
print(4 + 5 == 6)
print('ab' + 'c' == 'a' + 'bc')`,
          text: `
Es gibt mehrere Wege, an Wahrheitswerte zu kommen, ohne sie direkt hinzuschreiben. Damit lassen sich richtig nützliche \`if\`-Anweisungen bauen.

Besonders wichtig sind **Vergleichsoperatoren**. Der häufigste ist der Gleichheitsoperator, der prüft, ob zwei Werte gleich sind. Er wird mit **zwei** Gleichheitszeichen geschrieben: \`==\`.

Probier das aus:

    print(1 + 2 == 3)
    print(4 + 5 == 6)
    print('ab' + 'c' == 'a' + 'bc')
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "gleich-vs-zuweisung",
          kind: "run",
          surface: "editor",
          expectsError: true,
          program: "print(1 + 2 = 3)",
          text: `
Du siehst: Sind die Werte gleich, ergibt der Vergleich \`True\`, sonst \`False\`.

Achte auf den Unterschied zwischen dem Gleichheitsoperator \`==\` und einem einzelnen \`=\`. Die beiden bedeuten etwas völlig Verschiedenes: \`=\` weist zu, \`==\` vergleicht.

Was passiert, wenn du ein \`=\` weglässt? Probier es:

    print(1 + 2 = 3)
`,
          task: "Führ den fehlerhaften Code aus und lies die Meldung.",
        },
        {
          id: "zeichen-ersetzen",
          kind: "run",
          surface: "editor",
          program: `name = 'kesha'
neuer_name = ''
for c in name:
    if c == 's':
        c = '$'
    neuer_name += c

print(neuer_name)`,
          text: `
Setzen wir \`==\` in einer \`if\`-Anweisung ein. In diesem Programm läuft der \`if\`-Rumpf nur dann, wenn \`c\` gerade das Zeichen \`'s'\` ist:

    name = 'kesha'
    neuer_name = ''
    for c in name:
        if c == 's':
            c = '$'
        neuer_name += c

    print(neuer_name)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "leetspeak",
          carryOver: true,
          kind: "exercise",
          mode: "stdout",
          params: ["name"],
          tests: [
            { args: ["kesha"], expected: "k3$h@" },
            { args: ["alex"], expected: "@l3x" },
          ],
          solution: `neuer_name = ''
for c in name:
    if c == 'e':
        c = '3'
    if c == 's':
        c = '$'
    if c == 'a':
        c = '@'
    neuer_name += c

print(neuer_name)`,
          hints: [
            "Du musst nur ein paar Zeilen ergänzen, die den vorhandenen sehr ähnlich sehen.",
            "Für jeden Buchstaben ein eigenes `if` – alle nacheinander, alle im Schleifenrumpf.",
          ],
          text: `
Erweitere das Programm jetzt so, dass es zusätzlich \`e\` durch \`3\` und \`a\` durch \`@\` ersetzt.
`,
          task: "Ersetze zusätzlich `e` durch `3` und `a` durch `@`.",
        },
      ],
      outro: `
Gut gemacht!
`,
    },
    {
      id: "bedingungen/elif",
      title: "elif – Ketten von Bedingungen",
      summary: "Ein Ausflug in die Molekularbiologie, mit Nebenwirkung: verschachtelte Bedingungen.",
      steps: [
        {
          id: "dna-kaputt",
          kind: "run",
          surface: "editor",
          program: `dna = 'AGTAGCGTC'
gegenstrang = ''
for zeichen in dna:
    if zeichen == 'A':
        zeichen = 'T'
    if zeichen == 'T':
        zeichen = 'A'
    if zeichen == 'G':
        zeichen = 'C'
    if zeichen == 'C':
        zeichen = 'G'
    gegenstrang += zeichen

print(gegenstrang)`,
          text: `
Kleiner Biologie-Exkurs! Die meisten Zellen deines Körpers enthalten deinen kompletten genetischen Code als DNA. Die besteht aus Strängen von Bausteinen, den **Nukleobasen**, und davon gibt es vier Sorten: Adenin, Cytosin, Guanin und Thymin – kurz A, C, G und T.

Ein Ausschnitt aus einem Strang könnte so aussehen:

    AGTAGCGTCCTTAGTTACAGGATGGCTTAT...

Dazu gehört ein Gegenstrang, in dem A durch T ersetzt ist und umgekehrt, sowie C durch G und umgekehrt:

    TCATCGCAGGAATCAATGTCCTACCGAATA...

Beide Stränge sind zur berühmten **Doppelhelix** verdrillt, zusammengehalten von den Paaren A–T und C–G. Genau diese Paarung macht es möglich, die DNA zu kopieren, wenn sich Zellen teilen.

Genau diesen Vorgang bauen wir jetzt nach. Probieren wir es mit derselben Technik wie eben:

    dna = 'AGTAGCGTC'
    gegenstrang = ''
    for zeichen in dna:
        if zeichen == 'A':
            zeichen = 'T'
        if zeichen == 'T':
            zeichen = 'A'
        if zeichen == 'G':
            zeichen = 'C'
        if zeichen == 'C':
            zeichen = 'G'
        gegenstrang += zeichen

    print(gegenstrang)
`,
          task: "Führ das Programm aus und sieh dir das Ergebnis genau an.",
        },
        {
          id: "dna-mit-else",
          carryOver: true,
          kind: "exercise",
          mode: "stdout",
          params: ["dna"],
          tests: [
            {
              args: ["AGTAGCGTCCTTAGTTACAGGATGGCTTAT"],
              expected: "TCATCGCAGGAATCAATGTCCTACCGAATA",
            },
            {
              args: ["GTGGTGAACATAAGTGGTACGTTAACGGCA"],
              expected: "CACCACTTGTATTCACCATGCAATTGCCGT",
            },
          ],
          solution: `gegenstrang = ''
for zeichen in dna:
    if zeichen == 'A':
        zeichen = 'T'
    else:
        if zeichen == 'T':
            zeichen = 'A'
    if zeichen == 'G':
        zeichen = 'C'
    else:
        if zeichen == 'C':
            zeichen = 'G'
    gegenstrang += zeichen

print(gegenstrang)`,
          hints: [
            "Das Problem: Ein `A` wird zu `T`, und die nächste Bedingung macht daraus sofort wieder ein `A`.",
            "Die Prüfung auf `T` darf also nur laufen, wenn die Prüfung auf `A` **nicht** zugetroffen hat.",
            "Genau dafür ist `else` da: `if zeichen == 'A': ... else: if zeichen == 'T': ...`",
            "Dasselbe Muster brauchst du auch für `G` und `C`.",
          ],
          text: `
Oje, das funktioniert nicht richtig. \`T\` wird zu \`A\`, aber \`A\` wird zu gar nichts. Siehst du, warum?

Wenn \`zeichen == 'A'\` zutrifft, läuft \`zeichen = 'T'\`. Damit trifft aber gleich darauf auch \`zeichen == 'T'\` zu, also wird \`zeichen = 'A'\` – und wir sind wieder am Anfang.

Wir dürfen \`T\` nur dann zu \`A\` machen, wenn das Zeichen **nicht schon vorher** ein \`A\` war, wenn also \`zeichen == 'A'\` falsch war. Genau das leistet ein \`else\`:

    if zeichen == 'A':
        zeichen = 'T'
    else:
        if zeichen == 'T':
            zeichen = 'A'

Repariere das Programm damit so, dass alle Zeichen korrekt ersetzt werden.
`,
          task: "Repariere die Umwandlung mit `else`.",
        },
        {
          id: "dna-mit-elif",
          kind: "run",
          surface: "editor",
          program: `dna = 'AGTAGCGTC'
gegenstrang = ''
for zeichen in dna:
    if zeichen == 'A':
        zeichen = 'T'
    elif zeichen == 'T':
        zeichen = 'A'
    elif zeichen == 'G':
        zeichen = 'C'
    elif zeichen == 'C':
        zeichen = 'G'
    gegenstrang += zeichen

print(gegenstrang)`,
          text: `
Großartig! Du hast nachgebaut, was deine Zellen ständig tun.

Ein \`if\` innerhalb eines \`else\` lässt sich durch das Schlüsselwort \`elif\` ersetzen (kurz für *else if*). Der Code von eben wird damit zu:

    dna = 'AGTAGCGTC'
    gegenstrang = ''
    for zeichen in dna:
        if zeichen == 'A':
            zeichen = 'T'
        elif zeichen == 'T':
            zeichen = 'A'
        elif zeichen == 'G':
            zeichen = 'C'
        elif zeichen == 'C':
            zeichen = 'G'
        gegenstrang += zeichen

    print(gegenstrang)

Beachte: Das erste \`if\` bleibt ein \`if\`, nur die folgenden werden zu \`elif\`.
`,
          task: "Schreib das Programm mit `elif` und führ es aus.",
        },
      ],
      outro: `
Eine Kette von \`elif\` ist typisch, wenn von vielen Möglichkeiten **genau eine** greifen soll. Allgemein lässt sich Code wie dieser:

    if X:
        ...
    else:
        if Y:
            ...
        else:
            if Z:
                ...
            else:
                ...

so umschreiben:

    if X:
        ...
    elif Y:
        ...
    elif Z:
        ...
    else:
        ...

Das ist kürzer und erspart dir die unangenehm tiefe Verschachtelung. Der Unterschied ist rein kosmetisch – der Computer sieht beide Fassungen als identisch an.

Nach den \`elif\`-Zweigen darf optional noch ein letztes \`else\` stehen. In unserem DNA-Beispiel haben wir keines benutzt, aber wir könnten damit auf unerwartete Zeichen hinweisen.
`,
    },
    {
      id: "bedingungen/vergleiche",
      title: "Weitere Vergleichsoperatoren",
      summary: "Ungleich, kleiner, größer – und eine Aufgabe zum Knobeln.",
      steps: [
        {
          id: "ungleich",
          kind: "run",
          surface: "shell",
          program: "1 != 2",
          prediction: {
            choices: ["True", "False"],
            correctIndex: 0,
          },
          text: `
Das Gegenteil von \`==\` ist der **Ungleichheitsoperator** \`!=\`. Wenn du die Augen zusammenkneifst, sieht er fast aus wie ≠. Er ergibt \`True\`, wenn zwei Werte … nicht gleich sind.

Probier \`1 != 2\` in der Shell.
`,
          task: "Führe `1 != 2` in der Shell aus.",
        },
        {
          id: "kaputte-taste",
          kind: "run",
          surface: "editor",
          program: `satz = 'Die e-Taste auf meiner Tastatur ist kaputt'
neuer_satz = ''
for c in satz:
    if c != 'e':
        neuer_satz += c
print(neuer_satz)`,
          text: `
Hier ein kleines Programm mit \`!=\`:

    satz = 'Die e-Taste auf meiner Tastatur ist kaputt'
    neuer_satz = ''
    for c in satz:
        if c != 'e':
            neuer_satz += c
    print(neuer_satz)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "noten",
          kind: "run",
          surface: "editor",
          program: `prozent = 73

if prozent < 40:
    note = 'nicht bestanden'
elif prozent < 60:
    note = 'befriedigend'
elif prozent < 80:
    note = 'gut'
else:
    note = 'sehr gut'

print(note)`,
          prediction: {
            choices: ["nicht bestanden", "befriedigend", "gut", "sehr gut"],
            correctIndex: 2,
          },
          text: `
Neben \`==\` und \`!=\` gibt es die Größenvergleiche: \`<\` (kleiner als), \`>\` (größer als), \`<=\` (kleiner oder gleich) und \`>=\` (größer oder gleich).

Hier ein praktisches Beispiel mit \`<\`:

    prozent = 73

    if prozent < 40:
        note = 'nicht bestanden'
    elif prozent < 60:
        note = 'befriedigend'
    elif prozent < 80:
        note = 'gut'
    else:
        note = 'sehr gut'

    print(note)

Denk dran: \`elif prozent < 60\` nach \`if prozent < 40\` bedeutet "falls die Prozentzahl **nicht** kleiner als 40 war und außerdem kleiner als 60 ist". Es greift also für alle Werte von 40 bis 59.
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "kleinster-wert",
          kind: "exercise",
          mode: "stdout",
          params: ["x1", "x2", "x3"],
          tests: [
            { args: [1, 2, 3], expected: "1" },
            { args: [10, 20, 30], expected: "10" },
            { args: [40, 20, 30], expected: "20" },
            { args: [40, 50, 30], expected: "30" },
            { args: ["Charlie", "Alice", "Bob"], expected: "Alice" },
            { args: ["Alice", "Charlie", "Bob"], expected: "Alice" },
          ],
          solution: `if x1 < x2:
    if x1 < x3:
        kleinster = x1
    else:
        kleinster = x3
else:
    if x2 < x3:
        kleinster = x2
    else:
        kleinster = x3

print(kleinster)`,
          hints: [
            "Fang kleiner an: Schreib erst ein Programm, das den kleineren von nur `x1` und `x2` ausgibt.",
            "Dafür brauchst du ein `if/else` mit `<`.",
            "Für drei Werte verschachtelst du: Ist `x1` kleiner als `x2`? Dann kommt nur noch `x1` oder `x3` infrage.",
            "Ist `x1` **nicht** kleiner als `x2`, bleiben nur `x2` und `x3` übrig.",
          ],
          text: `
Jetzt eine Übung: Schreib ein Programm, das drei Variablen \`x1\`, \`x2\` und \`x3\` bekommt und den **kleinsten** Wert ausgibt.

Für

    x1 = 30
    x2 = 10
    x3 = 20

soll also \`10\` erscheinen.

Übrigens: \`<\` funktioniert auch mit Strings – dann wird alphabetisch verglichen. Dein Programm sollte also auch mit Namen klarkommen.
`,
          task: "Gib den kleinsten der drei Werte aus.",
        },
      ],
      outro: `
Wunderbar!

Es gibt viele Wege, diese Aufgabe zu lösen. Eine besonders elegante:

    kleinster = x1
    if x2 < kleinster:
        kleinster = x2
    if x3 < kleinster:
        kleinster = x3

    print(kleinster)

Hier merkst du dir einfach den bisher kleinsten Wert und ersetzt ihn, sobald ein kleinerer auftaucht. Dieses Muster – "bisher bester Wert" – begegnet dir beim Programmieren immer wieder, und es funktioniert für beliebig viele Werte.

Python hat für diesen Fall übrigens auch eine eingebaute Funktion: \`min(x1, x2, x3)\`. Die lernst du später noch genauer kennen.
`,
    },
  ],
};
