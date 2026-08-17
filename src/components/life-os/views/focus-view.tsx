"use client";

import { useEffect, useState } from "react";
import { useLifeOS } from "@/store/life-os";
import { useItems } from "@/lib/hooks";
import { Icon } from "../icon";
import { PageHeader, SectionCard } from "../layout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/toast";

type Mode = "focus" | "short" | "long" | "custom";
const PRESETS: Record<Mode, { label: string; mins: number; color: string; icon: string }> = {
  focus: { label: "Deep Focus", mins: 25, color: "#f59e0b", icon: "Brain" },
  short: { label: "Short Break", mins: 5, color: "#10b981", icon: "Coffee" },
  long: { label: "Long Break", mins: 15, color: "#06b6d4", icon: "Leaf" },
  custom: { label: "Custom", mins: 20, color: "#a78bfa", icon: "Timer" },
};

export function FocusView() {
  const { openItemEditor } = useLifeOS();
  const { data: tasksData, isLoading: tasksLoading } = useItems({ type: "task", status: "active" });
  const { data: habitsData, isLoading: habitsLoading } = useItems({ type: "habit", status: "active" });
  const tasks = (tasksData?.items || []).filter((item) => item.dueDate || item.priority >= 2).slice(0, 8);
  const habits = (habitsData?.items || []).slice(0, 6);
  const [mode, setMode] = useState<Mode>("focus");
  const [customMins, setCustomMins] = useState(20);
  const [remaining, setRemaining] = useState(PRESETS.focus.mins * 60);
  const [running, setRunning] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          setRunning(false);
          notify.success("Focus complete!", "Take a short break.");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setRunning(false);
    setRemaining((nextMode === "custom" ? customMins : PRESETS[nextMode].mins) * 60);
  }

  const preset = PRESETS[mode];
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const selectedItem = [...tasks, ...habits].find((item) => item.id === selectedItemId);

  if (tasksLoading || habitsLoading) {
    return <div className="space-y-6"><PageHeader title="Focus & Deep Work" subtitle="Protect your attention and build a focused practice." icon="Brain" color="#f59e0b" /><div className="h-80 animate-pulse rounded-2xl border border-border/60 bg-card/40" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Focus & Deep Work" subtitle="Protect your attention. Run a pomodoro, connect it to a habit, and watch your practice grow." icon="Brain" color="#f59e0b" />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SectionCard className="overflow-hidden">
          <div className="mb-6 flex flex-wrap justify-center gap-1 rounded-xl bg-muted p-1">
            {(Object.keys(PRESETS) as Mode[]).map((itemMode) => (
              <button key={itemMode} onClick={() => switchMode(itemMode)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === itemMode ? "bg-background shadow-sm" : "text-muted-foreground")} style={mode === itemMode ? { color: PRESETS[itemMode].color } : undefined}>{PRESETS[itemMode].label}</button>
            ))}
          </div>
          {mode === "custom" && <div className="mb-4 flex items-center justify-center gap-2"><Input type="number" min={1} max={180} value={customMins} onChange={(event) => { const value = Math.max(1, Math.min(180, Number(event.target.value) || 1)); setCustomMins(value); setRemaining(value * 60); }} className="h-9 w-20 text-center" /><span className="text-sm text-muted-foreground">minutes</span></div>}
          <div className="flex flex-col items-center py-16">
            <Icon name={preset.icon} className="mb-3 h-8 w-8" style={{ color: preset.color }} />
            <div className="font-mono text-7xl font-bold tabular-nums">{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</div>
            <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{running ? "in progress" : remaining === 0 ? "complete" : "ready"}</div>
            <div className="mt-6 flex gap-3"><Button size="lg" onClick={() => setRunning((value) => !value)} disabled={remaining === 0} style={{ background: running ? "var(--destructive)" : preset.color, color: "white" }}>{running ? "Pause" : "Start"}</Button><Button size="lg" variant="outline" onClick={() => { setRunning(false); setRemaining((mode === "custom" ? customMins : preset.mins) * 60); }}>Reset</Button></div>
          </div>
        </SectionCard>
        <SectionCard title="Focus on" icon="Target">
          {tasks.length > 0 && <div className="mb-3"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-500">Tasks</p><Select value={tasks.some((item) => item.id === selectedItemId) ? selectedItemId : "none"} onValueChange={(value) => setSelectedItemId(value === "none" ? "" : value)}><SelectTrigger className="h-9"><SelectValue placeholder="Pick a task…" /></SelectTrigger><SelectContent className="max-h-60"><SelectItem value="none">No task</SelectItem>{tasks.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>}
          {habits.length > 0 && <div className="mb-3"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-500">Habits</p><Select value={habits.some((item) => item.id === selectedItemId) ? selectedItemId : "none"} onValueChange={(value) => setSelectedItemId(value === "none" ? "" : value)}><SelectTrigger className="h-9"><SelectValue placeholder="Pick a habit…" /></SelectTrigger><SelectContent className="max-h-60"><SelectItem value="none">No habit</SelectItem>{habits.map((item) => <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>)}</SelectContent></Select></div>}
          {selectedItem && <p className="mb-3 text-xs text-muted-foreground">Selected: {selectedItem.title}</p>}
          <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => openItemEditor({ type: "task" })}><Icon name="Plus" className="h-3.5 w-3.5" /> New task</Button>
        </SectionCard>
      </div>
    </div>
  );
}
