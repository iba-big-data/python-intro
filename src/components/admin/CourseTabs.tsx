"use client";

import { useState } from "react";
import { BarChart3, ListChecks, Settings } from "lucide-react";
import type { CourseDashboard as DashboardData } from "@/lib/dashboard";
import { LessonPicker, type PickerChapter } from "./LessonPicker";
import { CourseDashboard } from "./CourseDashboard";
import { CourseSettings } from "./CourseSettings";

const TABS = [
  { id: "lektionen", label: "Lektionen", icon: ListChecks },
  { id: "fortschritt", label: "Fortschritt", icon: BarChart3 },
  { id: "einstellungen", label: "Einstellungen", icon: Settings },
] as const;

export function CourseTabs({
  active,
  courseId,
  chapters,
  selection,
  dashboard,
  course,
}: {
  active: string;
  courseId: string;
  chapters: PickerChapter[];
  selection: string[];
  dashboard: DashboardData;
  course: { id: string; name: string; description: string | null; archived: boolean };
}) {
  const [tab, setTab] = useState(active);

  return (
    <div>
      <div className="mb-7 flex gap-1 border-b border-line">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setTab(entry.id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition ${
              tab === entry.id
                ? "border-cyan text-ink"
                : "border-transparent text-ink-faint hover:text-ink-dim"
            }`}
          >
            <entry.icon className="size-4" />
            {entry.label}
            {entry.id === "fortschritt" && dashboard.students.length > 0 && (
              <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] tabular-nums text-ink-dim">
                {dashboard.students.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "lektionen" && (
        <LessonPicker courseId={courseId} chapters={chapters} initialSelection={selection} />
      )}
      {tab === "fortschritt" && <CourseDashboard data={dashboard} />}
      {tab === "einstellungen" && <CourseSettings course={course} />}
    </div>
  );
}
