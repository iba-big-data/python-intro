import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ *
 *  Kurse
 * ------------------------------------------------------------------ */
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    /** Anzeigename, mit dem sich Studierende anmelden */
    name: text("name").notNull(),
    /** kleingeschriebene, normalisierte Fassung von name – für den Login */
    slug: text("slug").notNull(),
    passwordHash: text("password_hash").notNull(),
    description: text("description"),
    /** Kurs ist für Logins gesperrt, ohne ihn zu löschen */
    archived: boolean("archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("courses_slug_idx").on(t.slug)],
);

/** Welche Lektionen sind in diesem Kurs freigeschaltet – und in welcher Reihenfolge */
export const courseLessons = pgTable(
  "course_lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    /** ID aus dem statischen Content-Katalog, z. B. "for-loops.introducing-for-loops" */
    lessonId: text("lesson_id").notNull(),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    uniqueIndex("course_lessons_unique_idx").on(t.courseId, t.lessonId),
    index("course_lessons_course_idx").on(t.courseId),
  ],
);

/* ------------------------------------------------------------------ *
 *  Studierende
 * ------------------------------------------------------------------ */
export const students = pgTable(
  "students",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    /** frei gewählter Anzeigename innerhalb des Kurses */
    nickname: text("nickname").notNull(),
    nicknameKey: text("nickname_key").notNull(),
    avatar: text("avatar").notNull().default("🚀"),

    xp: integer("xp").notNull().default(0),
    streakDays: integer("streak_days").notNull().default(0),
    /** letzter Tag mit gelöster Aufgabe, als YYYY-MM-DD */
    lastStreakDay: text("last_streak_day"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("students_course_nickname_idx").on(t.courseId, t.nicknameKey),
    index("students_course_idx").on(t.courseId),
  ],
);

/* ------------------------------------------------------------------ *
 *  Fortschritt – eine Zeile je Studierende:r und Step
 * ------------------------------------------------------------------ */
export const progress = pgTable(
  "progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    stepId: text("step_id").notNull(),

    solved: boolean("solved").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    hintsUsed: integer("hints_used").notNull().default(0),
    /** zuletzt eingereichter Code – für das Dozierenden-Dashboard */
    lastCode: text("last_code"),

    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    solvedAt: timestamp("solved_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Der Schlüssel muss die Lektion enthalten: Step-IDs sind nur *innerhalb*
    // einer Lektion eindeutig. "indizierung" gibt es z. B. sowohl in
    // listen/index als auch in numpy/fortgeschritten – ohne lessonId hätte das
    // Lösen der einen Aufgabe die andere still als erledigt markiert.
    uniqueIndex("progress_student_lesson_step_idx").on(t.studentId, t.lessonId, t.stepId),
    index("progress_lesson_idx").on(t.lessonId),
    index("progress_student_idx").on(t.studentId),
  ],
);

/* ------------------------------------------------------------------ *
 *  Abzeichen
 * ------------------------------------------------------------------ */
export const badges = pgTable(
  "badges",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    badgeId: text("badge_id").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true }).notNull().defaultNow(),
    meta: jsonb("meta"),
  },
  (t) => [uniqueIndex("badges_student_badge_idx").on(t.studentId, t.badgeId)],
);

export type Course = typeof courses.$inferSelect;
export type Student = typeof students.$inferSelect;
export type ProgressRow = typeof progress.$inferSelect;
export type BadgeRow = typeof badges.$inferSelect;
