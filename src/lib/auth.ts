import { NextRequest } from "next/server";

/**
 * Auth guard for admin API routes.
 *
 * STUB: Module 11 (User & Authentication) owns real login/session logic.
 * Until that's merged, this reads a role from a header/cookie so every
 * other module's API can be built and tested against a real contract.
 *
 * Swap-in once Module 11 lands (NextAuth example):
 *
 *   import { getServerSession } from "next-auth";
 *   import { authOptions } from "@/lib/auth-options";
 *
 *   export async function requireAdmin() {
 *     const session = await getServerSession(authOptions);
 *     if (!session?.user) return { ok: false, status: 401, message: "Not authenticated" };
 *     if (!["ADMIN", "EDITOR"].includes(session.user.role)) {
 *       return { ok: false, status: 403, message: "Insufficient permissions" };
 *     }
 *     return { ok: true, user: session.user };
 *   }
 */

type AuthResult = { ok: true; role: string } | { ok: false; status: number; message: string };

const ALLOWED_ROLES = ["ADMIN", "EDITOR"];

export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const role =
    req.headers.get("x-user-role") ??
    req.cookies.get("stub_role")?.value ??
    process.env.ADMIN_STUB_ROLE ??
    null;

  if (!role) return { ok: false, status: 401, message: "Not authenticated" };
  if (!ALLOWED_ROLES.includes(role)) {
    return { ok: false, status: 403, message: "Insufficient permissions for this action" };
  }
  return { ok: true, role };
}
