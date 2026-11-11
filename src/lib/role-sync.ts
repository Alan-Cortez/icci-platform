import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import type { UserRole } from "@/types/next-auth";

/**
 * If a user was assigned by email as leader or pastor of a ministry before
 * ever signing in, automatically promote their account on login/access.
 */
export async function syncUserRoleFromMinistries(dbUser: {
  id: string;
  email: string | null;
  role: string;
  ministryId: string | null;
}): Promise<{ role: UserRole; ministryId: string | null }> {
  const currentRole = dbUser.role as UserRole;
  if (!dbUser.email) {
    return { role: currentRole, ministryId: dbUser.ministryId };
  }

  const normalizedEmail = dbUser.email.trim().toLowerCase();

  // Check if assigned as leaderEmail on any ministry
  if (currentRole === "user" || (currentRole === "leader" && !dbUser.ministryId)) {
    const matchedLeaderMinistry = await db
      .select({ id: ministries.id })
      .from(ministries)
      .where(sql`lower(trim(${ministries.leaderEmail})) = ${normalizedEmail}`)
      .limit(1);

    if (matchedLeaderMinistry.length > 0) {
      const mId = matchedLeaderMinistry[0].id;
      await db
        .update(users)
        .set({ role: "leader", ministryId: mId })
        .where(eq(users.id, dbUser.id));

      await db
        .update(ministries)
        .set({ leaderId: dbUser.id })
        .where(sql`lower(trim(${ministries.leaderEmail})) = ${normalizedEmail}`);

      return { role: "leader", ministryId: mId };
    }
  }

  // Check if assigned as pastorEmail on any ministry
  if (currentRole === "user") {
    const matchedPastorMinistry = await db
      .select({ id: ministries.id })
      .from(ministries)
      .where(sql`lower(trim(${ministries.pastorEmail})) = ${normalizedEmail}`)
      .limit(1);

    if (matchedPastorMinistry.length > 0) {
      await db
        .update(users)
        .set({ role: "pastor" })
        .where(eq(users.id, dbUser.id));
      return { role: "pastor", ministryId: null };
    }
  }

  return { role: currentRole, ministryId: dbUser.ministryId };
}
