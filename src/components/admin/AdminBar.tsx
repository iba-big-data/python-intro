"use client";

import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

export function AdminBar() {

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-cyan" />
          <span className="font-bold tracking-tight">
            Python <span className="text-gradient">Intro</span>
            <span className="ml-2 text-xs font-normal text-ink-faint">Lehrenden-Bereich</span>
          </span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-ink-faint transition hover:bg-surface hover:text-ink"
        >
          <LogOut className="size-4" />
          Abmelden
        </button>
      </div>
    </header>
  );
}
