"use server";

import { db } from "@/db";
import { planningEvents, type NewPlanningEvent } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentAdminUser, getAccessibleMinistryIds } from "@/lib/admin-auth";

async function requireAuthRole() {
  const user = await getCurrentAdminUser();
  if (!user) {
    throw new Error("No autorizado");
  }
  return user;
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
  const accessible = await getAccessibleMinistryIds(user);

  let targetMinistryId = data.ministryId || null;

  if (accessible !== null) {
    // Leader: must belong to one of their assigned ministries
    if (accessible.length === 0) {
      return { success: false, error: "No tienes un ministerio asignado para registrar actividades." };
    }
    if (!targetMinistryId || !accessible.includes(targetMinistryId)) {
      targetMinistryId = accessible[0];
    }
  }

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
        ministryId: targetMinistryId,
        responsible: data.responsible?.trim() || user.name || null,
        status: data.status || "scheduled",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/planeacion");
    revalidatePath("/admin");
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
  const user = await requireAuthRole();
  const accessible = await getAccessibleMinistryIds(user);

  try {
    if (accessible !== null) {
      const [existing] = await db
        .select()
        .from(planningEvents)
        .where(eq(planningEvents.id, id))
        .limit(1);

      if (!existing) {
        return { success: false, error: "Actividad no encontrada." };
      }
      if (!existing.ministryId || !accessible.includes(existing.ministryId)) {
        return {
          success: false,
          error: "Solo puedes editar actividades que pertenecen a tu propio ministerio.",
        };
      }
      // Prevent changing ministryId outside accessible ministries
      if (data.ministryId && !accessible.includes(data.ministryId)) {
        data.ministryId = existing.ministryId;
      }
    }

    await db
      .update(planningEvents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(planningEvents.id, id));

    revalidatePath("/admin/planeacion");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating planning event:", error);
    return { success: false, error: "No se pudo actualizar la actividad." };
  }
}

export async function deletePlanningEvent(id: string) {
  const user = await requireAuthRole();
  const accessible = await getAccessibleMinistryIds(user);

  try {
    if (accessible !== null) {
      const [existing] = await db
        .select()
        .from(planningEvents)
        .where(eq(planningEvents.id, id))
        .limit(1);

      if (!existing) {
        return { success: false, error: "Actividad no encontrada." };
      }
      if (!existing.ministryId || !accessible.includes(existing.ministryId)) {
        return {
          success: false,
          error: "Solo puedes eliminar actividades que pertenecen a tu propio ministerio.",
        };
      }
    }

    await db.delete(planningEvents).where(eq(planningEvents.id, id));
    revalidatePath("/admin/planeacion");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting planning event:", error);
    return { success: false, error: "No se pudo eliminar la actividad." };
  }
}
