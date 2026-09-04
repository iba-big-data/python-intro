/**
 * Schreibt den kompletten Lerninhalt als JSON nach tools/content.json,
 * damit ihn das Python-Prüfskript (tools/verify_content.py) lesen kann.
 *
 *   npm run content:export
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { chapters } from "../src/content";

mkdirSync("tools", { recursive: true });
writeFileSync("tools/content.json", JSON.stringify(chapters, null, 2), "utf-8");

const lessons = chapters.flatMap((chapter) => chapter.lessons);
const steps = lessons.flatMap((lesson) => lesson.steps);

console.log(
  `✓ ${chapters.length} Kapitel, ${lessons.length} Lektionen, ${steps.length} Steps ` +
    `(${steps.filter((step) => step.kind === "exercise").length} Übungen) ` +
    `nach tools/content.json geschrieben`,
);
