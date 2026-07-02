import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEntityConfig } from "@/lib/entities";
import { requireAdmin } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";

type Params = { params: { entity: string; id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return apiError(auth.message, auth.status);

  const config = getEntityConfig(params.entity);
  if (!config) return apiError(`Unknown entity "${params.entity}"`, 404);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[config.prismaModel];

  try {
    const record = await delegate.findUnique({ where: { id: params.id } });
    if (!record) return apiError("Record not found", 404);
    return apiSuccess(record);
  } catch (err) {
    console.error(`[GET /api/admin/${params.entity}/${params.id}]`, err);
    return apiError("Failed to fetch record", 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
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

  const parsed = config.updateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Validation failed", 422, parsed.error.flatten());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[config.prismaModel];

  try {
    const existing = await delegate.findUnique({ where: { id: params.id } });
    if (!existing) return apiError("Record not found", 404);

    const updated = await delegate.update({ where: { id: params.id }, data: parsed.data });
    return apiSuccess(updated);
  } catch (err) {
    console.error(`[PUT /api/admin/${params.entity}/${params.id}]`, err);
    return apiError("Failed to update record", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return apiError(auth.message, auth.status);

  const config = getEntityConfig(params.entity);
  if (!config) return apiError(`Unknown entity "${params.entity}"`, 404);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const delegate = (prisma as any)[config.prismaModel];

  try {
    const existing = await delegate.findUnique({ where: { id: params.id } });
    if (!existing) return apiError("Record not found", 404);

    await delegate.delete({ where: { id: params.id } });
    return apiSuccess({ id: params.id, deleted: true });
  } catch (err) {
    console.error(`[DELETE /api/admin/${params.entity}/${params.id}]`, err);
    return apiError("Failed to delete record", 500);
  }
}
