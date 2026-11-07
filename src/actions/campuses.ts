"use server";

import { db } from "@/db";
import { campuses, campusSchedules, type NewCampus } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

async function requireAdminOrPastor() {
  const session = await auth();
  const allowed = ["superadmin", "admin", "pastor"];
  if (!session || !allowed.includes(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session.user;
}

export async function getCampuses() {
  return db
    .select()
    .from(campuses)
    .orderBy(asc(campuses.isMain), asc(campuses.name));
}

export async function getCampusWithSchedules(id: string) {
  const [campus] = await db.select().from(campuses).where(eq(campuses.id, id));
  if (!campus) return null;

  const schedules = await db
    .select()
    .from(campusSchedules)
    .where(eq(campusSchedules.campusId, id))
    .orderBy(asc(campusSchedules.sortOrder));

  return { ...campus, schedules };
}

export async function updateCampus(
  id: string,
  data: Partial<Omit<NewCampus, "id" | "createdAt">>,
  schedules?: Array<{ title: string; days: string; time: string; sortOrder?: number }>
) {
  await requireAdminOrPastor();

  try {
    // If setting isMain to true, unset isMain for all other campuses
    if (data.isMain === true) {
      await db.update(campuses).set({ isMain: false });
    }

    await db
      .update(campuses)
      .set(data)
      .where(eq(campuses.id, id));

    // If schedules are provided, update them
    if (schedules && Array.isArray(schedules)) {
      await db.delete(campusSchedules).where(eq(campusSchedules.campusId, id));

      if (schedules.length > 0) {
        const scheduleStmts = schedules
          .filter((s) => s.title.trim())
          .map((s, index) => ({
            id: `sch-${id}-${Date.now()}-${index}`,
            campusId: id,
            title: s.title.trim(),
            days: s.days.trim(),
            time: s.time.trim(),
            sortOrder: s.sortOrder ?? index,
          }));

        if (scheduleStmts.length > 0) {
          await db.insert(campusSchedules).values(scheduleStmts);
        }
      }
    }

    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    revalidatePath(`/campus/${id}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating campus:", error);
    return { success: false, error: "No se pudo actualizar el campus." };
  }
}

export async function createCampus(
  data: {
    name: string;
    state: string;
    isMain?: boolean;
    pastor: string;
    address: string;
    phone: string;
    email?: string;
    description: string;
    image?: string;
    pastorImage?: string;
  },
  schedules?: Array<{ title: string; days: string; time: string; sortOrder?: number }>
) {
  await requireAdminOrPastor();

  try {
    const slug = slugify(data.name);
    const id = slug;

    if (data.isMain) {
      await db.update(campuses).set({ isMain: false });
    }

    const [created] = await db
      .insert(campuses)
      .values({
        id,
        name: data.name.trim(),
        slug,
        state: data.state.trim(),
        isMain: Boolean(data.isMain),
        pastor: data.pastor.trim(),
        address: data.address.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        description: data.description.trim(),
        image: data.image?.trim() || null,
        pastorImage: data.pastorImage?.trim() || null,
        isActive: true,
        createdAt: new Date(),
      })
      .returning();

    if (schedules && Array.isArray(schedules) && schedules.length > 0) {
      const scheduleStmts = schedules
        .filter((s) => s.title.trim())
        .map((s, index) => ({
          id: `sch-${id}-${Date.now()}-${index}`,
          campusId: id,
          title: s.title.trim(),
          days: s.days.trim(),
          time: s.time.trim(),
          sortOrder: s.sortOrder ?? index,
        }));

      if (scheduleStmts.length > 0) {
        await db.insert(campusSchedules).values(scheduleStmts);
      }
    }

    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    revalidatePath("/");
    return { success: true, campus: created };
  } catch (error) {
    console.error("Error creating campus:", error);
    return { success: false, error: "No se pudo registrar el campus." };
  }
}

export async function deleteCampus(id: string) {
  const user = await requireAdminOrPastor();
  if (user.role !== "superadmin") {
    return { success: false, error: "Solo el Super Admin puede eliminar campus." };
  }

  try {
    await db.delete(campusSchedules).where(eq(campusSchedules.campusId, id));
    await db.delete(campuses).where(eq(campuses.id, id));

    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting campus:", error);
    return { success: false, error: "No se pudo eliminar el campus." };
  }
}
