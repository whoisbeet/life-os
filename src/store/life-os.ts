"use client";

import { create } from "zustand";

export type ViewKey =
  | "dashboard" | "inbox" | "calendar" | "projects" | "reviews" | "all" | "focus" | "insights" | "graph" | "agenda" | "sanctuary" | "journal" | "settings" | "mind_soul" | "time_action" | "health" | "wealth" | "network" | "growth" | "creativity" | "admin";

interface LifeOSState {
  view: ViewKey; selectedProjectId: string | null; quickCaptureOpen: boolean; itemDetailId: string | null; itemEditorOpen: boolean; itemEditorSeed: Partial<{ id: string; type: string; projectId: string; domainId: string; title: string }> | null; commandOpen: boolean; calendarLayers: string[]; calendarLayerMode: "type" | "domain"; journalEditId: string | null;
  setView: (v: ViewKey) => void; openProject: (id: string) => void; setQuickCaptureOpen: (v: boolean) => void; openItemDetail: (id: string) => void; closeItemDetail: () => void; openItemEditor: (seed?: any) => void; closeItemEditor: () => void; setCommandOpen: (v: boolean) => void; toggleLayer: (id: string) => void; setCalendarLayerMode: (m: "type" | "domain") => void; openJournalEditor: (id: string | null) => void;
}

function syncViewToUrl(view: ViewKey) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (view === "dashboard") url.searchParams.delete("view");
  else url.searchParams.set("view", view);
  window.history.pushState({ view }, "", url);
}

export const useLifeOS = create<LifeOSState>((set) => ({
  view: "dashboard", selectedProjectId: null, quickCaptureOpen: false, itemDetailId: null, itemEditorOpen: false, itemEditorSeed: null, commandOpen: false, calendarLayers: [], calendarLayerMode: "type", journalEditId: null,
  setView: (v) => { syncViewToUrl(v); set({ view: v, selectedProjectId: null }); },
  openProject: (id) => { syncViewToUrl("projects"); set({ view: "projects", selectedProjectId: id }); },
  setQuickCaptureOpen: (v) => set({ quickCaptureOpen: v }),
  openItemDetail: (id) => set({ itemDetailId: id }), closeItemDetail: () => set({ itemDetailId: null }),
  openItemEditor: (seed = null) => set({ itemEditorOpen: true, itemEditorSeed: seed }), closeItemEditor: () => set({ itemEditorOpen: false, itemEditorSeed: null }),
  setCommandOpen: (v) => set({ commandOpen: v }),
  toggleLayer: (id) => set((s) => ({ calendarLayers: s.calendarLayers.includes(id) ? s.calendarLayers.filter((l) => l !== id) : [...s.calendarLayers, id] })),
  setCalendarLayerMode: (m) => set({ calendarLayerMode: m, calendarLayers: [] }),
  openJournalEditor: (id) => { syncViewToUrl("journal"); set({ view: "journal", journalEditId: id, itemDetailId: null }); },
}));
