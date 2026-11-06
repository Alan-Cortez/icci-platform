"use server";

import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import type { UserRole } from "@/types/next-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireSuperAdminOrPastor() {
  const session = await auth();
  if (
    !session ||
    (session.user.role !== "superadmin" &&
      session.user.role !== "admin" &&
      session.user.role !== "pastor")
  ) {
    redirect("/admin");
  }
  return session.user;
}

export async function getUsers() {
  await requireSuperAdminOrPastor();
  return db.select().from(users);
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
  ministryId?: string | null
) {
  const currentUser = await requireSuperAdminOrPastor();

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

    const assignedMinistryId = role === "leader" ? (ministryId || null) : null;

    await db
      .update(users)
      .set({
        role,
        ministryId: assignedMinistryId,
      })
      .where(eq(users.id, userId));

    // If assigned as leader of a ministry, update the ministry's leader field
    if (role === "leader" && assignedMinistryId) {
      await db
        .update(ministries)
        .set({
          leaderId: userId,
          leader: target.name || "Líder Asignado",
        })
        .where(eq(ministries.id, assignedMinistryId));
    }

    revalidatePath("/admin");
    revalidatePath("/admin/usuarios");
    revalidatePath("/admin/ministerios");
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { success: false, error: "No se pudo actualizar el rol." };
  }
}

export async function toggleUserActive(userId: string) {
  const currentUser = await requireSuperAdminOrPastor();

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
