import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { ENTITY_SLUGS, getEntityConfig } from "@/lib/entities";

/**
 * GET /api/admin/analytics
 * Powers the dashboard stat cards and the "module snapshot" grid.
 * Real counts per entity, no hardcoded numbers.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return apiError(auth.message, auth.status);

  try {
    const counts: Record<string, number> = {};

    await Promise.all(
      ENTITY_SLUGS.map(async (slug) => {
        const config = getEntityConfig(slug)!;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const delegate = (prisma as any)[config.prismaModel];
        counts[slug] = await delegate.count();
      })
    );

    const pendingReports = await prisma.report.count({ where: { status: "PENDING" } });

    return apiSuccess({ counts, pendingReports });
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err);
    return apiError("Failed to load analytics", 500);
  }
}
