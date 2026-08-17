"use client";

import { useLifeOS } from "@/store/life-os";

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useLifeOS();
  if (!commandOpen) return null;
  return (
    <div role="dialog" aria-label="Command palette" className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24" onClick={() => setCommandOpen(false)}>
      <div className="w-full max-w-lg rounded-xl border bg-background p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Command Palette</h2>
          <button type="button" onClick={() => setCommandOpen(false)} className="text-sm text-muted-foreground">Close</button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Search and run commands across The Terminal.</p>
      </div>
    </div>
  );
}
