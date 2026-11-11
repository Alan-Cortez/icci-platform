"use server";

import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import type { UserRole } from "@/types/next-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { isFullAdminRole } from "@/lib/roles";

async function requireFullAdmin() {
  const currentUser = await getCurrentAdminUser();
  if (!currentUser || !isFullAdminRole(currentUser.role)) {
    redirect("/admin");
  }
  return currentUser;
}

export async function getUsers() {
  await requireFullAdmin();
  return db.select().from(users);
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  options?: {
    ministryId?: string | null;
    campusId?: string | null;
    canManagePreachings?: boolean;
  }
) {
  const currentUser = await requireFullAdmin();

  try {
    const target = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!target) return { success: false, error: "Usuario no encontrado." };

    // Only superadmin can touch superadmin or promote to superadmin
    if (target.role === "superadmin" && currentUser.role !== "superadmin") {
      return { success: false, error: "Solo el Super Admin puede modificar a otro Super Admin." };
    }
    if (role === "superadmin" && currentUser.role !== "superadmin") {
      return { success: false, error: "Solo el Super Admin puede promover a Super Admin." };
    }

    const assignedMinistryId = role === "leader" ? options?.ministryId || null : null;
    const assignedCampusId = role === "pastor_campus" ? options?.campusId || null : null;
    const canManagePreachings =
      role === "pastor" ? Boolean(options?.canManagePreachings) : isFullAdminRole(role) || role === "pastor_campus";

    await db
      .update(users)
      .set({
        role,
        ministryId: assignedMinistryId,
        campusId: assignedCampusId,
        canManagePreachings,
      })
      .where(eq(users.id, userId));

    // If assigned as leader of a ministry, sync the ministry's leader fields
    if (role === "leader" && assignedMinistryId) {
      await db
        .update(ministries)
        .set({
          leaderId: userId,
          leader: target.name || "Líder Asignado",
          ...(target.email ? { leaderEmail: target.email } : {}),
          ...(target.phone ? { leaderPhone: target.phone } : {}),
        })
        .where(eq(ministries.id, assignedMinistryId));
    }

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/ministerios");
    revalidatePath("/admin/predicaciones");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "No se pudo actualizar el rol." };
  }
}

export async function toggleUserActive(userId: string) {
  await requireFullAdmin();

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) return { success: false, error: "Usuario no encontrado." };
    if (user.role === "superadmin") {
      return { success: false, error: "No se puede desactivar al Super Admin." };
    }

    await db
      .update(users)
      .set({ isActive: !user.isActive })
      .where(eq(users.id, userId));

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo cambiar el estado del usuario." };
  }
}
