"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import type { UserRole } from "@/types/next-auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireSuperAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "superadmin") {
    redirect("/admin");
  }
}

export async function getUsers() {
  await requireSuperAdmin();
  return db.select().from(users);
}

export async function updateUserRole(userId: string, role: UserRole) {
  await requireSuperAdmin();

  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo actualizar el rol." };
  }
}

export async function toggleUserActive(userId: string) {
  await requireSuperAdmin();

  try {
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user) return { success: false, error: "Usuario no encontrado." };
    if (user.role === "superadmin") return { success: false, error: "No se puede desactivar al superadmin." };

    await db.update(users).set({ isActive: !user.isActive }).where(eq(users.id, userId));
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo cambiar el estado del usuario." };
  }
}
