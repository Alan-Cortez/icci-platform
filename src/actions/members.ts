"use server";

import { db } from "@/db";
import { members, type NewMember } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

async function requireMemberReader() {
  const user = await getCurrentAdminUser();
  if (!user) throw new Error("No autorizado");
  return user;
}

async function requireMemberWriter() {
  const user = await getCurrentAdminUser();
  if (!user || !EVENT_WRITER_ROLES.includes(user.role)) {
    throw new Error("Solo lectura en directorio de miembros");
  }
  return user;
}

export async function getMembers() {
  await requireMemberReader();
  return db
    .select({
      id: members.id,
      name: members.name,
      paternalSurname: members.paternalSurname,
      maternalSurname: members.maternalSurname,
      birthDay: members.birthDay,
      birthMonth: members.birthMonth,
      phone: members.phone,
      gender: members.gender,
      ministryId: members.ministryId,
      campusId: members.campusId,
      isActive: members.isActive,
      createdAt: members.createdAt,
      updatedAt: members.updatedAt,
    })
    .from(members)
    .orderBy(asc(members.name), asc(members.paternalSurname));
}

export async function createMember(data: Omit<NewMember, "id" | "createdAt" | "updatedAt">) {
  await requireMemberWriter();
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
  await requireMemberWriter();
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
  await requireMemberWriter();

  try {
    await db.delete(members).where(eq(members.id, id));
    revalidatePath("/admin/cumpleanos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting member:", error);
    return { success: false, error: "No se pudo eliminar el miembro." };
  }
}
