"use server";

import { db } from "@/db";
import { baptisms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBaptismRegistration(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const age = parseInt(formData.get("age") as string);
    const campusId = formData.get("campusId") as string | null;
    const notes = formData.get("notes") as string;

    await db.insert(baptisms).values({
      fullName,
      email,
      phone,
      age,
      campusId: campusId || null,
      notes: notes || null,
    });

    revalidatePath("/admin/bautizos");
    return { success: true };
  } catch (error) {
    console.error("createBaptismRegistration error:", error);
    return { success: false, error: "No se pudo registrar el bautizo." };
  }
}

export async function updateBaptismStatus(
  id: string,
  status: "pending" | "approved" | "completed"
) {
  try {
    await db.update(baptisms).set({ status }).where(eq(baptisms.id, id));
    revalidatePath("/admin/bautizos");
    return { success: true };
  } catch (error) {
    console.error("updateBaptismStatus error:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}

export async function deleteBaptismRegistration(id: string) {
  try {
    await db.delete(baptisms).where(eq(baptisms.id, id));
    revalidatePath("/admin/bautizos");
    return { success: true };
  } catch (error) {
    console.error("deleteBaptismRegistration error:", error);
    return { success: false, error: "No se pudo eliminar el registro." };
  }
}
