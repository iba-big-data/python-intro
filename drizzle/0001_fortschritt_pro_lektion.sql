DROP INDEX IF EXISTS "progress_student_step_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "progress_student_lesson_step_idx" ON "progress" USING btree ("student_id","lesson_id","step_id");
