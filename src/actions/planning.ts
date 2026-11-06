"use server";

import { db } from "@/db";
import { planningEvents, type NewPlanningEvent } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";
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

export async function getPlanningEvents() {
  await requireAuthRole();
  return db
    .select()
    .from(planningEvents)
    .orderBy(desc(planningEvents.date));
}

export async function createPlanningEvent(data: {
  title: string;
  description?: string;
  date: number;
  timeStr?: string;
  ministryId?: string;
  responsible?: string;
  status?: "scheduled" | "completed" | "cancelled";
}) {
  const user = await requireAuthRole();

  try {
    const id = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const [created] = await db
      .insert(planningEvents)
      .values({
        id,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        date: new Date(data.date),
        timeStr: data.timeStr?.trim() || null,
        ministryId: data.ministryId || null,
        responsible: data.responsible?.trim() || user.name || null,
        status: data.status || "scheduled",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/planeacion");
    return { success: true, event: created };
  } catch (error) {
    console.error("Error creating planning event:", error);
    return { success: false, error: "No se pudo registrar la actividad de planeación." };
  }
}

export async function updatePlanningEvent(
  id: string,
  data: Partial<Omit<NewPlanningEvent, "id" | "createdAt">>
) {
  await requireAuthRole();

  try {
    await db
      .update(planningEvents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(planningEvents.id, id));

    revalidatePath("/admin/planeacion");
    return { success: true };
  } catch (error) {
    console.error("Error updating planning event:", error);
    return { success: false, error: "No se pudo actualizar la actividad." };
  }
}

export async function deletePlanningEvent(id: string) {
  await requireAuthRole();

  try {
    await db.delete(planningEvents).where(eq(planningEvents.id, id));
    revalidatePath("/admin/planeacion");
    return { success: true };
  } catch (error) {
    console.error("Error deleting planning event:", error);
    return { success: false, error: "No se pudo eliminar la actividad." };
  }
}
