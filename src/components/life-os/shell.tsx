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

const NAV = [{key:"dashboard",label:"Home",icon:"LayoutDashboard"},{key:"inbox",label:"Inbox",icon:"Inbox"},{key:"calendar",label:"Calendar",icon:"CalendarDays"},{key:"focus",label:"Focus",icon:"Brain"},{key:"reviews",label:"Reviews",icon:"NotebookPen"}] as const;
export function Shell() {
 const {view,setQuickCaptureOpen,setCommandOpen,setView}=useLifeOS();
 useEffect(()=>{const onPop=()=>useLifeOS.setState({view:(new URLSearchParams(location.search).get("view")||"dashboard") as any,selectedProjectId:null}); onPop(); addEventListener("popstate",onPop); return()=>removeEventListener("popstate",onPop)},[]);
 useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="p"){e.preventDefault();setCommandOpen(true)} if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setQuickCaptureOpen(true)}}; addEventListener("keydown",h); return()=>removeEventListener("keydown",h)},[setCommandOpen,setQuickCaptureOpen]);
 return <div className="flex h-screen overflow-hidden bg-background"><div className="hidden md:block"><Sidebar/></div><div className="flex min-w-0 flex-1 flex-col"><Topbar/><main className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-28 md:pb-0"><div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8"><AnimatePresence mode="wait"><motion.div key={view} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}><ViewSwitcher view={view}/></motion.div></AnimatePresence></div><footer className="mt-auto border-t border-border/60 px-4 py-4 text-xs text-muted-foreground"><div className="mx-auto flex max-w-6xl items-center justify-between"><span className="flex items-center gap-1.5"><Icon name="Brain" className="h-3.5 w-3.5 text-emerald-500"/><b>The Terminal</b><span>· Your digital brain, interconnected.</span></span><button onClick={()=>setQuickCaptureOpen(true)} className="text-emerald-600 hover:underline">Quick Capture</button></div></footer></main></div><nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-background p-3 md:hidden">{NAV.map(n=><button key={n.key} onClick={()=>setView(n.key)} className="flex flex-col items-center text-xs"><Icon name={n.icon} className="h-5 w-5"/><span>{n.label}</span></button>)}</nav><QuickCapture/><ItemEditor/><ItemDetailSheet/><CommandPalette/><ShortcutsHelp/><NotificationManager/><OnboardingFlow/></div>;
}
function ViewSwitcher({view}:{view:string}) { if(view==="dashboard")return <DashboardView/>;if(view==="inbox")return <InboxView/>;if(view==="calendar")return <CalendarView/>;if(view==="agenda")return <AgendaView/>;if(view==="focus")return <FocusView/>;if(view==="projects")return <ProjectsView/>;if(view==="graph")return <GraphView/>;if(view==="sanctuary")return <SanctuaryView/>;if(view==="journal")return <JournalEditorView/>;if(view==="reviews")return <ReviewsView/>;if(view==="insights")return <InsightsView/>;if(view==="all")return <AllItemsView/>;if(view==="settings")return <SettingsView/>;return <DomainView domainKey={view}/>; }
