import type { Chapter } from "../types";

export const pandas: Chapter = {
  id: "pandas",
  number: 11,
  title: "Pandas",
  summary: "Echte Tabellen laden, filtern, bereinigen und auswerten.",
  icon: "🐼",
  track: "data",
  lessons: [
    /* ================================================================== *
     *  1 – Grundlagen
     * ================================================================== */
    {
      id: "pandas/grundlagen",
      title: "Series und DataFrame",
      summary: "Die beiden Datenstrukturen, um die sich alles dreht.",
      steps: [
        {
          id: "pandas-importieren",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

print(pd.__version__)`,
          text: `
**Pandas** ist die Bibliothek für Datenverarbeitung und -analyse in Python. Sie baut auf NumPy auf, ergänzt aber das Entscheidende: **Beschriftungen**. Statt anonymer Zahlenblöcke arbeitest du mit benannten Spalten – also mit dem, was du aus Excel kennst, nur programmierbar.

Wie \`np\` für NumPy ist \`pd\` die übliche Abkürzung für Pandas:

    import pandas as pd

    print(pd.__version__)
`,
          task: "Führ das Programm aus und warte, bis Pandas geladen ist.",
        },
        {
          id: "series",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = [10, 20, 30, 40]
reihe = pd.Series(daten)
print(reihe)`,
          text: `
Eine **Series** ist ein eindimensionales, beschriftetes Array. Sie kann Werte jedes Datentyps enthalten:

    import pandas as pd

    daten = [10, 20, 30, 40]
    reihe = pd.Series(daten)
    print(reihe)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "dataframe",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)
print(df)`,
          text: `
Beachte die linke Spalte in der Ausgabe: Das ist der **Index**, die Beschriftung der Zeilen. Wenn du keinen angibst, nummeriert Pandas ab 0 durch. Rechts stehen die Werte, darunter der Datentyp.

Die wichtigere Struktur ist der **DataFrame** – eine zweidimensionale Tabelle, deren Spalten unterschiedliche Datentypen haben dürfen. Am einfachsten erzeugst du ihn aus einem Dictionary: Schlüssel werden zu Spaltennamen, Werte zu Spalteninhalten.

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)
    print(df)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Sehr gut! Merk dir den Unterschied:

- **Series** – eine Spalte, eindimensional
- **DataFrame** – eine ganze Tabelle, zweidimensional

Ein DataFrame ist im Grunde eine Sammlung von Series, die sich denselben Index teilen. Deshalb ist auch jede einzelne Spalte eines DataFrames wieder eine Series – das wirst du gleich sehen.

Die Variable heißt in der Praxis fast immer \`df\`. Halte dich daran, dann versteht jede und jeder sofort deinen Code.
`,
    },

    /* ================================================================== *
     *  2 – DataFrame-Operationen
     * ================================================================== */
    {
      id: "pandas/operationen",
      title: "Mit Tabellen arbeiten",
      summary: "Ansehen, auswählen, filtern, verändern.",
      steps: [
        {
          id: "head",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)

print(df.head())`,
          text: `
Echte Datensätze haben tausende Zeilen – die willst du nicht alle auf einmal sehen. \`head()\` zeigt dir die ersten fünf Zeilen (oder so viele, wie du angibst):

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)

    print(df.head())
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "info",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)

df.info()`,
          text: `
\`info()\` gibt dir eine Zusammenfassung: Spaltennamen, Datentypen und wie viele Werte tatsächlich vorhanden sind.

Beachte: \`info()\` gibt seine Ausgabe direkt aus – du brauchst kein \`print\` drumherum.

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)

    df.info()
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "shape",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München'],
    'Geschlecht': ['w', 'm', 'w']
}
df = pd.DataFrame(daten)

print("Form:", df.shape)
print("Zeilen:", df.shape[0])
print("Spalten:", df.shape[1])`,
          text: `
Die Struktur bekommst du wie bei NumPy über \`shape\`. Auch hier gilt die Matrix-Schreibweise: \`shape[0]\` sind die Zeilen, \`shape[1]\` die Spalten, \`shape\` beides.

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München'],
        'Geschlecht': ['w', 'm', 'w']
    }
    df = pd.DataFrame(daten)

    print("Form:", df.shape)
    print("Zeilen:", df.shape[0])
    print("Spalten:", df.shape[1])
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "spalten-auswaehlen",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)

print(df['Name'])
print(df.columns)`,
          text: `
Eine einzelne Spalte holst du dir mit eckigen Klammern – genau wie bei einem Dictionary. Und \`df.columns\` verrät dir alle Spaltennamen:

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)

    print(df['Name'])
    print(df.columns)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "zeilen-filtern",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)

# Erst mal anschauen, was die Bedingung liefert
print(df['Alter'] > 30)

# Und damit filtern
aeltere = df[df['Alter'] > 30]
print(aeltere)`,
          text: `
Jetzt kommt die vielleicht wichtigste Technik überhaupt: **Zeilen filtern**.

Die Schreibweise \`df[df['Alter'] > 30]\` sieht auf den ersten Blick seltsam aus. Der Trick: \`df['Alter'] > 30\` ergibt eine Series aus \`True\`/\`False\`-Werten – einen für jede Zeile. Legt man die in die eckigen Klammern, behält Pandas nur die Zeilen mit \`True\`.

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)

    # Erst mal anschauen, was die Bedingung liefert
    print(df['Alter'] > 30)

    # Und damit filtern
    aeltere = df[df['Alter'] > 30]
    print(aeltere)
`,
          task: "Führ das Programm aus und vergleiche beide Ausgaben.",
        },
        {
          id: "spalten-aendern",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'Hamburg', 'München']
}
df = pd.DataFrame(daten)

# Spalte hinzufügen
df['Gehalt'] = [50000, 60000, 70000]

# Spalte entfernen (axis=1 bedeutet: eine Spalte, keine Zeile)
df = df.drop('Alter', axis=1)
print(df)`,
          text: `
Spalten hinzufügen und entfernen geht genauso direkt:

    import pandas as pd

    daten = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Alter': [25, 30, 35],
        'Stadt': ['Berlin', 'Hamburg', 'München']
    }
    df = pd.DataFrame(daten)

    # Spalte hinzufügen
    df['Gehalt'] = [50000, 60000, 70000]

    # Spalte entfernen (axis=1 bedeutet: eine Spalte, keine Zeile)
    df = df.drop('Alter', axis=1)
    print(df)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Gut gemacht! Deine Pandas-Grundausstattung:

| Befehl | Wirkung |
| --- | --- |
| \`df.head()\` | erste Zeilen ansehen |
| \`df.info()\` | Spalten, Typen, fehlende Werte |
| \`df.shape\` | (Zeilen, Spalten) |
| \`df['Spalte']\` | eine Spalte holen |
| \`df[df['A'] > 5]\` | Zeilen filtern |
| \`df['Neu'] = ...\` | Spalte hinzufügen |
| \`df.drop('A', axis=1)\` | Spalte entfernen |

Ein wichtiges Detail bei \`drop\`: Es verändert \`df\` **nicht**, sondern gibt eine neue Tabelle zurück. Deshalb das \`df = df.drop(...)\`. Dieses Muster – neue Version statt Veränderung – zieht sich durch ganz Pandas.

Auf der nächsten Seite geht es an einen echten Datensatz.
`,
    },

    /* ================================================================== *
     *  3 – Echter Datensatz
     * ================================================================== */
    {
      id: "pandas/echter-datensatz",
      title: "Ein echter Datensatz",
      summary: "Frühstücksflocken analysieren: laden, prüfen, bereinigen, erweitern.",
      steps: [
        {
          id: "datensatz-laden",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = pd.read_csv('cereals.csv')
print(daten.head())`,
          text: `
Genug Spielzeugtabellen – jetzt arbeitest du mit echten Daten.

\`cereals.csv\` enthält Nährwertangaben von Frühstücksflocken: Kalorien, Protein, Fett, Zucker, Ballaststoffe und eine Bewertung. Solche CSV-Dateien sind das Standardformat für tabellarische Daten.

Geladen wird mit \`pd.read_csv()\`. Verschaff dir gleich mit \`head()\` einen ersten Eindruck:

    import pandas as pd

    daten = pd.read_csv('cereals.csv')
    print(daten.head())
`,
          task: "Lade den Datensatz und zeig die ersten Zeilen an.",
        },
        {
          id: "uebung-groesse",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd

daten = pd.read_csv('cereals.csv')

zeilen = ?
spalten = ?
print("Dieser Datensatz hat", zeilen, "Zeilen und", spalten, "Spalten.")`,
          tests: [
            { args: [], expected: "Dieser Datensatz hat 80 Zeilen und 17 Spalten.\n" },
          ],
          solution: `import pandas as pd

daten = pd.read_csv('cereals.csv')

zeilen = daten.shape[0]
spalten = daten.shape[1]
print("Dieser Datensatz hat", zeilen, "Zeilen und", spalten, "Spalten.")`,
          hints: [
            "Die Struktur bekommst du über `shape`.",
            "`shape` liefert ein Tupel – du brauchst daraus die einzelnen Werte.",
            "`daten.shape[0]` sind die Zeilen, `daten.shape[1]` die Spalten.",
          ],
          text: `
Um den Datensatz einzuschätzen, willst du als Erstes wissen, wie groß er ist.

Ermittle die Anzahl der Zeilen und Spalten, speichere sie in \`zeilen\` und \`spalten\` und gib den fertigen Satz aus.
`,
          task: "Ersetze die beiden `?`.",
        },
        {
          id: "uebung-spaltennamen",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd

daten = pd.read_csv('cereals.csv')

spaltennamen = ?
print(list(spaltennamen))`,
          tests: [
            {
              args: [],
              expected:
                "['Unnamed: 0', 'name', 'mfr', 'type', 'calories', 'protein', 'fat', 'sodium', 'fiber', 'carbo', 'sugars', 'potass', 'vitamins', 'shelf', 'weight', 'cups', 'rating']\n",
            },
          ],
          solution: `import pandas as pd

daten = pd.read_csv('cereals.csv')

spaltennamen = daten.columns
print(list(spaltennamen))`,
          hints: [
            "Die Spaltennamen liefert eine Eigenschaft des DataFrames.",
            "Sie heißt `columns` – ohne Klammern dahinter.",
            "`spaltennamen = daten.columns`",
          ],
          text: `
Jetzt, wo du die Größe kennst, interessieren dich die **Namen** der Spalten. Lass sie dir anzeigen.

Überleg dabei kurz: Welche Rolle spielen die einzelnen Spalten in diesem Datensatz? Welche beschreiben das Produkt, welche seine Nährwerte?
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "info-echter-datensatz",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = pd.read_csv('cereals.csv')
daten.info()`,
          text: `
Bevor es an die Analyse geht, verschaffen wir uns eine Zusammenfassung – Datentypen und Anzahl der belegten Werte pro Spalte:

    import pandas as pd

    daten = pd.read_csv('cereals.csv')
    daten.info()
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "fehlende-werte",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = pd.read_csv('cereals.csv')

# Anteil fehlender Werte je Spalte, in Prozent
print(round(100 * daten.isnull().sum() / len(daten), 2))`,
          text: `
**Datenqualität** entscheidet über den Wert jeder Analyse. Schauen wir uns die wichtigsten Dimensionen an.

Zuerst: **fehlende Werte**. In Datenbanken werden sie als NULL markiert, in Pandas als \`NaN\`. \`isnull()\` liefert für jede Zelle \`True\` oder \`False\`, \`sum()\` zählt die \`True\` je Spalte:

    import pandas as pd

    daten = pd.read_csv('cereals.csv')

    # Anteil fehlender Werte je Spalte, in Prozent
    print(round(100 * daten.isnull().sum() / len(daten), 2))
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "duplikate",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = pd.read_csv('cereals.csv')

anzahl_vorher = len(daten)

# subset=None: alle Spalten werden zum Vergleich herangezogen
daten = daten.drop_duplicates(subset=None)

anzahl_nachher = len(daten)
print("Entfernte Duplikate:", anzahl_vorher - anzahl_nachher)`,
          text: `
Die zweite Qualitätsdimension sind **Duplikate** – meist entstehen sie, wenn Datensätze mehrfach gespeichert wurden.

\`drop_duplicates()\` entfernt sie. Die Anzahl ermittelst du, indem du die Zeilenzahl vorher und nachher vergleichst:

    import pandas as pd

    daten = pd.read_csv('cereals.csv')

    anzahl_vorher = len(daten)

    # subset=None: alle Spalten werden zum Vergleich herangezogen
    daten = daten.drop_duplicates(subset=None)

    anzahl_nachher = len(daten)
    print("Entfernte Duplikate:", anzahl_vorher - anzahl_nachher)
`,
          task: "Führ das Programm aus.",
        },
        {
          id: "uebung-neue-spalte",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd

daten = pd.read_csv('cereals.csv')

daten['carbs_gesamt'] = ?

print(daten[['name', 'carbo', 'sugars', 'carbs_gesamt']].head())`,
          tests: [
            {
              args: [],
              expected:
                "                        name  carbo  sugars  carbs_gesamt\n0                  100% Bran    5.0       6          11.0\n1          100% Natural Bran    8.0       8          16.0\n2                   All-Bran    7.0       5          12.0\n3  All-Bran with Extra Fiber    8.0       0           8.0\n4             Almond Delight   14.0       8          22.0\n",
            },
          ],
          solution: `import pandas as pd

daten = pd.read_csv('cereals.csv')

daten['carbs_gesamt'] = daten['carbo'] + daten['sugars']

print(daten[['name', 'carbo', 'sugars', 'carbs_gesamt']].head())`,
          hints: [
            "Du brauchst die beiden Spalten `carbo` und `sugars`.",
            "Spalten holst du dir mit `daten['carbo']`.",
            "Rechenoperationen wirken bei Pandas auf die ganze Spalte – ganz ohne Schleife.",
            "`daten['carbo'] + daten['sugars']`",
          ],
          text: `
Zum Abschluss erweiterst du den Datensatz um eine eigene Spalte.

Dir ist vielleicht aufgefallen, dass zwischen Kohlenhydraten (\`carbo\`) und Zucker (\`sugars\`) unterschieden wird. Zucker ist aber eine Unterart der Kohlenhydrate – deshalb legen wir eine Spalte \`carbs_gesamt\` an, die beide zusammenfasst.

Beachte, wie am Ende mehrere Spalten auf einmal ausgewählt werden: mit einer **Liste** von Spaltennamen in den eckigen Klammern.
`,
          task: "Ersetze das `?` durch die Summe der beiden Spalten.",
        },
      ],
      outro: `
Ausgezeichnet – das war eine vollständige kleine Datenanalyse! 🎉

Du hast den Weg durchlaufen, den jedes Datenprojekt nimmt:

1. **Laden** – \`pd.read_csv()\`
2. **Verstehen** – \`head()\`, \`shape\`, \`columns\`, \`info()\`
3. **Qualität prüfen** – fehlende Werte, Duplikate
4. **Anreichern** – neue Spalten aus vorhandenen berechnen

Punkt 3 wird in der Praxis regelmäßig unterschätzt. Eine Analyse auf schlechten Daten liefert saubere, schön formatierte – und falsche Ergebnisse.

Im nächsten Kapitel trainierst du auf solchen Daten ein erstes Machine-Learning-Modell.
`,
    },
  ],
};
