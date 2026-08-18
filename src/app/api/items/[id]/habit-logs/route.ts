import { db } from "@/lib/db";
import { ok, bad, parseBody } from "@/lib/api";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const THAI_TIME_ZONE = "Asia/Bangkok";

function thaiDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: THAI_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function normalizeHabitDate(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) throw new Error("Habit date must be in YYYY-MM-DD format");

  const [, year, month, day] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid habit date");
  return date;
}

// GET /api/items/[id]/habit-logs
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const logs = await db.habitLog.findMany({ where: { itemId: id }, orderBy: { date: "desc" } });
  return ok({ logs });
}

// POST /api/items/[id]/habit-logs — toggle log for a given date
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await parseBody(req);
  const dateStr = body.date || thaiDateString();
  const date = normalizeHabitDate(dateStr);

  const existing = await db.habitLog.findUnique({ where: { itemId_date: { itemId: id, date } } });
  if (existing) {
    await db.habitLog.delete({ where: { id: existing.id } });
    return ok({ logged: false });
  }
  const log = await db.habitLog.create({ data: { itemId: id, date, value: body.value ?? 1, note: body.note } });
  return ok({ logged: true, log });
}
