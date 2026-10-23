"use server";

import { db } from "@/db";
import { gallery } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/upload";

/** Category used in the `gallery` table for photos of church services. */
const SERVICE_PHOTOS_CATEGORY = "cultos";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || (role !== "admin" && role !== "superadmin")) {
    throw new Error("No autorizado");
  }
}

function revalidateGallery(campusId?: string | null) {
  revalidatePath("/admin/galeria");
  revalidatePath("/campus");
  if (campusId) revalidatePath(`/campus/${campusId}`);
}

/** Public: photos of services for a given campus (newest first). */
export async function getServicePhotos(campusId: string) {
  return db
    .select()
    .from(gallery)
    .where(and(eq(gallery.category, SERVICE_PHOTOS_CATEGORY), eq(gallery.campusId, campusId)))
    .orderBy(desc(gallery.createdAt));
}

/** Admin: all service photos (every campus), newest first. */
export async function getAllServicePhotos() {
  await requireAdmin();
  return db
    .select()
    .from(gallery)
    .where(eq(gallery.category, SERVICE_PHOTOS_CATEGORY))
    .orderBy(desc(gallery.createdAt));
}

/** Admin: upload ONE photo (the client calls this once per file). */
export async function addServicePhoto(formData: FormData) {
  try {
    await requireAdmin();

    const campusId = (formData.get("campusId") as string) || "allende";
    const title = ((formData.get("title") as string) || "").trim();
    const imageFile = formData.get("image") as File | null;

    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) {
      return { success: false, error: "No se recibió ninguna imagen." };
    }

    await db.insert(gallery).values({
      campusId,
      title: title || "Culto",
      imageUrl,
      category: SERVICE_PHOTOS_CATEGORY,
    });

    revalidateGallery(campusId);
    return { success: true };
  } catch (error) {
    console.error("addServicePhoto error:", error);
    return { success: false, error: "No se pudo subir la foto." };
  }
}

/** Admin: edit the caption of a photo. */
export async function updateServicePhotoTitle(id: string, title: string) {
  try {
    await requireAdmin();
    const photo = await db.query.gallery.findFirst({ where: eq(gallery.id, id) });
    await db.update(gallery).set({ title: title.trim() || "Culto" }).where(eq(gallery.id, id));
    revalidateGallery(photo?.campusId);
    return { success: true };
  } catch (error) {
    console.error("updateServicePhotoTitle error:", error);
    return { success: false, error: "No se pudo actualizar la descripción." };
  }
}

/** Admin: delete a photo. */
export async function deleteServicePhoto(id: string) {
  try {
    await requireAdmin();
    const photo = await db.query.gallery.findFirst({ where: eq(gallery.id, id) });
    await db.delete(gallery).where(eq(gallery.id, id));
    revalidateGallery(photo?.campusId);
    return { success: true };
  } catch (error) {
    console.error("deleteServicePhoto error:", error);
    return { success: false, error: "No se pudo eliminar la foto." };
  }
}
