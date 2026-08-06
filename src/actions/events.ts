"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import type { NewEvent } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildStartDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

export async function createEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const timeStr = formData.get("timeStr") as string;
    const location = formData.get("location") as string;
    const campusId = formData.get("campusId") as string | null;
    const responsible = formData.get("responsible") as string | null;
    const imageFile = formData.get("image") as File | string | null;
    const price = formData.get("price") as string;
    const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
    const featured = formData.get("featured") === "on";
    const requiresRegistration = formData.get("requiresRegistration") === "on";

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startDate = buildStartDate(startDateStr);
    const endDate = endDateStr ? buildStartDate(endDateStr) : null;

    let slug = generateSlug(title);
    const existing = await db.query.events.findFirst({ where: eq(events.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewEvent = {
      title,
      slug,
      category,
      description,
      timeStr,
      location,
      campusId: campusId || null,
      responsible: responsible || null,
      image: await uploadImage(imageFile),
      price: price || null,
      capacity,
      featured,
      requiresRegistration,
      startDate,
      endDate,
    };

    await db.insert(events).values(values);
    revalidatePath("/admin/eventos");
    revalidatePath("/eventos");
    return { success: true };
  } catch (error) {
    console.error("createEvent error:", error);
    return { success: false, error: "No se pudo crear el evento." };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const timeStr = formData.get("timeStr") as string;
    const location = formData.get("location") as string;
    const campusId = formData.get("campusId") as string | null;
    const responsible = formData.get("responsible") as string | null;
    const imageFile = formData.get("image") as File | string | null;
    const price = formData.get("price") as string;
    const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
    const featured = formData.get("featured") === "on";
    const requiresRegistration = formData.get("requiresRegistration") === "on";

    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const startDate = startDateStr ? buildStartDate(startDateStr) : undefined;
    const endDate = endDateStr ? buildStartDate(endDateStr) : null;

    const uploadedImage = await uploadImage(imageFile);

    await db
      .update(events)
      .set({
        title,
        category,
        description,
        timeStr,
        location,
        campusId: campusId || null,
        responsible: responsible || null,
        ...(uploadedImage ? { image: uploadedImage } : {}),
        ...(startDate ? { startDate } : {}),
        endDate,
        price: price || null,
        capacity,
        featured,
        requiresRegistration,
      })
      .where(eq(events.id, id));

    revalidatePath("/admin/eventos");
    revalidatePath("/eventos");
    return { success: true };
  } catch (error) {
    console.error("updateEvent error:", error);
    return { success: false, error: "No se pudo actualizar el evento." };
  }
}

export async function deleteEvent(id: string) {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/admin/eventos");
    revalidatePath("/eventos");
    return { success: true };
  } catch (error) {
    console.error("deleteEvent error:", error);
    return { success: false, error: "No se pudo eliminar el evento." };
  }
}

export async function toggleEventPublished(id: string, isPublished: boolean) {
  try {
    await db.update(events).set({ isPublished }).where(eq(events.id, id));
    revalidatePath("/admin/eventos");
    revalidatePath("/eventos");
    return { success: true };
  } catch (error) {
    console.error("toggleEventPublished error:", error);
    return { success: false, error: "No se pudo cambiar el estado del evento." };
  }
}
