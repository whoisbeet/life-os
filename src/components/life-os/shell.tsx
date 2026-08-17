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

const NAV = [
  { key: "dashboard", label: "Home", icon: "LayoutDashboard", color: "text-emerald-500", active: "bg-emerald-500/15 text-emerald-400" },
  { key: "inbox", label: "Inbox", icon: "Inbox", color: "text-amber-500", active: "bg-amber-500/15 text-amber-400" },
  { key: "calendar", label: "Calendar", icon: "CalendarDays", color: "text-sky-500", active: "bg-sky-500/15 text-sky-400" },
  { key: "focus", label: "Focus", icon: "Brain", color: "text-violet-500", active: "bg-violet-500/15 text-violet-400" },
  { key: "reviews", label: "Reviews", icon: "NotebookPen", color: "text-rose-500", active: "bg-rose-500/15 text-rose-400" },
] as const;

export function Shell() {
  const { view, setQuickCaptureOpen, setCommandOpen, setView } = useLifeOS();
  useEffect(() => { const onPop = () => useLifeOS.setState({ view: (new URLSearchParams(location.search).get("view") || "dashboard") as any, selectedProjectId: null }); onPop(); addEventListener("popstate", onPop); return () => removeEventListener("popstate", onPop); }, []);
  useEffect(() => { const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") { e.preventDefault(); setCommandOpen(true); } if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setQuickCaptureOpen(true); } }; addEventListener("keydown", h); return () => removeEventListener("keydown", h); }, [setCommandOpen, setQuickCaptureOpen]);
  return <div className="flex h-screen overflow-hidden bg-background"><div className="hidden md:block"><Sidebar /></div><div className="flex min-w-0 flex-1 flex-col"><Topbar /><main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0"><div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><AnimatePresence mode="wait"><motion.div key={view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}><ViewSwitcher view={view} /></motion.div></AnimatePresence></div><footer className="mt-auto border-t border-border/60 bg-background/60 px-4 py-4 text-xs text-muted-foreground backdrop-blur-sm"><div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left"><span className="flex max-w-sm flex-col items-center gap-1.5 text-center sm:items-start sm:text-left"><span className="flex items-center gap-1.5"><Icon name="Brain" className="h-3.5 w-3.5 text-emerald-500" /><b>The Terminal</b></span><span className="leading-relaxed">Your digital,<br className="sm:hidden" /> interconnected brain. Built for deep focus and structured clarity.</span></span><button onClick={() => setQuickCaptureOpen(true)} className="text-emerald-600 hover:underline dark:text-emerald-400">Quick Capture</button></div></footer></main></div><nav aria-label="Primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-2 pt-1 shadow-lg backdrop-blur-md md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}><div className="mx-auto flex max-w-lg items-center justify-around">{NAV.map((n) => { const active = view === n.key; return <button key={n.key} onClick={() => setView(n.key)} aria-current={active ? "page" : undefined} className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors ${active ? n.active : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}><Icon name={n.icon} className={`h-5 w-5 ${active ? "" : n.color}`} /><span>{n.label}</span>{active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-current" />}</button>; })}</div></nav><QuickCapture /><ItemEditor /><ItemDetailSheet /><CommandPalette /><ShortcutsHelp /><NotificationManager /><OnboardingFlow /></div>;
}
function ViewSwitcher({ view }: { view: string }) { if (view === "dashboard") return <DashboardView />; if (view === "inbox") return <InboxView />; if (view === "calendar") return <CalendarView />; if (view === "agenda") return <AgendaView />; if (view === "focus") return <FocusView />; if (view === "projects") return <ProjectsView />; if (view === "graph") return <GraphView />; if (view === "sanctuary") return <SanctuaryView />; if (view === "journal") return <JournalEditorView />; if (view === "reviews") return <ReviewsView />; if (view === "insights") return <InsightsView />; if (view === "all") return <AllItemsView />; if (view === "settings") return <SettingsView />; return <DomainView domainKey={view} />; }
