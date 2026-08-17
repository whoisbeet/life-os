"use client";

import { useEffect, useState } from "react";
import { useLifeOS } from "@/store/life-os";

export function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const { setView } = useLifeOS();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("lifeos-onboarded")) setOpen(true);
  }, []);

  if (!open) return null;
  const finish = () => { localStorage.setItem("lifeos-onboarded", "1"); setOpen(false); setView("dashboard"); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div role="dialog" aria-label="Welcome to The Terminal" className="w-full max-w-md rounded-xl border bg-background p-6 shadow-xl">
        <h2 className="text-xl font-bold">Welcome to The Terminal</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your interconnected digital brain for tasks, notes, and reflections.</p>
        <button type="button" onClick={finish} className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground">Get started</button>
      </div>
    </div>
  );
}
