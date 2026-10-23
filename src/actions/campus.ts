"use server";

import { db } from "@/db";
import { campuses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/upload";
import { CAMPUSES } from "@/lib/constants";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || (role !== "admin" && role !== "superadmin")) {
    throw new Error("No autorizado");
  }
}

function revalidateCampus(campusId: string) {
  revalidatePath("/campus");
  revalidatePath(`/campus/${campusId}`);
  revalidatePath("/admin/configuracion");
}

/**
 * Public: custom photo of each campus uploaded from the admin panel.
 * Returns only campuses that have a custom photo; callers fall back to the
 * default image in /public/images when a campus is missing from the result.
 */
export async function getCampusImages(): Promise<Record<string, string>> {
  try {
    const rows = await db.select({ id: campuses.id, image: campuses.image }).from(campuses);
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row.image) map[row.id] = row.image;
    }
    return map;
  } catch (error) {
    console.error("getCampusImages error:", error);
    return {};
  }
}

/** Admin: replace the photo of a campus. */
export async function updateCampusImage(campusId: string, formData: FormData) {
  try {
    await requireAdmin();
    if (!CAMPUSES.some((c) => c.id === campusId)) {
      return { success: false, error: "Campus no válido." };
    }

    const imageUrl = await uploadImage(formData.get("image") as File | null);
    if (!imageUrl) {
      return { success: false, error: "No se recibió ninguna imagen." };
    }

    await db.update(campuses).set({ image: imageUrl }).where(eq(campuses.id, campusId));
    revalidateCampus(campusId);
    return { success: true, imageUrl };
  } catch (error) {
    console.error("updateCampusImage error:", error);
    return { success: false, error: "No se pudo actualizar la foto del campus." };
  }
}

/** Admin: go back to the default photo of the campus. */
export async function resetCampusImage(campusId: string) {
  try {
    await requireAdmin();
    await db.update(campuses).set({ image: null }).where(eq(campuses.id, campusId));
    revalidateCampus(campusId);
    return { success: true };
  } catch (error) {
    console.error("resetCampusImage error:", error);
    return { success: false, error: "No se pudo restaurar la foto." };
  }
}
