"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RunError = {
  type: string;
  message?: string;
  text: string;
  hint: string | null;
};

export type RunDetail = {
  inputs: string;
  expected: string;
  actual: string;
  mode: "stdout" | "return";
};

export type RunResult = {
  output: string;
  error: RunError | null;
  passed: boolean;
  message: string | null;
  detail?: RunDetail;
  /**
   * Mit welchen Werten die gezeigte Ausgabe entstanden ist, z. B.
   * `woerter = ['Python']`. Übungen laufen gegen versteckte Testfälle – ohne
   * diese Angabe wirkte die Ausgabe zufällig („ist bisschen random, dass da
   * jetzt ‚Python‘ ausgegeben wird, da man die hinterlegte Liste ja nicht
   * kennt“).
   */
  inputs?: string;
};

export type PythonPhase = "boot" | "loading" | "packages" | "ready" | "running" | "error";

/** Notbremse, falls der Worker trotz Watchdog nicht mehr antwortet. */
const HARD_TIMEOUT_MS = 30_000;

/**
 * Bei jeder Änderung an pyodide-worker.js oder python_intro_runtime.py hochzählen.
 * Sonst bedienen Browser den alten Stand aus dem Cache weiter.
 */
export const RUNTIME_VERSION = "5";

type Pending = {
  resolve: (result: RunResult) => void;
  timer: ReturnType<typeof setTimeout>;
};

export function usePython() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<number, Pending>>(new Map());
  const counterRef = useRef(0);

  const [phase, setPhase] = useState<PythonPhase>("boot");
  const [statusText, setStatusText] = useState<string | null>("Python wird gestartet …");
  /** grober Ladefortschritt 0 … 1, damit der erste Start nicht wie ein Hänger wirkt */
  const [progress, setProgress] = useState(0);

  const spawn = useCallback(() => {
    const worker = new Worker(`/pyodide-worker.js?v=${RUNTIME_VERSION}`, { type: "module" });

    worker.onmessage = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "status") {
        setPhase(message.phase);
        setStatusText(message.detail ?? null);
        if (typeof message.progress === "number") setProgress(message.progress);
        return;
      }

      if (message.type === "ready") {
        setPhase("ready");
        setStatusText(null);
        setProgress(1);
        return;
      }

      if (message.type === "fatal") {
        setPhase("error");
        setStatusText(message.message);
        return;
      }

      if (message.type === "result") {
        const pending = pendingRef.current.get(message.id);
        if (pending) {
          clearTimeout(pending.timer);
          pendingRef.current.delete(message.id);
          pending.resolve(message.result as RunResult);
        }
      }
    };

    worker.onerror = () => {
      setPhase("error");
      setStatusText("Die Python-Umgebung konnte nicht geladen werden.");
    };

    worker.postMessage({ type: "init" });
    workerRef.current = worker;
    return worker;
  }, []);

  useEffect(() => {
    const worker = spawn();
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [spawn]);

  /** Worker hart neu starten – nach Timeout oder auf Wunsch. */
  const restart = useCallback(() => {
    workerRef.current?.terminate();
    pendingRef.current.forEach((pending) => clearTimeout(pending.timer));
    pendingRef.current.clear();
    setPhase("boot");
    setStatusText("Python wird neu gestartet …");
    setProgress(0);
    spawn();
  }, [spawn]);

  const run = useCallback(
    (code: string, surface: "editor" | "shell", step: unknown): Promise<RunResult> => {
      const worker = workerRef.current;
      if (!worker) {
        return Promise.resolve({
          output: "",
          error: { type: "WorkerError", text: "Python läuft noch nicht.", hint: null },
          passed: false,
          message: "Einen Moment – Python startet gerade.",
        });
      }

      const id = ++counterRef.current;

      return new Promise<RunResult>((resolve) => {
        const timer = setTimeout(() => {
          pendingRef.current.delete(id);
          restart();
          resolve({
            output: "",
            error: {
              type: "TimeoutError",
              text: "Abbruch nach 30 Sekunden.",
              hint: "Dein Code lief zu lange – steckt da vielleicht eine Endlosschleife drin?",
            },
            passed: false,
            message: "Ich habe die Ausführung abgebrochen.",
          });
        }, HARD_TIMEOUT_MS);

        pendingRef.current.set(id, { resolve, timer });
        worker.postMessage({ type: "run", id, code, surface, step });
      });
    },
    [restart],
  );

  const resetShell = useCallback(() => {
    workerRef.current?.postMessage({ type: "resetShell" });
  }, []);

  return {
    run,
    resetShell,
    restart,
    phase,
    statusText,
    progress,
    ready: phase === "ready" || phase === "running",
  };
}
