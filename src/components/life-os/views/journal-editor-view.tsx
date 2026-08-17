"use client";

import { useEffect, useState } from "react";
import { useLifeOS } from "@/store/life-os";
import { useItem, useCreateItem, useUpdateItem, useDeleteItem, useDomains } from "@/lib/hooks";
import { Icon } from "../icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notify } from "@/lib/toast";
import { fmtDate } from "@/lib/dates";
import { RichTextEditor } from "../rich-text-editor";

const DEFAULT_DAILY_GOAL = 500;
const GOAL_STORAGE_KEY = "lifeos-daily-writing-goal";

function statsFor(content: string) {
  const text = content.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return { words, chars: text.length, readTime: Math.max(1, Math.ceil(words / 200)) };
}

export function JournalEditorView() {
  const { journalEditId, setView } = useLifeOS();
  const { data: existingItem, isLoading } = useItem(journalEditId);
  const create = useCreateItem();
  const update = useUpdateItem();
  const del = useDeleteItem();
  const { data: domainsData } = useDomains();
  const domains = domainsData?.domains || [];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [domainId, setDomainId] = useState("");
  const [goal, setGoal] = useState(DEFAULT_DAILY_GOAL);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    if (journalEditId && existingItem) {
      setTitle(existingItem.title || "");
      setContent(existingItem.content || "");
      setDomainId(existingItem.domainId || "");
    }
    try {
      const storedGoal = Number(localStorage.getItem(GOAL_STORAGE_KEY));
      if (storedGoal > 0) setGoal(storedGoal);
    } catch {}
  }, [loaded, journalEditId, existingItem]);

  const stats = statsFor(content);
  const progress = Math.min(100, Math.round((stats.words / goal) * 100));

  async function save() {
    if (!title.trim()) {
      notify.error("Add a title first");
      return;
    }
    try {
      if (journalEditId) {
        await update.mutateAsync({ id: journalEditId, title: title.trim(), content, domainId: domainId || null });
        notify.success("Entry saved");
      } else {
        await create.mutateAsync({ type: "journal", title: title.trim(), content, status: "active", domainId: domainId || null, scheduledAt: new Date().toISOString() });
        notify.success("Journal entry created");
      }
      setTimeout(() => setView("mind_soul"), 600);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Failed to save");
    }
  }

  async function handleDelete() {
    if (!journalEditId) return;
    try {
      await del.mutateAsync(journalEditId);
      notify.success("Journal entry deleted");
      setView("mind_soul");
    } catch (error) {
      notify.error(error instanceof Error ? error.message : "Failed to delete");
    }
  }

  if (journalEditId && isLoading) return <div className="h-64 animate-pulse rounded-xl bg-muted/30" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/40 py-3">
        <Button variant="ghost" size="sm" onClick={() => setView("mind_soul")} className="gap-1.5"><Icon name="ArrowLeft" className="h-4 w-4" />Back</Button>
        <div className="flex gap-2">
          {journalEditId && <Button variant="ghost" size="sm" onClick={handleDelete} className="text-rose-500"><Icon name="Trash2" className="h-4 w-4" /></Button>}
          <Button size="sm" onClick={save} disabled={create.isPending || update.isPending}>Save</Button>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="mb-3 text-xs text-muted-foreground">{fmtDate(new Date(), "EEEE, MMMM d · p")}</div>
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your entry a title…" className="mb-4 border-0 px-0 text-2xl font-bold shadow-none" />
        <RichTextEditor value={content} onChange={setContent} placeholder="Start writing… Express yourself freely." />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/40 pt-3 text-xs text-muted-foreground">
          <Select value={domainId || "none"} onValueChange={(value) => setDomainId(value === "none" ? "" : value)}><SelectTrigger className="h-8 w-40"><SelectValue placeholder="Domain" /></SelectTrigger><SelectContent><SelectItem value="none">No domain</SelectItem>{domains.map((domain) => <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>)}</SelectContent></Select>
          <span>{stats.words} words · {stats.chars} chars · {stats.readTime} min read · {progress}% of {goal}-word goal</span>
        </div>
      </div>
    </div>
  );
}
