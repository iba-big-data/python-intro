/**
 * Legt einen Demo-Kurs mit fünf Studierenden an, die unterschiedlich weit sind –
 * zum Ausprobieren der Studierenden- und der Lehrenden-Ansicht.
 *
 *   npm run seed:demo
 *
 * Der Fortschritt wird so geschrieben, wie ihn die App selbst schreiben würde:
 * XP nach Tipp-Abzug, Versuche pro Step, Abzeichen aus denselben Regeln.
 * Dadurch stimmen Level, Lernpfad, Profil und Dashboard miteinander überein.
 *
 * Das Skript ist wiederholbar: die fünf Demo-Personen werden bei jedem Lauf
 * neu aufgebaut, ein bereits vorhandener Kurs wird weiterverwendet.
 *
 * Wichtig bei der lokalen Datenbank: PGlite lässt immer nur einen Prozess an
 * den Datenordner. Läuft `npm run dev`, wartet dieses Skript auf die Freigabe –
 * also vorher den Dev-Server beenden.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

const COURSE_NAME = process.env.DEMO_COURSE ?? "Demo-Kurs";
const COURSE_PASSWORD = process.env.DEMO_PASSWORD ?? "demo1234";

type Persona = {
  nickname: string;
  avatar: string;
  /** vollständig abgeschlossene Lektionen, vom Kursanfang an gezählt */
  lessonsDone: number;
  /** wie viel der darauffolgenden Lektion schon geschafft ist (0 … 1) */
  partial: number;
  /** 0 = tut sich schwer (viele Versuche, viele Tipps), 1 = löst fast alles direkt */
  skill: number;
  /** seit wie vielen Tagen dabei */
  daysActive: number;
  /** vor wie vielen Tagen zuletzt gelernt (0 = heute) */
  lastActiveDaysAgo: number;
  streakDays: number;
  /** Uhrzeit der letzten Lösung – 0–4 Uhr bringt das „Nachteule"-Abzeichen */
  hourOfDay: number;
};

/**
 * Die Lektionszahlen zielen auf den vollen Katalog (13 Kapitel, 62 Lektionen).
 * Sind für den Kurs weniger Lektionen freigeschaltet, rücken die Personen
 * entsprechend zusammen – der Abstand zwischen ihnen bleibt erhalten.
 */
const PERSONAS: Persona[] = [
  {
    // Genau das allererste Subkapitel und keinen Schritt weiter.
    nickname: "Mira",
    avatar: "🐢",
    lessonsDone: 1,
    partial: 0,
    skill: 0.5,
    daysActive: 2,
    lastActiveDaysAgo: 2,
    streakDays: 1,
    hourOfDay: 15,
  },
  {
    // Kapitel 1 und 2 durch, steckt mitten in den Variablen.
    nickname: "Jonas",
    avatar: "🦊",
    lessonsDone: 4,
    partial: 0.4,
    skill: 0.35,
    daysActive: 5,
    lastActiveDaysAgo: 1,
    streakDays: 2,
    hourOfDay: 20,
  },
  {
    // Bis ans Ende der Schleifen, jetzt bei den Bedingungen.
    nickname: "Alex",
    avatar: "🧩",
    lessonsDone: 14,
    partial: 0.5,
    skill: 0.3,
    daysActive: 12,
    lastActiveDaysAgo: 0,
    streakDays: 3,
    hourOfDay: 11,
  },
  {
    // Mitten in den Listen – solide Mitte des Kurses.
    nickname: "Sam",
    avatar: "🦉",
    lessonsDone: 24,
    partial: 0.6,
    skill: 0.6,
    daysActive: 16,
    lastActiveDaysAgo: 0,
    streakDays: 6,
    hourOfDay: 9,
  },
  {
    // Fast durch: Daten-Kapitel fertig, sitzt am Abschlussprojekt.
    nickname: "Robin",
    avatar: "🚀",
    lessonsDone: 55,
    partial: 0.5,
    skill: 0.85,
    daysActive: 34,
    lastActiveDaysAgo: 0,
    streakDays: 14,
    hourOfDay: 1,
  },
];

/** Kleiner deterministischer Zufall – zwei Läufe erzeugen dieselben Daten. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;

async function main() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const remote = Boolean(databaseUrl) && !databaseUrl!.startsWith("pglite:");

  // Demo-Daten gehören nicht in die Datenbank, an der ein echter Kurs hängt.
  if (remote && !process.argv.includes("--remote")) {
    console.error(
      "DATABASE_URL zeigt auf eine echte Postgres-Datenbank.\n" +
        "Wenn du die Demo-Studierenden wirklich dort anlegen willst:\n" +
        "  npm run seed:demo -- --remote",
    );
    process.exit(1);
  }

  const { and, eq, inArray } = await import("drizzle-orm");
  const { db } = await import("../src/lib/db");
  const { badges, courseLessons, courses, progress, students } = await import(
    "../src/lib/db/schema"
  );
  const { generateRecoveryCode, hashPassword, slugify } = await import("../src/lib/auth");
  const { computeBadgeStats, getCourseCurriculum, setCourseLessons } = await import(
    "../src/lib/courses"
  );
  const { lessonIds } = await import("../src/content");
  const { stepXp } = await import("../src/content/types");
  const { earnedBadgeIds, levelInfo, todayKey, xpAfterHints } = await import(
    "../src/lib/gamification"
  );

  /* ---------------- Kurs ---------------- */
  const slug = slugify(COURSE_NAME);
  let [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);

  if (!course) {
    [course] = await db
      .insert(courses)
      .values({
        name: COURSE_NAME,
        slug,
        passwordHash: await hashPassword(COURSE_PASSWORD),
        description: "Beispielkurs mit fünf Studierenden auf verschiedenen Ständen.",
      })
      .returning();
    console.log(`✓ Kurs „${COURSE_NAME}" angelegt`);
  } else {
    // Kennwort auffrischen, damit der Login unten immer stimmt.
    await db
      .update(courses)
      .set({ passwordHash: await hashPassword(COURSE_PASSWORD), archived: false })
      .where(eq(courses.id, course.id));
    console.log(`✓ Kurs „${course.name}" bereits vorhanden – wird weiterverwendet`);
  }

  // Lektionsauswahl nur setzen, wenn noch keine getroffen wurde: eine bewusst
  // eingeschränkte Auswahl soll ein zweiter Lauf nicht wieder aufreißen.
  const existingLessons = await db
    .select({ id: courseLessons.id })
    .from(courseLessons)
    .where(eq(courseLessons.courseId, course.id));

  if (existingLessons.length === 0) {
    await setCourseLessons(course.id, lessonIds);
    console.log(`✓ ${lessonIds.length} Lektionen freigeschaltet`);
  } else {
    console.log(`· Lektionsauswahl bleibt, wie sie ist (${existingLessons.length} Lektionen)`);
  }

  const curriculum = await getCourseCurriculum(course.id);
  const lessons = curriculum.flatMap((chapter) => chapter.lessons);

  if (lessons.length === 0) {
    console.error("Der Kurs hat keine freigeschalteten Lektionen – nichts zu tun.");
    process.exit(1);
  }

  /* ---------------- alte Demo-Personen entfernen ---------------- */
  const keys = PERSONAS.map((persona) => slugify(persona.nickname));
  const stale = await db
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.courseId, course.id), inArray(students.nicknameKey, keys)));

  if (stale.length > 0) {
    // Fortschritt und Abzeichen hängen per ON DELETE CASCADE mit dran.
    await db.delete(students).where(
      inArray(
        students.id,
        stale.map((row) => row.id),
      ),
    );
    console.log(`· ${stale.length} vorhandene Demo-Profile zurückgesetzt`);
  }

  /* ---------------- Personen aufbauen ---------------- */
  const now = Date.now();

  for (const [index, persona] of PERSONAS.entries()) {
    const rng = mulberry32(index * 7919 + 13);

    const createdAt = new Date(now - persona.daysActive * DAY);
    const lastActiveAt = new Date(now - persona.lastActiveDaysAgo * DAY - 3 * 3600_000);

    const [student] = await db
      .insert(students)
      .values({
        courseId: course.id,
        nickname: persona.nickname,
        nicknameKey: slugify(persona.nickname),
        recoveryCode: generateRecoveryCode(),
        avatar: persona.avatar,
        createdAt,
        lastActiveAt,
      })
      .returning();

    // Wie weit die Person kommt – begrenzt auf das, was der Kurs hergibt.
    const done = Math.min(persona.lessonsDone, lessons.length);
    const current = done < lessons.length ? lessons[done] : null;
    const partialSteps = current
      ? Math.max(1, Math.min(current.steps.length - 1, Math.round(current.steps.length * persona.partial)))
      : 0;

    type Row = typeof progress.$inferInsert;
    const rows: Row[] = [];
    let xp = 0;

    const plan: { lessonId: string; step: (typeof lessons)[number]["steps"][number]; solved: boolean }[] =
      [];

    for (const lesson of lessons.slice(0, done)) {
      for (const step of lesson.steps) plan.push({ lessonId: lesson.id, step, solved: true });
    }
    if (current && persona.partial > 0) {
      current.steps.forEach((step, stepIndex) => {
        // Der erste ungelöste Step ist der, an dem die Person gerade sitzt –
        // dahinter liegt für sie noch nichts.
        if (stepIndex < partialSteps) plan.push({ lessonId: current.id, step, solved: true });
        else if (stepIndex === partialSteps) plan.push({ lessonId: current.id, step, solved: false });
      });
    }

    // Lösungen gleichmäßig über die aktive Zeit verteilen, damit „zuletzt
    // bearbeitet" und die Reihenfolge im Dashboard stimmen.
    const span = Math.max(1, lastActiveAt.getTime() - createdAt.getTime());

    plan.forEach((entry, position) => {
      const { step, solved } = entry;
      const at = new Date(createdAt.getTime() + (span * (position + 1)) / plan.length);

      // Versuche und Tipps hängen an der Step-Art und daran, wie leicht sich
      // die Person tut. Lesen kostet nie mehr als einen Versuch.
      let attempts = 1;
      let hintsUsed = 0;

      if (step.kind === "exercise") {
        attempts = 1 + Math.floor(rng() * (1 - persona.skill) * 6);
        if (rng() > persona.skill + 0.25) hintsUsed = 1 + Math.floor(rng() * 3);
      } else if (step.kind === "experiment") {
        attempts = 1 + Math.floor(rng() * (1 - persona.skill) * 3);
        if (rng() > persona.skill + 0.45) hintsUsed = 1;
      } else if (step.kind === "run" && step.prediction && rng() > 0.7) {
        attempts = 2;
      }

      if (!solved) {
        // Am aktuellen Step wird gerade gerungen: mehrere Versuche, kein Erfolg.
        attempts = Math.max(2, attempts);
        if (step.kind === "exercise") hintsUsed = Math.max(hintsUsed, 1);
      }

      const lastCode =
        step.kind === "exercise"
          ? solved
            ? step.solution
            : (step.starter ?? `${step.solution.split("\n")[0]}\n    # hier komme ich nicht weiter`)
          : step.kind === "run"
            ? step.program
            : step.kind === "experiment"
              ? (step.example ?? null)
              : null;

      if (solved) xp += xpAfterHints(stepXp(step), hintsUsed);

      rows.push({
        studentId: student.id,
        lessonId: entry.lessonId,
        stepId: step.id,
        solved,
        attempts,
        hintsUsed,
        lastCode,
        firstSeenAt: new Date(at.getTime() - attempts * 90_000),
        solvedAt: solved ? at : null,
        updatedAt: at,
      });
    });

    if (rows.length > 0) {
      // In Häppchen einfügen: der Abschlussstand von Robin sind über 200 Zeilen.
      for (let i = 0; i < rows.length; i += 100) {
        await db.insert(progress).values(rows.slice(i, i + 100));
      }
    }

    await db
      .update(students)
      .set({
        xp,
        streakDays: persona.streakDays,
        lastStreakDay: todayKey(lastActiveAt),
        lastActiveAt,
      })
      .where(eq(students.id, student.id));

    /* ---------------- Abzeichen nach denselben Regeln wie im Betrieb ---------------- */
    const stats = await computeBadgeStats(
      student.id,
      course.id,
      persona.hourOfDay,
      todayKey(lastActiveAt),
    );
    const earned = earnedBadgeIds({ ...stats, streakDays: persona.streakDays });

    if (earned.length > 0) {
      await db
        .insert(badges)
        .values(earned.map((badgeId) => ({ studentId: student.id, badgeId, earnedAt: lastActiveAt })))
        .onConflictDoNothing();
    }

    const info = levelInfo(xp);
    const solvedSteps = rows.filter((row) => row.solved).length;
    const positionLabel = !current
      ? "Kurs durch"
      : persona.partial > 0
        ? `mitten in „${current.title}"`
        : `fertig mit „${lessons[done - 1].title}"`;

    console.log(
      `✓ ${persona.avatar} ${persona.nickname.padEnd(6)} ` +
        `Level ${String(info.level).padStart(2)} (${info.title}) · ` +
        `${String(xp).padStart(4)} XP · ${String(solvedSteps).padStart(3)} Steps · ` +
        `${earned.length} Abzeichen · ${positionLabel}\n` +
        `  Code zum Hineinschlüpfen: ${student.recoveryCode}`,
    );
  }

  console.log(
    `\nAnmeldung als Studierende auf /login:\n` +
      `  Kennwort: ${COURSE_PASSWORD}\n` +
      `  Anzeigename: frei wählbar – dafür entsteht ein neues, leeres Profil.\n\n` +
      `Um in eines der Profile oben zu schlüpfen: auf /login unten auf\n` +
      `"Ich war schon dabei" klicken und den Code hinter dem Namen eingeben.\n\n` +
      `Lehrenden-Ansicht unter /admin (Kennwort aus ADMIN_PASSWORD).`,
  );
}

main()
  .then(() => {
    // Ohne das bleibt der Prozess hängen: die eingebettete Datenbank hält den
    // Event-Loop offen – und mit ihm die Sperre auf dem Datenordner.
    process.exit(0);
  })
  .catch((error) => {
    console.error("Demo-Daten anlegen fehlgeschlagen:", error);
    process.exit(1);
  });
