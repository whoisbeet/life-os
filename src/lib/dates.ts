import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isThisWeek, parseISO, differenceInCalendarDays } from "date-fns";

const BANGKOK_TIME_ZONE = "Asia/Bangkok";

export function bangkokDateKey(d: string | Date): string {
  const date = typeof d === "string" ? parseISO(d) : d;
  return new Intl.DateTimeFormat("en-CA", { timeZone: BANGKOK_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function currentBangkokDateKey(): string {
  return bangkokDateKey(new Date());
}

export function addBangkokDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return new Intl.DateTimeFormat("en-CA", { timeZone: BANGKOK_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function calculateCurrentStreak(logDates: Array<string | Date>): number {
  const loggedDates = new Set(logDates.map(bangkokDateKey));
  const today = currentBangkokDateKey();
  const yesterday = addBangkokDays(today, -1);

  if (!loggedDates.has(today) && !loggedDates.has(yesterday)) {
    return 0;
  }

  let dateKey = loggedDates.has(today) ? today : yesterday;
  let streak = 0;
  while (loggedDates.has(dateKey)) {
    streak += 1;
    dateKey = addBangkokDays(dateKey, -1);
  }
  return streak;
}

export function fmtDate(d: string | Date | null | undefined, fmt = "MMM d") {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (isNaN(date.getTime())) return "";
  return format(date, fmt);
}

export function fmtRelative(d: string | Date | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
}

export function smartDate(d: string | Date | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (isNaN(date.getTime())) return "";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE");
  const diff = differenceInCalendarDays(date, new Date());
  if (diff > 0 && diff < 30) return `In ${diff} days`;
  if (diff < 0 && diff > -30) return `${Math.abs(diff)} days ago`;
  return format(date, "MMM d");
}

export function dateColor(d: string | Date | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (isNaN(date.getTime())) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = differenceInCalendarDays(target, today);
  if (diff < 0) return "text-rose-500";
  if (diff === 0) return "text-amber-500";
  if (diff <= 2) return "text-orange-500";
  return "text-muted-foreground";
}

export function toISODate(d: Date) {
  return d.toISOString();
}

export function fromDateInput(v: string): string | undefined {
  if (!v) return undefined;
  const d = new Date(v);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

export function toDateInput(d: string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? parseISO(d) : d;
  if (isNaN(date.getTime())) return "";
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
