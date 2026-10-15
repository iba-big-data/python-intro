import type { Chapter } from "../types";

export const sklearn: Chapter = {
  id: "sklearn",
  number: 12,
  title: "Machine Learning",
  summary: "Ein Modell trainieren, das aus Daten lernt und Vorhersagen trifft.",
  icon: "🤖",
  track: "data",
  lessons: [
    /* ================================================================== *
     *  1 – Das erste Modell
     * ================================================================== */
    {
      id: "sklearn/erstes-modell",
      title: "Dein erstes Modell",
      summary: "Von Rohdaten zur Vorhersage – in fünf Schritten.",
      steps: [
        {
          id: "daten-laden",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

df = pd.read_csv('student_grades.csv')
print(df)`,
          text: `
**scikit-learn** (im Code \`sklearn\`) ist *die* Machine-Learning-Bibliothek für Python. Sie bietet Werkzeuge für Klassifikation, Regression, Clustering, Vorverarbeitung und Modellauswahl – alle nach demselben, immer gleichen Schema.

Und genau das ist die gute Nachricht: Wenn du **ein** Modell trainieren kannst, kannst du sie alle.

Zum Trainieren brauchst du zuerst Daten. Wir nehmen einen kleinen Datensatz über Studierende, ihre Lernzeit und die erreichte Note:

    import pandas as pd

    df = pd.read_csv('student_grades.csv')
    print(df)
`,
          task: "Lade den Datensatz und schau ihn dir an.",
        },
        {
          id: "daten-aufteilen",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv('student_grades.csv')

# Merkmale (X) und Zielvariable (y) trennen
X = df.drop(columns=['Student', 'Grade'])   # X enthält nur die Lernzeit
y = df['Grade']                             # y ist das, was vorhergesagt werden soll

# In Trainings- und Testdaten aufteilen
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print('X_train:')
print(X_train)
print('X_test:')
print(X_test)
print('y_train:')
print(y_train)
print('y_test:')
print(y_test)`,
          text: `
Bevor du trainierst, musst du zwei Trennungen vornehmen.

**Erstens: Merkmale und Ziel.** Die Spalten, aus denen das Modell lernen soll, heißen üblicherweise \`X\` (die *Features*). Die Spalte, die vorhergesagt werden soll, heißt \`y\` (das *Target*). Hier: aus der Lernzeit die Note vorhersagen.

**Zweitens: Training und Test.** Du darfst dein Modell nicht mit denselben Daten bewerten, mit denen du es trainiert hast – das wäre, als würdest du eine Klausur mit den Übungsaufgaben abnehmen, die du vorher verteilt hast. \`train_test_split\` teilt die Daten zufällig auf.

    import pandas as pd
    from sklearn.model_selection import train_test_split

    df = pd.read_csv('student_grades.csv')

    # Merkmale (X) und Zielvariable (y) trennen
    X = df.drop(columns=['Student', 'Grade'])   # X enthält nur die Lernzeit
    y = df['Grade']                             # y ist das, was vorhergesagt werden soll

    # In Trainings- und Testdaten aufteilen
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print('X_train:')
    print(X_train)
    print('X_test:')
    print(X_test)
    print('y_train:')
    print(y_train)
    print('y_test:')
    print(y_test)
`,
          task: "Führ das Programm aus und sieh dir die vier Teile an.",
        },
        {
          id: "modell-trainieren",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

df = pd.read_csv('student_grades.csv')

X = df.drop(columns=['Student', 'Grade'])
y = df['Grade']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Modell wählen und trainieren
modell = LinearRegression()
modell.fit(X_train, y_train)

print('Das Modell wurde erfolgreich trainiert.')
print('Steigung:', modell.coef_[0])
print('Achsenabschnitt:', modell.intercept_)`,
          text: `
\`test_size=0.2\` bedeutet: 20 % der Daten werden zum Testen zurückgelegt, 80 % zum Trainieren. Und \`random_state=42\` setzt einen festen Startwert für den Zufall – damit bekommst du bei jedem Lauf **dieselbe** Aufteilung und deine Ergebnisse sind reproduzierbar.

Jetzt das Modell. scikit-learn bietet \`LinearRegression\`, \`LogisticRegression\`, \`DecisionTree\` und viele mehr. Wir nehmen die **lineare Regression**: Sie legt eine Gerade durch die Datenpunkte.

Und jetzt kommt das Schöne – das Training ist **eine einzige Zeile**:

    import pandas as pd
    from sklearn.model_selection import train_test_split
    from sklearn.linear_model import LinearRegression

    df = pd.read_csv('student_grades.csv')

    X = df.drop(columns=['Student', 'Grade'])
    y = df['Grade']
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Modell wählen und trainieren
    modell = LinearRegression()
    modell.fit(X_train, y_train)

    print('Das Modell wurde erfolgreich trainiert.')
    print('Steigung:', modell.coef_[0])
    print('Achsenabschnitt:', modell.intercept_)
`,
          task: "Trainiere das Modell und sieh dir die gelernten Werte an.",
        },
        {
          id: "vorhersage-einzeln",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

df = pd.read_csv('student_grades.csv')

X = df.drop(columns=['Student', 'Grade'])
y = df['Grade']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

modell = LinearRegression()
modell.fit(X_train, y_train)

# Probier ruhig verschiedene Lernzeiten aus!
neue_lernzeit = 25

neuer_student = pd.DataFrame({'Study time (Hours)': [neue_lernzeit]})
vorhersage = modell.predict(neuer_student)[0]

print(f"Bei {neue_lernzeit} Stunden Lernzeit sagt das Modell die Note {vorhersage:.2f} voraus.")`,
          text: `
Das Modell hat aus den Daten zwei Zahlen gelernt: eine **Steigung** und einen **Achsenabschnitt**. Zusammen beschreiben sie eine Gerade – mehr ist eine lineare Regression nicht.

Damit kann es jetzt Vorhersagen treffen. Probier verschiedene Werte für \`neue_lernzeit\` aus:

    # Probier ruhig verschiedene Lernzeiten aus!
    neue_lernzeit = 25

    neuer_student = pd.DataFrame({'Study time (Hours)': [neue_lernzeit]})
    vorhersage = modell.predict(neuer_student)[0]

    print(f"Bei {neue_lernzeit} Stunden Lernzeit sagt das Modell die Note {vorhersage:.2f} voraus.")
`,
          task: "Führ das Programm aus und probier verschiedene Lernzeiten.",
        },
        {
          id: "vorhersagen-vergleichen",
          carryOver: true,
          kind: "run",
          surface: "editor",
          program: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

df = pd.read_csv('student_grades.csv')

X = df.drop(columns=['Student', 'Grade'])
y = df['Grade']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

modell = LinearRegression()
modell.fit(X_train, y_train)

# Vorhersagen für die zurückgelegten Testdaten
y_pred = modell.predict(X_test)

# Ergebnisse übersichtlich nebeneinanderstellen
ergebnis = X_test.copy()
ergebnis['Vorhergesagt'] = y_pred.round(1)
ergebnis['Tatsächlich'] = y_test.values
ergebnis['Student'] = df.loc[X_test.index, 'Student']
ergebnis = ergebnis[['Student', 'Study time (Hours)', 'Vorhergesagt', 'Tatsächlich']]

print(ergebnis)`,
          text: `
Der eigentliche Test kommt jetzt: Wie gut ist das Modell bei Daten, die es **noch nie gesehen** hat? Dafür haben wir die Testdaten zurückgelegt.

    # Vorhersagen für die zurückgelegten Testdaten
    y_pred = modell.predict(X_test)

    # Ergebnisse übersichtlich nebeneinanderstellen
    ergebnis = X_test.copy()
    ergebnis['Vorhergesagt'] = y_pred.round(1)
    ergebnis['Tatsächlich'] = y_test.values
    ergebnis['Student'] = df.loc[X_test.index, 'Student']
    ergebnis = ergebnis[['Student', 'Study time (Hours)', 'Vorhergesagt', 'Tatsächlich']]

    print(ergebnis)
`,
          task: "Führ das Programm aus und vergleiche Vorhersage und Wirklichkeit.",
        },
      ],
      outro: `
Glückwunsch – du hast ein Machine-Learning-Modell trainiert und ausgewertet! 🎉

Vergleich die beiden letzten Spalten: Manche Vorhersagen liegen dicht dran, andere daneben. Das ist normal und sogar erwartbar – wir sagen eine Note aus **einer einzigen** Information voraus. Lernzeit ist wichtig, aber eben nicht alles.

Merk dir das Schema, es gilt bei scikit-learn **immer**:

    modell = IrgendeinModell()      # 1. Modell wählen
    modell.fit(X_train, y_train)    # 2. trainieren
    y_pred = modell.predict(X_test) # 3. vorhersagen

Ob lineare Regression, Entscheidungsbaum oder neuronales Netz – nur die erste Zeile ändert sich. Deshalb ist scikit-learn so beliebt.
`,
    },

    /* ================================================================== *
     *  2 – Eigenes Modell
     * ================================================================== */
    {
      id: "sklearn/eigenes-modell",
      title: "Zeig, was du kannst",
      summary: "Autopreise vorhersagen – diesmal schreibst du den Code.",
      steps: [
        {
          id: "autodaten-laden",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd

daten = pd.read_csv('car_prices.csv')
print(daten.head())
print('Form:', daten.shape)`,
          text: `
Zeit, das Gelernte auf einen neuen Datensatz anzuwenden.

\`car_prices.csv\` enthält Gebrauchtwagen: das \`Car Model\`, die gefahrenen Meilen (\`Miles Driven (Thousands)\`) und den Preis (\`Price (Thousands of dollars)\`). Dein Ziel: den **Preis allein aus der Laufleistung** vorhersagen.

Verschaff dir zuerst einen Überblick:

    import pandas as pd

    daten = pd.read_csv('car_prices.csv')
    print(daten.head())
    print('Form:', daten.shape)
`,
          task: "Lade den Datensatz und sieh ihn dir an.",
        },
        {
          id: "uebung-aufteilen",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd
from sklearn.model_selection import train_test_split

daten = pd.read_csv('car_prices.csv')

# Merkmale und Zielvariable trennen
X = daten.drop(columns=?)
y = daten['Price (Thousands of dollars)']

# 80 % Training, 20 % Test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=?, random_state=42
)

print(f"Trainingsdaten: {len(X_train)}, Testdaten: {len(X_test)}")`,
          tests: [{ args: [], expected: "Trainingsdaten: 40, Testdaten: 10\n" }],
          solution: `import pandas as pd
from sklearn.model_selection import train_test_split

daten = pd.read_csv('car_prices.csv')

X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Trainingsdaten: {len(X_train)}, Testdaten: {len(X_test)}")`,
          hints: [
            "In `X` soll am Ende nur noch die Spalte `Miles Driven (Thousands)` übrig sein.",
            "Du musst also zwei Spalten entfernen: `Car Model` und die Zielspalte.",
            "`drop(columns=...)` erwartet eine **Liste** von Spaltennamen.",
            "`daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])`",
            "Und `test_size` gibt den Anteil der Testdaten an: 20 % sind `0.2`.",
          ],
          text: `
Jetzt du. Trenne Merkmale und Zielvariable und teile die Daten auf.

In \`X\` soll am Ende **nur noch** die Spalte \`Miles Driven (Thousands)\` stehen – das Automodell ist als Text für die Regression nicht verwendbar, und der Preis ist ja gerade das Gesuchte.

Verwende 80 % der Daten zum Trainieren.
`,
          task: "Ersetze die beiden `?`.",
        },
        {
          id: "uebung-trainieren",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

daten = pd.read_csv('car_prices.csv')
X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Modell wählen und trainieren
modell = ?
?

print(f"Steigung: {modell.coef_[0]:.4f}, Achsenabschnitt: {modell.intercept_:.4f}")`,
          tests: [
            { args: [], expected: "Steigung: -0.0955, Achsenabschnitt: 98.8346\n" },
          ],
          solution: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

daten = pd.read_csv('car_prices.csv')
X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

modell = LinearRegression()
modell.fit(X_train, y_train)

print(f"Steigung: {modell.coef_[0]:.4f}, Achsenabschnitt: {modell.intercept_:.4f}")`,
          hints: [
            "Das Schema aus der vorigen Lektion: erst das Modell erzeugen, dann trainieren.",
            "Erzeugen: `LinearRegression()` – die Klammern nicht vergessen!",
            "Trainieren: `modell.fit(...)`",
            "`fit` bekommt die **Trainings**daten, also `X_train` und `y_train`.",
          ],
          text: `
Trainiere jetzt eine lineare Regression auf den Trainingsdaten.

Denk an das Zwei-Schritte-Schema: erst das Modell erzeugen, dann mit \`fit\` trainieren.
`,
          task: "Ersetze die beiden `?`.",
        },
        {
          id: "uebung-vorhersagen",
          kind: "exercise",
          mode: "stdout",
          params: [],
          starter: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

daten = pd.read_csv('car_prices.csv')
X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
modell = LinearRegression()
modell.fit(X_train, y_train)

# Vorhersagen für die Testdaten
y_pred = ?

print(f"Erste Vorhersage: {y_pred[0]:.2f}")
print(f"Durchschnittlicher Fehler: {abs(y_pred - y_test.values).mean():.2f}")`,
          tests: [
            {
              args: [],
              expected: "Erste Vorhersage: 94.73\nDurchschnittlicher Fehler: 3.19\n",
            },
          ],
          solution: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

daten = pd.read_csv('car_prices.csv')
X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
modell = LinearRegression()
modell.fit(X_train, y_train)

y_pred = modell.predict(X_test)

print(f"Erste Vorhersage: {y_pred[0]:.2f}")
print(f"Durchschnittlicher Fehler: {abs(y_pred - y_test.values).mean():.2f}")`,
          hints: [
            "Der dritte Schritt des Schemas: `predict`.",
            "Vorhergesagt wird für die **Testdaten** – die kennt das Modell noch nicht.",
            "`modell.predict(X_test)`",
          ],
          text: `
Dein Modell ist trainiert – jetzt lass es Vorhersagen für die Testdaten treffen.

Der zweite \`print\` berechnet zusätzlich den **durchschnittlichen absoluten Fehler**: um wie viel liegt die Vorhersage im Mittel daneben?
`,
          task: "Ersetze das `?`.",
        },
        {
          id: "ergebnis-tabelle",
          kind: "run",
          surface: "editor",
          program: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

daten = pd.read_csv('car_prices.csv')
X = daten.drop(columns=['Car Model', 'Price (Thousands of dollars)'])
y = daten['Price (Thousands of dollars)']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
modell = LinearRegression()
modell.fit(X_train, y_train)
y_pred = modell.predict(X_test)

ergebnis = X_test.copy()
ergebnis['Vorhergesagt'] = y_pred.round(1)
ergebnis['Tatsächlich'] = y_test.values
ergebnis['Modell'] = daten.loc[X_test.index, 'Car Model']
ergebnis = ergebnis[['Modell', 'Miles Driven (Thousands)', 'Vorhergesagt', 'Tatsächlich']]

print(ergebnis)`,
          text: `
Zum Abschluss stellen wir Vorhersage und Wirklichkeit nebeneinander. Kopier den Code und schau dir an, bei welchen Autos das Modell danebenliegt:

    ergebnis = X_test.copy()
    ergebnis['Vorhergesagt'] = y_pred.round(1)
    ergebnis['Tatsächlich'] = y_test.values
    ergebnis['Modell'] = daten.loc[X_test.index, 'Car Model']
    ergebnis = ergebnis[['Modell', 'Miles Driven (Thousands)', 'Vorhergesagt', 'Tatsächlich']]

    print(ergebnis)
`,
          task: "Führ das Programm aus.",
        },
      ],
      outro: `
Stark gemacht! 🎉

Dir ist sicher aufgefallen, dass wir für die Vorhersage **nur die Laufleistung** benutzt haben. Bei echten Autopreisen wäre das natürlich zu wenig – Marke, Baujahr, Zustand und Ausstattung spielen mindestens ebenso eine Rolle. Genau deshalb liegt das Modell bei manchen Wagen deutlich daneben.

Das Prinzip bleibt aber immer dasselbe:

1. Du hast eine Größe, die du vorhersagen willst (\`y\`).
2. Du hast Informationen, die dabei helfen könnten (\`X\`).
3. Du teilst in Training und Test.
4. Du trainierst und bewertest ehrlich – auf Daten, die das Modell nicht kannte.

Wenn du weitermachen willst: Ersetz \`LinearRegression()\` durch \`DecisionTreeRegressor()\` (aus \`sklearn.tree\`) und schau, ob der Fehler kleiner wird. Mehr als diese eine Zeile musst du nicht ändern – und genau darin liegt die Stärke von scikit-learn.
`,
    },
  ],
};
