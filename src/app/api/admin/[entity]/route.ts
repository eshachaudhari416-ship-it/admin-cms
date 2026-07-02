import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEntityConfig } from "@/lib/entities";
import { requireAdmin } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";

type Params = { params: { entity: string } };

/**
 * GET /api/admin/[entity]?search=&status=&sortKey=&sortDir=&page=&pageSize=
 * Generic list endpoint for every admin-managed entity. Config comes from
 * the entity registry, so adding a new module never means adding a new
 * route file.
 */
export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return apiError(auth.message, auth.status);

  const config = getEntityConfig(params.entity);
  if (!config) return apiError(`Unknown entity "${params.entity}"`, 404);

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status");
  const sortKey = searchParams.get("sortKey") ?? "createdAt";
  const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 10) || 10));

  const where: Record<string, unknown> = {};
  if (search) {
    where[config.searchField] = { contains: search, mode: "insensitive" };
  }
  if (status && status !== "all") {
    where.status = status;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[config.prismaModel];
  if (!delegate) return apiError("Server misconfiguration: unknown model", 500);

  try {
    const [total, rows] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        orderBy: { [sortKey]: sortDir },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return apiSuccess({
      rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error(`[GET /api/admin/${params.entity}]`, err);
    return apiError("Failed to fetch records", 500);
  }
}

/**
 * POST /api/admin/[entity]
 * Generic create endpoint. Body is validated against the entity's zod
 * schema before hitting the database — this is the "Proper Validation"
 * requirement for every module in one place.
 */
export async function POST(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return apiError(auth.message, auth.status);

  const config = getEntityConfig(params.entity);
  if (!config) return apiError(`Unknown entity "${params.entity}"`, 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = config.schema.safeParse(body);
  if (!parsed.success) {
    return apiError("Validation failed", 422, parsed.error.flatten());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[config.prismaModel];
  if (!delegate) return apiError("Server misconfiguration: unknown model", 500);

  try {
    const created = await delegate.create({ data: parsed.data });
    return apiSuccess(created, 201);
  } catch (err) {
    console.error(`[POST /api/admin/${params.entity}]`, err);
    return apiError("Failed to create record", 500);
  }
}
