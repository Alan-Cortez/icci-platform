"use server";

import { db } from "@/db";
import { preachingSchedules } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { canManagePreachingsUser } from "@/lib/roles";

export async function getPreachingSchedules() {
  const user = await getCurrentAdminUser();
  if (!user || user.role === "leader") {
    throw new Error("No autorizado");
  }
  return db.select().from(preachingSchedules).orderBy(asc(preachingSchedules.date));
}

export async function createPreachingSchedule(data: {
  campusId?: string | null;
  date: number;
  serviceName: string;
  timeStr?: string;
  preacherName: string;
  preacherUserId?: string | null;
  topic?: string;
  notes?: string;
}) {
  const user = await getCurrentAdminUser();
  if (!user || !canManagePreachingsUser(user)) {
    return {
      success: false,
      error: "No tienes permisos para asignar o modificar predicaciones.",
    };
  }

  try {
    const id = `pred-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const targetCampusId =
      user.role === "pastor_campus" && user.campusId
        ? data.campusId || user.campusId
        : data.campusId || null;

    const [created] = await db
      .insert(preachingSchedules)
      .values({
        id,
        campusId: targetCampusId,
        date: new Date(data.date),
        serviceName: data.serviceName.trim(),
        timeStr: data.timeStr?.trim() || null,
        preacherName: data.preacherName.trim(),
        preacherUserId: data.preacherUserId || null,
        topic: data.topic?.trim() || null,
        notes: data.notes?.trim() || null,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/predicaciones");
    revalidatePath("/admin");
    return { success: true, item: created };
  } catch (error) {
    console.error("createPreachingSchedule error:", error);
    return { success: false, error: "No se pudo programar la predicación." };
  }
}

export async function updatePreachingSchedule(
  id: string,
  data: {
    campusId?: string | null;
    date?: number;
    serviceName?: string;
    timeStr?: string | null;
    preacherName?: string;
    preacherUserId?: string | null;
    topic?: string | null;
    notes?: string | null;
  }
) {
  const user = await getCurrentAdminUser();
  if (!user || !canManagePreachingsUser(user)) {
    return {
      success: false,
      error: "No tienes permisos para editar predicaciones.",
    };
  }

  try {
    await db
      .update(preachingSchedules)
      .set({
        ...(data.campusId !== undefined ? { campusId: data.campusId || null } : {}),
        ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
        ...(data.serviceName !== undefined ? { serviceName: data.serviceName.trim() } : {}),
        ...(data.timeStr !== undefined ? { timeStr: data.timeStr?.trim() || null } : {}),
        ...(data.preacherName !== undefined ? { preacherName: data.preacherName.trim() } : {}),
        ...(data.preacherUserId !== undefined
          ? { preacherUserId: data.preacherUserId || null }
          : {}),
        ...(data.topic !== undefined ? { topic: data.topic?.trim() || null } : {}),
        ...(data.notes !== undefined ? { notes: data.notes?.trim() || null } : {}),
        updatedAt: new Date(),
      })
      .where(eq(preachingSchedules.id, id));

    revalidatePath("/admin/predicaciones");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("updatePreachingSchedule error:", error);
    return { success: false, error: "No se pudo actualizar la predicación." };
  }
}

export async function deletePreachingSchedule(id: string) {
  const user = await getCurrentAdminUser();
  if (!user || !canManagePreachingsUser(user)) {
    return {
      success: false,
      error: "No tienes permisos para eliminar predicaciones.",
    };
  }

  try {
    await db.delete(preachingSchedules).where(eq(preachingSchedules.id, id));
    revalidatePath("/admin/predicaciones");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("deletePreachingSchedule error:", error);
    return { success: false, error: "No se pudo eliminar la predicación." };
  }
}
