import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import { syncUserRoleFromMinistries } from "@/lib/role-sync";
import type { UserRole } from "@/types/next-auth";

export interface AdminUserSession {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  ministryId: string | null;
}

const ADMIN_PANEL_ROLES: UserRole[] = ["superadmin", "admin", "pastor", "leader"];

/**
 * Fetches the authenticated user directly from DB so role and ministry
 * assignments take effect immediately without waiting for JWT refresh.
 */
export async function getCurrentAdminUser(): Promise<AdminUserSession | null> {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    return null;
  }

  const dbUser = session.user.id
    ? await db.query.users.findFirst({ where: eq(users.id, session.user.id) })
    : await db.query.users.findFirst({ where: eq(users.email, session.user.email!) });

  if (!dbUser || !dbUser.isActive) {
    return null;
  }

  const synced = await syncUserRoleFromMinistries({
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
    ministryId: dbUser.ministryId,
  });

  if (!ADMIN_PANEL_ROLES.includes(synced.role)) {
    return null;
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    image: dbUser.image,
    role: synced.role,
    ministryId: synced.ministryId,
  };
}

/**
 * Enforces role access on admin server pages.
 * - Unauthenticated/non-admin users are sent to "/".
 * - Leaders accessing admin-only sections are redirected to fallbackRedirect ("/admin").
 */
export async function requireRole(
  allowedRoles: UserRole[] = ADMIN_PANEL_ROLES,
  fallbackRedirect = "/admin"
): Promise<AdminUserSession> {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/");
  }
  if (!allowedRoles.includes(user.role)) {
    redirect(fallbackRedirect);
  }
  return user;
}

/**
 * Returns `null` if the user has full access to all ministries (superadmin, admin, pastor),
 * or an array of ministry IDs assigned to a leader.
 */
export async function getAccessibleMinistryIds(user: AdminUserSession): Promise<string[] | null> {
  if (user.role === "superadmin" || user.role === "admin" || user.role === "pastor") {
    return null;
  }

  const allMinistries = await db
    .select({
      id: ministries.id,
      leaderId: ministries.leaderId,
      leaderEmail: ministries.leaderEmail,
    })
    .from(ministries);

  const normalizedEmail = user.email?.trim().toLowerCase() || "";
  const ids = new Set<string>();

  if (user.ministryId) {
    ids.add(user.ministryId);
  }

  for (const m of allMinistries) {
    if (m.leaderId && m.leaderId === user.id) {
      ids.add(m.id);
    }
    if (normalizedEmail && m.leaderEmail && m.leaderEmail.trim().toLowerCase() === normalizedEmail) {
      ids.add(m.id);
    }
  }

  return Array.from(ids);
}
