"use server";

import { db } from "@/db";
import { members, type NewMember } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function requireAuthRole() {
  const session = await auth();
  const allowed = ["superadmin", "admin", "pastor", "leader"];
  if (!session || !allowed.includes(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session.user;
}

export async function getMembers() {
  await requireAuthRole();
  return db
    .select()
    .from(members)
    .orderBy(asc(members.name), asc(members.paternalSurname));
}

export async function createMember(data: Omit<NewMember, "id" | "createdAt" | "updatedAt">) {
  await requireAuthRole();
  try {
    const [created] = await db
      .insert(members)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    revalidatePath("/admin/cumpleanos");
    return { success: true, member: created };
  } catch (error) {
    console.error("Error creating member:", error);
    return { success: false, error: "No se pudo registrar el miembro." };
  }
}

export async function updateMember(
  id: number,
  data: Partial<Omit<NewMember, "id" | "createdAt">>
) {
  await requireAuthRole();
  try {
    await db
      .update(members)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id));
    revalidatePath("/admin/cumpleanos");
    return { success: true };
  } catch (error) {
    console.error("Error updating member:", error);
    return { success: false, error: "No se pudo actualizar el miembro." };
  }
}

export async function deleteMember(id: number) {
  const user = await requireAuthRole();
  if (user.role !== "superadmin" && user.role !== "admin" && user.role !== "pastor") {
    return { success: false, error: "Permisos insuficientes para eliminar miembros." };
  }

  try {
    await db.delete(members).where(eq(members.id, id));
    revalidatePath("/admin/cumpleanos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting member:", error);
    return { success: false, error: "No se pudo eliminar el miembro." };
  }
}
