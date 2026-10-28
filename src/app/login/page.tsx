import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, students } from "@/lib/db/schema";
import { getStudentSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

/**
 * Wer noch angemeldet ist, sieht das Formular gar nicht erst: Eine zweite
 * Anmeldung mit Kennwort würde sonst ein neues, leeres Konto anlegen und das
 * Cookie zum alten Fortschritt überschreiben. Geprüft wird auch die Datenbank –
 * zeigt das Cookie auf einen gelöschten Datensatz, schickt /lernen hierher
 * zurück, und ohne diese Prüfung entstünde eine Weiterleitungsschleife.
 */
export default async function LoginPage() {
  const session = await getStudentSession();
  if (session) {
    const [current] = await db
      .select({ id: students.id })
      .from(students)
      .innerJoin(courses, eq(courses.id, students.courseId))
      .where(eq(students.id, session.studentId))
      .limit(1);
    if (current) redirect("/lernen");
  }

  return <LoginForm />;
}
