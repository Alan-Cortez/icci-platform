"use server";

import { db } from "@/db";
import { gallery } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/upload";
import {
  SERVICE_TYPES,
  dateFromKey,
  toDateKey,
  type BankPhoto,
} from "@/lib/gallery";

const SERVICE_PHOTOS_CATEGORY = "cultos";

async function requireAdmin() {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || (role !== "admin" && role !== "superadmin")) {
    throw new Error("No autorizado");
  }
}

function revalidateGallery(campusIds: (string | null | undefined)[] = []) {
  revalidatePath("/admin/galeria");
  revalidatePath("/campus");
  for (const id of new Set(campusIds)) {
    if (id) revalidatePath(`/campus/${id}`);
  }
}

function isValidMinistry(key: string) {
  return SERVICE_TYPES.some((s) => s.key === key);
}

function isValidDateKey(key: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(dateFromKey(key).getTime());
}

type GalleryRow = typeof gallery.$inferSelect;

/** Rows saved before the photo bank existed fall back to createdAt / "otro". */
function toBankPhoto(row: GalleryRow): BankPhoto {
  return {
    id: row.id,
    campusId: row.campusId,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    ministry: row.ministry && isValidMinistry(row.ministry) ? row.ministry : "otro",
    dateKey: toDateKey(row.eventDate ?? row.createdAt ?? new Date()),
  };
}

/** Public: photos of services for a given campus (newest first). */
export async function getServicePhotos(campusId: string): Promise<BankPhoto[]> {
  const rows = await db
    .select()
    .from(gallery)
    .where(and(eq(gallery.category, SERVICE_PHOTOS_CATEGORY), eq(gallery.campusId, campusId)))
    .orderBy(desc(gallery.eventDate), desc(gallery.createdAt));
  return rows.map(toBankPhoto);
}

/** Admin: all service photos (every campus), newest first. */
export async function getAllServicePhotos(): Promise<BankPhoto[]> {
  await requireAdmin();
  const rows = await db
    .select()
    .from(gallery)
    .where(eq(gallery.category, SERVICE_PHOTOS_CATEGORY))
    .orderBy(desc(gallery.eventDate), desc(gallery.createdAt));
  return rows.map(toBankPhoto);
}

/** Admin: upload ONE photo (the client calls this once per file). */
export async function addServicePhoto(formData: FormData) {
  try {
    await requireAdmin();

    const campusId = (formData.get("campusId") as string) || "allende";
    const title = ((formData.get("title") as string) || "").trim();
    const description = ((formData.get("description") as string) || "").trim();
    const ministry = (formData.get("ministry") as string) || "otro";
    const dateKey = (formData.get("eventDate") as string) || "";
    const imageFile = formData.get("image") as File | null;

    if (!isValidMinistry(ministry)) {
      return { success: false, error: "Tipo de culto no válido." };
    }
    if (!isValidDateKey(dateKey)) {
      return { success: false, error: "La fecha no es válida." };
    }

    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) {
      return { success: false, error: "No se recibió ninguna imagen." };
    }

    await db.insert(gallery).values({
      campusId,
      title: title || SERVICE_TYPES.find((s) => s.key === ministry)?.label || "Culto",
      description: description || null,
      imageUrl,
      category: SERVICE_PHOTOS_CATEGORY,
      ministry,
      eventDate: dateFromKey(dateKey),
    });

    revalidateGallery([campusId]);
    return { success: true };
  } catch (error) {
    console.error("addServicePhoto error:", error);
    return { success: false, error: "No se pudo subir la foto." };
  }
}

/** Admin: edit the data (title, description, service type, date) of several photos at once. */
export async function updateServicePhotos(
  ids: string[],
  data: { title: string; description: string; ministry: string; dateKey: string }
) {
  try {
    await requireAdmin();
    if (ids.length === 0) return { success: true };
    if (!isValidMinistry(data.ministry)) {
      return { success: false, error: "Tipo de culto no válido." };
    }
    if (!isValidDateKey(data.dateKey)) {
      return { success: false, error: "La fecha no es válida." };
    }

    const rows = await db.select().from(gallery).where(inArray(gallery.id, ids));
    await db
      .update(gallery)
      .set({
        title: data.title.trim() || SERVICE_TYPES.find((s) => s.key === data.ministry)?.label || "Culto",
        description: data.description.trim() || null,
        ministry: data.ministry,
        eventDate: dateFromKey(data.dateKey),
      })
      .where(inArray(gallery.id, ids));

    revalidateGallery(rows.map((r) => r.campusId));
    return { success: true };
  } catch (error) {
    console.error("updateServicePhotos error:", error);
    return { success: false, error: "No se pudo guardar los cambios." };
  }
}

/** Admin: delete one or several photos. */
export async function deleteServicePhotos(ids: string[]) {
  try {
    await requireAdmin();
    if (ids.length === 0) return { success: true };
    const rows = await db.select().from(gallery).where(inArray(gallery.id, ids));
    await db.delete(gallery).where(inArray(gallery.id, ids));
    revalidateGallery(rows.map((r) => r.campusId));
    return { success: true };
  } catch (error) {
    console.error("deleteServicePhotos error:", error);
    return { success: false, error: "No se pudo eliminar." };
  }
}
