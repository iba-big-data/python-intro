-- Anmeldung nur noch über das Kurskennwort.
--
-- Der Anzeigename erkennt niemanden mehr wieder, darf sich also doppeln: aus
-- dem Unique-Index wird ein gewöhnlicher. Dafür bekommt jede:r einen
-- Wiederherstellungscode als zweiten Weg zum eigenen Fortschritt.
--
-- Von Hand nachgezogen, damit die Migration auch auf einer Datenbank mit
-- bestehenden Zeilen durchläuft (erst NULL erlauben, füllen, dann NOT NULL)
-- und ein zweiter Lauf nichts kaputt macht.
DROP INDEX IF EXISTS "students_course_nickname_idx";--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN IF NOT EXISTS "recovery_code" text;--> statement-breakpoint
UPDATE "students"
SET "recovery_code" =
  (ARRAY['lila','flink','leise','wach','rund','hell','kuehn','mild',
         'warm','klar','weit','sanft','froh','keck','fein','zart'])[(1 + floor(random() * 16))::int]
  || '-' ||
  (ARRAY['otter','birke','komet','anker','feder','kiesel','tulpe','wolke',
         'raupe','harfe','muschel','distel','kranich','quelle','nebel','funke'])[(1 + floor(random() * 16))::int]
  || '-' || substr(translate(md5(random()::text || "id"::text), '01ilo', 'qrstu'), 1, 6)
WHERE "recovery_code" IS NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "recovery_code" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "students_recovery_code_idx" ON "students" USING btree ("recovery_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "students_course_nickname_idx" ON "students" USING btree ("course_id","nickname_key");
