"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { consumeProgressStale } from "@/lib/progressStale";

/**
 * Holt den Lernpfad einmal nach, wenn in einer Lektion etwas gelöst wurde.
 *
 * Siehe `@/lib/progressStale` – ohne das zeigte die Übersicht nach dem
 * Zurücknavigieren den Stand von vor der Lektion.
 */
export function RefreshOnStaleProgress() {
  const router = useRouter();

  useEffect(() => {
    if (consumeProgressStale()) router.refresh();
  }, [router]);

  return null;
}
