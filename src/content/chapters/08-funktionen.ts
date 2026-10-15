import type { Chapter } from "../types";

export const funktionen: Chapter = {
  id: "funktionen",
  number: 8,
  title: "Eigene Funktionen",
  summary: "Code einmal schreiben, beliebig oft benutzen – und Namen für Ideen vergeben.",
  icon: "🧩",
  track: "basics",
  lessons: [
    /* ================================================================== *
     *  1 – Funktionen definieren
     * ================================================================== */
    {
      id: "funktionen/definieren",
      title: "Funktionen definieren",
      summary: "Mit `def` eigene Bausteine bauen und mehrfach aufrufen.",
      steps: [
        {
          id: "erste-funktion",
          kind: "run",
          surface: "editor",
          program: `def begruesse(name):
    print(f"Hallo {name}!")

begruesse("Alice")
begruesse("Bob")`,
          text: `
Du hast Funktionen wie \`print()\` und \`len()\` schon oft aufgerufen. Jetzt lernst du, **eigene** Funktionen zu schreiben. Das ist der wichtigste Schritt, um größere Programme überhaupt beherrschbar zu halten.

Hier ein einfaches Beispiel:

    def begruesse(name):
        print(f"Hallo {name}!")

    begruesse("Alice")
    begruesse("Bob")

Das definiert eine Funktion namens \`begruesse\`, die einen Parameter entgegennimmt. Darunter rufen wir sie zweimal auf.
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "zweite-zeile",
          kind: "run",
          surface: "editor",
          program: `def begruesse(name):
    print(f"Hallo {name}!")
    print("Wie geht es dir?")

begruesse("Alice")
begruesse("Bob")`,
          prediction: {
            choices: [
              "Hallo Alice!\nWie geht es dir?\nHallo Bob!\nWie geht es dir?",
              "Hallo Alice!\nHallo Bob!\nWie geht es dir?",
              "Hallo Alice!\nWie geht es dir?\nHallo Bob!",
              "Hallo Alice!\nHallo Bob!",
            ],
            correctIndex: 0,
          },
          text: `
Eine Funktionsdefinition ist – wie \`if\` und \`for\` – eine **zusammengesetzte Anweisung**: eine Kopfzeile, gefolgt von einem eingerückten Rumpf mit einer oder mehreren Anweisungen.

Füg dem Rumpf eine zweite Zeile hinzu:

    def begruesse(name):
        print(f"Hallo {name}!")
        print("Wie geht es dir?")

    begruesse("Alice")
    begruesse("Bob")
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "funktion-umbenennen",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def sag_hallo(name):
    print(f"Hallo {name}!")
    print("Wie geht es dir?")

sag_hallo("Alice")
sag_hallo("Bob")`,
          text: `
Achte darauf, wie sich die Ausgabe verändert hat: \`Wie geht es dir?\` erscheint **zweimal**. Du kannst dir das ganze Programm als gleichwertig zu diesem hier vorstellen:

    name = "Alice"
    print(f"Hallo {name}!")
    print("Wie geht es dir?")

    name = "Bob"
    print(f"Hallo {name}!")
    print("Wie geht es dir?")

Und genau darin liegt der Nutzen: Du schreibst denselben Code **einmal** und benutzt ihn beliebig oft. Ein Programm im Programm.

Die Kopfzeile hat immer denselben Aufbau:

1. das Schlüsselwort \`def\`, gefolgt von einem Leerzeichen
2. der **Name** der Funktion
3. runde Klammern \`()\` – dazwischen die **Parameter**, durch Kommas getrennt
4. ein Doppelpunkt \`:\`

Kleine Übung: Benenn die Funktion von \`begruesse\` in \`sag_hallo\` um.
`,
          task: "Benenne die Funktion in `sag_hallo` um – an allen nötigen Stellen.",
        },
        {
          id: "parameter-umbenennen",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def sag_hallo(personen_name):
    print(f"Hallo {personen_name}!")
    print("Wie geht es dir?")

sag_hallo("Alice")
sag_hallo("Bob")`,
          text: `
Genau – du musstest **drei** Zeilen ändern: die Definition und beide Aufrufe. Hättest du nur die Definition geändert, wäre \`begruesse("Alice")\` ins Leere gelaufen: Diesen Namen kennt Python dann nicht mehr.

Jetzt dasselbe mit dem Parameter: Benenn ihn von \`name\` in \`personen_name\` um.
`,
          task: "Benenne den Parameter in `personen_name` um.",
        },
        {
          id: "uebung-zweimal-ausgeben",
          kind: "exercise",
          mode: "stdout",
          functionName: "zweimal_ausgeben",
          params: ["x"],
          tests: [
            { args: ["Hallo"], expected: "Hallo\nHallo\n" },
            { args: [123], expected: "123\n123\n" },
          ],
          solution: `def zweimal_ausgeben(x):
    print(x)
    print(x)`,
          hints: [
            "Hier ist nichts zu knobeln – folg einfach dem Rezept für eine Funktionsdefinition.",
            "Achte darauf, dass alle Bestandteile da sind: `def`, die Klammern `()` und der Doppelpunkt `:`.",
            "Die Funktion muss genau `zweimal_ausgeben` heißen.",
            "Sie muss genau einen Parameter namens `x` haben.",
            "Benutz den Parameter im Rumpf – und vergiss die Einrückung nicht.",
            "Der Rumpf braucht zwei Anweisungen: `print(x)` und noch einmal `print(x)`.",
          ],
          text: `
Diesmal waren es **zwei** Zeilen: die Kopfzeile und die Stelle im Rumpf, an der der Parameter benutzt wird. Die Aufrufe mussten nicht angefasst werden – wie der Parameter innerhalb der Funktion heißt, geht den Aufrufer nichts an.

Jetzt schreib deine erste eigene Funktion: \`zweimal_ausgeben\` nimmt ein Argument \`x\` entgegen und gibt es zweimal untereinander aus.

\`zweimal_ausgeben("Hallo")\` soll also ausgeben:

    Hallo
    Hallo

Du darfst die Funktion zum Testen unter der Definition aufrufen, musst aber nicht.
`,
          task: "Definiere die Funktion `zweimal_ausgeben(x)`.",
        },
        {
          id: "mehrere-parameter",
          kind: "run",
          surface: "editor",
          program: `def oft_ausgeben(ding, n):
    for _ in range(n):
        print(ding)

oft_ausgeben("Hallo", 3)`,
          prediction: {
            choices: [
              "Hallo\nHallo\nHallo",
              "3\n3\n3",
              "Hallo",
              "H\na\nl\nl\no",
            ],
            correctIndex: 0,
          },
          text: `
Funktionen können auch mehrere Parameter haben:

    def oft_ausgeben(ding, n):
        for _ in range(n):
            print(ding)

    oft_ausgeben("Hallo", 3)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "parameter-tauschen",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `def oft_ausgeben(n, ding):
    for _ in range(n):
        print(ding)

oft_ausgeben(3, "Hallo")`,
          text: `
Beachte die Kommas – sowohl bei den Parametern in der Definition als auch bei den Argumenten im Aufruf. Und beachte, welcher Wert wo landet:

    def oft_ausgeben(ding, n):
                       ↑   ↑
                       │   │
      oft_ausgeben("Hallo", 3)

Der Aufruf \`oft_ausgeben("Hallo", 3)\` entspricht also:

    ding = "Hallo"
    n = 3
    for _ in range(n):
        print(ding)

**Die Reihenfolge entscheidet**, nicht der Name. Zum Beweis: Tausch die beiden Parameter in der Kopfzeile, sodass dort

    def oft_ausgeben(n, ding):

steht – und pass den Aufruf so an, dass das Programm weiterhin dreimal \`Hallo\` ausgibt.
`,
          task: "Tausch die Parameter und repariere den Aufruf.",
        },
      ],
      outro: `
Perfekt! Damit hast du das Fundament: \`def\`, Name, Parameter, Doppelpunkt, eingerückter Rumpf.

Zwei Begriffe, die oft verwechselt werden:

- **Parameter** stehen in der *Definition* – das sind die Platzhalter.
- **Argumente** stehen im *Aufruf* – das sind die echten Werte.
`,
    },

    /* ================================================================== *
     *  2 – Funktionen rufen Funktionen
     * ================================================================== */
    {
      id: "funktionen/verschachteln",
      title: "Funktionen rufen Funktionen",
      summary: "Aus kleinen Bausteinen größere zusammensetzen.",
      steps: [
        {
          id: "funktion-in-funktion",
          kind: "run",
          surface: "editor",
          program: `def oft_ausgeben(n, ding):
    for _ in range(n):
        print(ding)

def zweimal_ausgeben(x):
    oft_ausgeben(2, x)

zweimal_ausgeben("Hallo")`,
          text: `
Im Rumpf einer Funktion darf alles stehen – auch Funktionsaufrufe. Das hast du längst getan, jedes Mal wenn du \`print\` benutzt hast. Und für **eigene** Funktionen gilt nichts anderes: Deine Funktionen können sich gegenseitig aufrufen.

So lässt sich \`zweimal_ausgeben\` zum Beispiel mit Hilfe von \`oft_ausgeben\` bauen:

    def oft_ausgeben(n, ding):
        for _ in range(n):
            print(ding)

    def zweimal_ausgeben(x):
        oft_ausgeben(2, x)

    zweimal_ausgeben("Hallo")
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Genau so entstehen echte Programme: aus kleinen, überschaubaren Bausteinen, die aufeinander aufbauen.

Verfolge im Kopf, was passiert:

1. \`zweimal_ausgeben("Hallo")\` wird aufgerufen, \`x\` bekommt den Wert \`"Hallo"\`.
2. Im Rumpf wird \`oft_ausgeben(2, "Hallo")\` aufgerufen. Dort ist \`n = 2\` und \`ding = "Hallo"\`.
3. Die Schleife läuft zweimal und gibt jeweils \`Hallo\` aus.
4. \`oft_ausgeben\` ist fertig, dann ist auch \`zweimal_ausgeben\` fertig.

Jede Funktion hat dabei **ihre eigenen Variablen**. Das \`x\` in \`zweimal_ausgeben\` und das \`ding\` in \`oft_ausgeben\` haben nichts miteinander zu tun, auch wenn gerade derselbe Wert drinsteht.
`,
    },

    /* ================================================================== *
     *  3 – Werte zurückgeben
     * ================================================================== */
    {
      id: "funktionen/rueckgabe",
      title: "Werte zurückgeben",
      summary: "`return` macht aus einer Funktion einen Ausdruck mit Wert.",
      steps: [
        {
          id: "erstes-return",
          kind: "run",
          surface: "editor",
          program: `def verdoppeln(x):
    return x * 2

zahl = 5
doppelt = verdoppeln(zahl)
print(zahl)
print(doppelt)`,
          prediction: {
            choices: ["5\n10", "5\n5", "10\n10", "10\n5"],
            correctIndex: 0,
          },
          text: `
Richtig nützlich werden Funktionen, wenn sie einen Wert **zurückgeben**, statt ihn nur auszugeben. Probier das aus:

    def verdoppeln(x):
        return x * 2

    zahl = 5
    doppelt = verdoppeln(zahl)
    print(zahl)
    print(doppelt)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "rueckgabe-verlieren",
          kind: "run",
          surface: "editor",
          program: `def verdoppeln(x):
    return x * 2

zahl = 5
verdoppeln(zahl)
print(zahl)`,
          prediction: {
            choices: ["5", "10", "None", "eine Fehlermeldung"],
            correctIndex: 0,
          },
          text: `
Wir haben \`zahl\` (mit dem Wert \`5\`) als Argument \`x\` übergeben. \`verdoppeln\` hat \`x * 2\`, also \`10\`, **zurückgegeben** – und dieser Wert wurde zum Wert der Variable \`doppelt\`.

Das Schlüsselwort \`return\` macht \`verdoppeln(zahl)\` zu einem **Ausdruck mit einem Wert**, ganz so wie \`5 * 2\`.

Ganz wichtig: \`verdoppeln(zahl)\` hat \`zahl\` **nicht verändert** – am Ende ist \`zahl\` immer noch \`5\`. Was passiert also hier?

    def verdoppeln(x):
        return x * 2

    zahl = 5
    verdoppeln(zahl)
    print(zahl)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "uebung-vervierfachen",
          kind: "exercise",
          mode: "return",
          functionName: "vervierfachen",
          params: ["x"],
          starter: `def verdoppeln(x):
    return x * 2

`,
          tests: [
            { args: [3], expected: 12 },
            { args: [10], expected: 40 },
          ],
          solution: `def verdoppeln(x):
    return x * 2

def vervierfachen(x):
    return verdoppeln(verdoppeln(x))`,
          hints: [
            "Mal 4 rechnen heißt: zweimal mal 2 rechnen.",
            "Du musst `verdoppeln` also zweimal aufrufen.",
            "Achte darauf, den zurückgegebenen Wert jedes Mal auch zu benutzen.",
            "Die Funktion muss `vervierfachen` heißen und einen Parameter `x` haben.",
            "Und sie muss am Ende etwas mit `return` zurückgeben.",
            "Entweder `return verdoppeln(verdoppeln(x))` oder in zwei Schritten mit einer Zwischenvariable.",
          ],
          text: `
Hier hat \`verdoppeln(zahl)\` zwar immer noch \`10\` zurückgegeben – aber wir haben den Wert nirgends aufgefangen, also ist er verloren gegangen. \`zahl\` bleibt \`5\`.

Jetzt du: Schreib eine Funktion \`vervierfachen\`, die ein Argument \`x\` bekommt und das Vierfache zurückgibt.

**Bedingung:** Im Rumpf von \`vervierfachen\` darfst du weder Zahlen noch Multiplikation direkt verwenden – benutz ausschließlich die Funktion \`verdoppeln\`.
`,
          task: "Schreib `vervierfachen(x)` – nur mit Hilfe von `verdoppeln`.",
        },
      ],
      outro: `
Gut gemacht! Zwei mögliche Lösungen:

    def vervierfachen(x):
        x = verdoppeln(x)
        x = verdoppeln(x)
        return x

    def vervierfachen(x):
        return verdoppeln(verdoppeln(x))

Der entscheidende Unterschied, den du dir merken solltest:

- \`print(x)\` **zeigt** etwas an. Danach ist der Wert weg.
- \`return x\` **liefert** einen Wert zurück, mit dem weitergerechnet werden kann.

Fast immer willst du \`return\`. Eine Funktion, die nur etwas mit \`print\` ausgibt, lässt sich nicht weiterverwenden.
`,
    },

    /* ================================================================== *
     *  4 – Funktionen testen
     * ================================================================== */
    {
      id: "funktionen/testen",
      title: "Funktionen testen",
      summary: "Beweisen, dass der Code tut, was er soll – automatisch.",
      steps: [
        {
          id: "assert-equal",
          kind: "run",
          surface: "editor",
          program: `def verdoppeln(x):
    return x * 2

assert_equal(verdoppeln(2), 4)
assert_equal(verdoppeln(5), 10)`,
          prediction: {
            choices: [
              "OK\nOK",
              "Fehler! 4 != 4\nFehler! 10 != 10",
              "Fehler! 2 != 4\nFehler! 5 != 10",
              "4\n10",
            ],
            correctIndex: 0,
          },
          text: `
Woher weißt du eigentlich, ob deine Funktion richtig funktioniert? Bisher: durch Hingucken. Das reicht bei drei Zeilen – bei dreihundert nicht mehr.

Profis schreiben deshalb **Tests**: kleine Programme, die den Code automatisch überprüfen. Dafür steht dir hier \`assert_equal\` zur Verfügung. Es vergleicht zwei Werte und meldet sich, wenn sie nicht übereinstimmen.

    def verdoppeln(x):
        return x * 2

    assert_equal(verdoppeln(2), 4)
    assert_equal(verdoppeln(5), 10)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "tests-scheitern-lassen",
          kind: "run",
          surface: "editor",
          program: `def verdoppeln(x):
    return x * 3

assert_equal(verdoppeln(2), 4)
assert_equal(verdoppeln(5), 10)`,
          prediction: {
            choices: [
              "Fehler! 6 != 4\nFehler! 15 != 10",
              "Fehler! 4 != 6\nFehler! 10 != 15",
              "OK\nOK",
              "Fehler! 4 != 4\nFehler! 10 != 10",
            ],
            correctIndex: 0,
          },
          text: `
Die beiden \`OK\` sagen dir: Die Tests sind durchgelaufen, \`verdoppeln\` funktioniert.

Aber ein Test, der immer \`OK\` sagt, ist wertlos – er könnte ja kaputt sein. Prüfen wir das, indem wir die Funktion absichtlich falsch machen: \`x * 3\` statt \`x * 2\`.

    def verdoppeln(x):
        return x * 3

    assert_equal(verdoppeln(2), 4)
    assert_equal(verdoppeln(5), 10)
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "tests-vervollstaendigen",
          kind: "run",
          surface: "editor",
          program: `def verdoppeln(x):
    return x * 2

def vervierfachen(x):
    return verdoppeln(verdoppeln(x))

assert_equal(vervierfachen(2), 8)
assert_equal(vervierfachen(5), 20)`,
          text: `
Ausgezeichnet – die Tests sind fehlgeschlagen! Normalerweise ist das nichts Gutes, hier aber schon: Es beweist, dass die Tests ihre Arbeit tun.

Üben wir das. Unten steht \`vervierfachen\` mit unvollständigen Tests. Ergänze die fehlenden Argumente bei \`assert_equal\`:

    def verdoppeln(x):
        return x * 2

    def vervierfachen(x):
        return verdoppeln(verdoppeln(x))

    assert_equal(vervierfachen(2))
    assert_equal(vervierfachen(5))
`,
          task: "Ergänze bei beiden Tests den erwarteten Wert.",
        },
        {
          id: "uebung-umrahmen",
          kind: "exercise",
          mode: "return",
          functionName: "umrahmen",
          params: ["text", "seiten"],
          tests: [
            { args: ["mehr", "++"], expected: "++mehr++" },
            { args: ["dasselbe", "="], expected: "=dasselbe=" },
          ],
          solution: `def umrahmen(text, seiten):
    return seiten + text + seiten`,
          hints: [
            "`seiten` soll sowohl vor als auch hinter `text` stehen.",
            "Setz die drei Teile mit `+` zusammen – oder mit einem f-String.",
            "Vergiss die Einrückung des Rumpfes nicht.",
            "Und am Ende brauchst du ein `return`.",
            "Achte darauf, dass du `umrahmen` nicht versehentlich in sich selbst aufrufst – prüf die Einrückung.",
          ],
          text: `
Tests haben noch einen zweiten großen Vorteil: Man kann sie **lesen**. Sie zeigen unmissverständlich, was eine Funktion tut – oft klarer als jede Beschreibung in Worten.

Hier zum Beispiel sind ein paar Tests:

    assert_equal(umrahmen("mehr", "++"), "++mehr++")
    assert_equal(umrahmen("dasselbe", "="), "=dasselbe=")

Ich muss dir gar nicht erklären, was \`umrahmen\` macht – du siehst es selbst.

Schreib eine Funktion \`umrahmen\`, die diese Tests besteht. Sie beginnt so:

    def umrahmen(text, seiten):
`,
          task: "Schreib `umrahmen(text, seiten)`.",
        },
        {
          id: "uebung-alarm",
          kind: "exercise",
          mode: "return",
          functionName: "alarm",
          params: ["text", "stufe"],
          starter: `def umrahmen(text, seiten):
    return seiten + text + seiten

`,
          tests: [
            { args: ["Warnung", 2], expected: "!! Warnung !!" },
            { args: ["GEFAHR", 4], expected: "!!!! GEFAHR !!!!" },
          ],
          solution: `def umrahmen(text, seiten):
    return seiten + text + seiten

def alarm(text, stufe):
    text = umrahmen(text, ' ')
    for _ in range(stufe):
        text = umrahmen(text, '!')
    return text`,
          hints: [
            "`text` soll auf jeder Seite von einem Leerzeichen und `stufe` Ausrufezeichen umgeben sein.",
            "Nimm die Definition von `umrahmen` mit ins Programm und ruf sie in `alarm` auf.",
            "Benutz `umrahmen` einmal für die Leerzeichen.",
            "Und dann noch einmal für die Ausrufezeichen.",
            "Du sollst mehrere Ausrufezeichen nicht zu einem String zusammenbauen – ruf `umrahmen(..., '!')` stattdessen mehrfach auf.",
            "Genau einmal pro Stufe. Das schreit nach einer Schleife: `for _ in range(stufe):`",
            "Innerhalb der Schleife musst du das Ergebnis jedes Mal wieder `text` zuweisen.",
          ],
          text: `
Perfekt! Jetzt schreib eine Funktion \`alarm\`, die diese Tests besteht:

    assert_equal(alarm("Warnung", 2), "!! Warnung !!")
    assert_equal(alarm("GEFAHR", 4), "!!!! GEFAHR !!!!")

**Bedingung:** Im Rumpf von \`alarm\` sollst du kein \`+\` benutzen. Verwende stattdessen \`umrahmen\`. Deine Funktion beginnt so:

    def alarm(text, stufe):
`,
          task: "Schreib `alarm(text, stufe)` – mit Hilfe von `umrahmen`.",
        },
      ],
      outro: `
Starke Arbeit! Diese Werkzeuge werden dir in den nächsten Kapiteln oft begegnen.

Merk dir das Vorgehen, es ist in der Praxis Gold wert:

1. Überleg dir Beispiele, was die Funktion tun soll.
2. Schreib sie als Tests auf.
3. Programmier die Funktion, bis alle Tests \`OK\` melden.
4. Änderst du später etwas, sagen dir die Tests sofort, ob noch alles stimmt.

Der letzte Punkt ist der eigentliche Gewinn: Tests machen dich **mutig**, weil du Code gefahrlos umbauen kannst.
`,
    },

    /* ================================================================== *
     *  5 – return beendet die Funktion
     * ================================================================== */
    {
      id: "funktionen/return-beendet",
      title: "`return` beendet alles",
      summary: "Die häufigsten Missverständnisse rund um `return`.",
      steps: [
        {
          id: "zwei-returns",
          kind: "run",
          surface: "editor",
          program: `def foo():
    return 1
    return 2

print(foo())`,
          prediction: {
            choices: ["1", "2", "1\n2", "[1, 2]"],
            correctIndex: 0,
          },
          text: `
\`return\` sorgt am Anfang oft für Verwirrung. Klären wir das.

    def foo():
        return 1
        return 2

    print(foo())
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "return-in-schleife",
          kind: "run",
          surface: "editor",
          program: `def zahlen_verdoppeln(zahlen):
    for x in zahlen:
        return x * 2

assert_equal(zahlen_verdoppeln([1, 2, 3]), [2, 4, 6])`,
          text: `
Sobald ein \`return\` ausgeführt wird, ist die Funktion **beendet**. Der Rest wird ignoriert. \`return 2\` ist damit *unerreichbar* – egal wie oft du die Funktion aufrufst.

***Pro Funktionsaufruf wird genau ein \`return\` ausgeführt, danach ist Schluss.***

Mehrere \`return\`-Anweisungen sind trotzdem sinnvoll, wenn sie in verschiedenen Zweigen stehen:

    if bedingung:
        return wert1
    else:
        return wert2

Ein klassischer Denkfehler betrifft \`return\` in Schleifen. Probier das aus:

    def zahlen_verdoppeln(zahlen):
        for x in zahlen:
            return x * 2

    assert_equal(zahlen_verdoppeln([1, 2, 3]), [2, 4, 6])
`,
          task: "Führ das Programm aus und schau dir an, was der Test meldet.",
        },
        {
          id: "liste-zurueckgeben",
          kind: "run",
          surface: "editor",
          program: `def zahlen_verdoppeln(zahlen):
    doppelte = []
    for x in zahlen:
        doppelte.append(x * 2)
    return doppelte

assert_equal(zahlen_verdoppeln([1, 2, 3]), [2, 4, 6])`,
          text: `
Es sieht intuitiv aus, in jedem Schleifendurchlauf einen Wert zurückzugeben – aber so funktioniert es nicht. Die Funktion gibt im **ersten** Durchlauf \`2\` zurück und endet sofort.

Auch bei nur einem \`return\` gilt: Es wird genau einmal ausgeführt und liefert genau einen Wert. Wenn du mehrere Werte zurückgeben willst, gib eine **Liste** zurück:

    def zahlen_verdoppeln(zahlen):
        doppelte = []
        for x in zahlen:
            doppelte.append(x * 2)
        return doppelte

    assert_equal(zahlen_verdoppeln([1, 2, 3]), [2, 4, 6])
`,
          task: "Führ das Programm aus – jetzt sollte der Test `OK` melden.",
        },
        {
          id: "return-in-verschachtelten-schleifen",
          kind: "run",
          surface: "editor",
          program: `def foo():
    for buchstabe in 'abc':
        for zahl in range(3):
            print(f"{buchstabe} {zahl}")
            if buchstabe == 'b':
                return buchstabe

foo()`,
          prediction: {
            choices: [
              "a 0\na 1\na 2\nb 0",
              "a 0\na 1\na 2",
              "a 0\na 1\na 2\nb 0\nb 1\nb 2",
              "a 0\na 1\na 2\nb 0\nc 0\nc 1\nc 2",
            ],
            correctIndex: 0,
          },
          text: `
Und was passiert bei **verschachtelten** Schleifen?

    def foo():
        for buchstabe in 'abc':
            for zahl in range(3):
                print(f"{buchstabe} {zahl}")
                if buchstabe == 'b':
                    return buchstabe

    foo()
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
        {
          id: "break-statt-return",
          kind: "run",
          surface: "editor",
          program: `def foo():
    for buchstabe in 'abc':
        for zahl in range(3):
            print(f"{buchstabe} {zahl}")
            if buchstabe == 'b':
                break

foo()`,
          prediction: {
            choices: [
              "a 0\na 1\na 2\nb 0\nc 0\nc 1\nc 2",
              "a 0\na 1\na 2\nb 0",
              "a 0\na 1\na 2\nb 0\nb 1\nb 2\nc 0\nc 1\nc 2",
              "a 0\na 1\na 2",
            ],
            correctIndex: 0,
          },
          text: `
Wie erwartet: \`return\` ***beendet die ganze Funktion***, samt aller Schleifen.

Zum Vergleich: \`break\` hast du im Listen-Kapitel kennengelernt. Ersetz \`return buchstabe\` durch \`break\` und schau dir den Unterschied an.

    def foo():
        for buchstabe in 'abc':
            for zahl in range(3):
                print(f"{buchstabe} {zahl}")
                if buchstabe == 'b':
                    break

    foo()
`,
          task: "Sag die Ausgabe voraus und führ das Programm aus.",
        },
      ],
      outro: `
Der Unterschied auf den Punkt gebracht: \`break\` stoppt **nur die innerste Schleife**, in diesem Fall \`for zahl in range(3):\`. Im Einzelnen passiert Folgendes:

- Für \`buchstabe = 'b'\` wird \`print\` nur für \`zahl = 0\` ausgeführt,
- dann bricht \`break\` die innere Schleife ab,
- die **äußere** Schleife läuft aber weiter und geht zu \`'c'\`,
- und \`'c'\` wird komplett durchlaufen, weil die \`if\`-Bedingung dort nie zutrifft.

Deine Merkhilfe:

| | Wirkung |
| --- | --- |
| \`break\` | verlässt die innerste Schleife |
| \`return\` | verlässt die ganze Funktion |
`,
    },
  ],
};
