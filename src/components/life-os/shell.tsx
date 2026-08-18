"use client";

import { useLifeOS } from "@/store/life-os";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { QuickCapture } from "./quick-capture";
import { ItemEditor } from "./item-editor";
import { ItemDetailSheet } from "./item-detail-sheet";
import { CommandPalette } from "./command-palette";
import { ShortcutsHelp } from "./shortcuts-help";
import { NotificationManager } from "./notifications";
import { OnboardingFlow } from "./onboarding-flow";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardView } from "./views/dashboard-view";
import { InboxView } from "./views/inbox-view";
import { CalendarView } from "./views/calendar-view";
import { ProjectsView } from "./views/projects-view";
import { ReviewsView } from "./views/reviews-view";
import { DomainView } from "./views/domain-view";
import { AllItemsView } from "./views/all-items-view";
import { FocusView } from "./views/focus-view";
import { InsightsView } from "./views/insights-view";
import { GraphView } from "./views/graph-view";
import { AgendaView } from "./views/agenda-view";
import { SanctuaryView } from "./views/sanctuary-view";
import { JournalEditorView } from "./views/journal-editor-view";
import { SettingsView } from "./views/settings-view";
import { Icon } from "./icon";
import { useEffect } from "react";

const MOBILE_NAV = [{ key: "dashboard", label: "Dashboard", icon: "LayoutDashboard" }, { key: "inbox", label: "Inbox", icon: "Inbox" }, { key: "calendar", label: "Calendar", icon: "CalendarDays" }, { key: "agenda", label: "Agenda", icon: "CalendarRange" }, { key: "focus", label: "Focus", icon: "Brain" }, { key: "projects", label: "Projects", icon: "FolderKanban" }, { key: "graph", label: "Brain Graph", icon: "Network" }, { key: "reviews", label: "Reviews", icon: "NotebookPen" }, { key: "insights", label: "Insights", icon: "TrendingUp" }, { key: "all", label: "All Items", icon: "Layers" }] as const;

export function Shell() {
  const { view, setQuickCaptureOpen, setCommandOpen, setView } = useLifeOS();

  useEffect(() => {
    const urlView = new URLSearchParams(window.location.search).get("view") as any;
    if (urlView) useLifeOS.setState({ view: urlView });
    const onPopState = () => {
      const next = new URLSearchParams(window.location.search).get("view") || "dashboard";
      useLifeOS.setState({ view: next as any, selectedProjectId: null });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;
    function handler(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "/") { e.preventDefault(); document.querySelector<HTMLInputElement>('input[placeholder="Search your brain…"]')?.focus(); return; }
      if (gPressed) {
        const map: Record<string, any> = { d: "dashboard", i: "inbox", c: "calendar", a: "agenda", f: "focus", p: "projects", g: "graph", r: "reviews", s: "insights", n: "sanctuary" };
        if (map[e.key.toLowerCase()]) { e.preventDefault(); setView(map[e.key.toLowerCase()]); }
        gPressed = false; if (gTimer) clearTimeout(gTimer); return;
      }
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) { gPressed = true; if (gTimer) clearTimeout(gTimer); gTimer = setTimeout(() => { gPressed = false; }, 800); }
    }
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [setView]);

  useEffect(() => { fetch("/api/scheduler", { method: "POST" }).catch(() => {}); }, []);

  return <div className="flex h-screen overflow-hidden bg-background">
    <Sidebar />
    <div className="flex min-w-0 flex-1 flex-col"><Topbar /><main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(7rem+env(safe-area-inset-bottom,0px)+20px)] md:pb-0"><div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><AnimatePresence mode="wait"><motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}><ViewSwitcher view={view} /></motion.div></AnimatePresence></div><Footer onQuickCapture={() => setQuickCaptureOpen(true)} onCommand={() => setCommandOpen(true)} /></main></div>
    <MobileBottomNav view={view} onNavigate={setView} />
    <QuickCapture /><ItemEditor /><ItemDetailSheet /><CommandPalette /><ShortcutsHelp /><NotificationManager /><OnboardingFlow />
  </div>;
}

function MobileBottomNav({ view, onNavigate }: { view: string; onNavigate: (view: any) => void }) {
  return <nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background px-2 pt-3 shadow-lg backdrop-blur-md md:hidden" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}><div className="mx-auto flex max-w-lg flex-row items-center overflow-x-auto no-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>{MOBILE_NAV.map((item) => { const active = view === item.key; return <button key={item.key} onClick={() => onNavigate(item.key)} aria-current={active ? "page" : undefined} className={`flex min-w-[4rem] shrink-0 flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-medium transition-colors ${active ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}><Icon name={item.icon} className="h-6 w-6" /><span>{item.label}</span></button>; })}</div></nav>;
}

function ViewSwitcher({ view }: { view: string }) { if (view === "dashboard") return <DashboardView />; if (view === "inbox") return <InboxView />; if (view === "calendar") return <CalendarView />; if (view === "agenda") return <AgendaView />; if (view === "focus") return <FocusView />; if (view === "projects") return <ProjectsView />; if (view === "graph") return <GraphView />; if (view === "sanctuary") return <SanctuaryView />; if (view === "journal") return <JournalEditorView />; if (view === "reviews") return <ReviewsView />; if (view === "insights") return <InsightsView />; if (view === "all") return <AllItemsView />; if (view === "settings") return <SettingsView />; return <DomainView domainKey={view} />; }

function Footer({ onQuickCapture, onCommand }: { onQuickCapture: () => void; onCommand: () => void }) { return <footer className="mt-auto border-t border-border/60 bg-background/60 px-4 py-4 backdrop-blur-sm"><div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row"><div className="flex items-center gap-1.5"><Icon name="Brain" className="h-3.5 w-3.5 text-emerald-500" /><span className="font-medium">Life OS</span><span className="text-muted-foreground/60">·</span><span>Your digital brain, interconnected.</span></div><div className="flex items-center gap-3"><button onClick={onCommand} className="hidden items-center gap-1 hover:text-foreground sm:inline-flex"><kbd className="rounded border border-border bg-muted px-1">⌘P</kbd> command</button><span className="hidden text-muted-foreground/60 sm:inline">·</span><span className="hidden sm:inline"><kbd className="rounded border border-border bg-muted px-1">⌘K</kbd> capture · <kbd className="rounded border border-border bg-muted px-1">⌘P</kbd> command · <kbd className="rounded border border-border bg-muted px-1">?</kbd> help</span><button onClick={onQuickCapture} className="inline-flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400"><Icon name="Zap" className="h-3 w-3" /> Quick Capture</button></div></div></footer>; }
