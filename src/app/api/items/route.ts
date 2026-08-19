import { db } from "@/lib/db";
import { ok, bad, parseBody, parseListMeta, parseMeta } from "@/lib/api";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

function withHabitLogs(item: any) {
  return { ...item, habitLogs: Array.isArray(item.habitLogs) ? item.habitLogs : [] };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const where: any = {};
  const type = sp.get("type"); if (type) where.type = type.split(",").length > 1 ? { in: type.split(",") } : type;
  const status = sp.get("status"); if (status) where.status = status.split(",").length > 1 ? { in: status.split(",") } : status;
  const domain = sp.get("domain"); if (domain) where.domainId = domain;
  const project = sp.get("project"); if (project) where.projectId = project;
  const q = sp.get("q"); if (q) where.OR = [{ title: { contains: q } }, { content: { contains: q } }];
  const tag = sp.get("tag"); if (tag) where.tags = { some: { tag: { name: tag } } };
  if (sp.get("hasDate") === "true") where.OR = [{ dueDate: { not: null } }, { scheduledAt: { not: null } }, { startDate: { not: null } }];
  const orderBy = sp.get("orderBy") || "createdAt";
  const order = sp.get("order") === "asc" ? "asc" : "desc";
  const limit = Math.min(Number(sp.get("limit") || 200), 500);
  const items = await db.item.findMany({ where, orderBy: { [orderBy]: order }, take: limit, include: { tags: { include: { tag: true } }, domain: true, project: { select: { id: true, name: true, color: true } }, habitLogs: true } });
  return ok({ items: parseListMeta(items.map(withHabitLogs) as any[]) });
}

export async function POST(req: NextRequest) {
  const body = await parseBody(req);
  if (!body.title) return bad("title is required");
  if (!body.type) return bad("type is required");
  const { metadata, tagNames, domainId: rawDomainId, projectId: rawProjectId, ...rest } = body;
  const domainId = typeof rawDomainId === "string" && rawDomainId.trim() ? rawDomainId.trim() : null;
  const projectId = typeof rawProjectId === "string" && rawProjectId.trim() ? rawProjectId.trim() : null;
  const [domain, project] = await Promise.all([domainId ? db.domain.findUnique({ where: { id: domainId }, select: { id: true } }) : null, projectId ? db.project.findUnique({ where: { id: projectId }, select: { id: true } }) : null]);
  const item = await db.item.create({ data: { ...rest, domainId: domain?.id ?? null, projectId: project?.id ?? null, ...(metadata ? { metadata: JSON.stringify(metadata) } : {}), ...(tagNames?.length ? { tags: { create: await Promise.all((tagNames as string[]).map(async (name) => ({ tag: { connectOrCreate: { where: { name }, create: { name } } } }))) } } : {}) }, include: { tags: { include: { tag: true } }, domain: true, project: { select: { id: true, name: true, color: true } }, habitLogs: true } });
  return ok(parseMeta(withHabitLogs(item) as any));
}
