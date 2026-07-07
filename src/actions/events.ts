"use server";

import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const month = formData.get("month") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("dateStr") as string;
  const timeStr = formData.get("timeStr") as string;
  const location = formData.get("location") as string;
  const campus = formData.get("campus") as string;
  const imageFile = formData.get("image") as File | string | null;
  const price = formData.get("price") as string;
  const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
  const featured = formData.get("featured") === "on";

  // Parse dates (they come as YYYY-MM-DD from <input type="date">)
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  
  const startDate = startDateStr ? new Date(startDateStr + "T00:00:00") : null;
  const endDate = endDateStr ? new Date(endDateStr + "T00:00:00") : null;

  await db.insert(events).values({
    title,
    category,
    month,
    description,
    dateStr,
    timeStr,
    startDate,
    endDate,
    location,
    campus,
    image: (await uploadImage(imageFile)) || "",
    price: price || null,
    capacity,
    featured,
  });

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}

export async function updateEvent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const month = formData.get("month") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("dateStr") as string;
  const timeStr = formData.get("timeStr") as string;
  const location = formData.get("location") as string;
  const campus = formData.get("campus") as string;
  const imageFile = formData.get("image") as File | string | null;
  const price = formData.get("price") as string;
  const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
  const featured = formData.get("featured") === "on";

  // Parse dates (they come as YYYY-MM-DD from <input type="date">)
  const startDateStr = formData.get("startDate") as string;
  const endDateStr = formData.get("endDate") as string;
  
  // Create Dates keeping them in local time (or UTC depending on how we parse). 
  // Appending "T00:00:00" ensures it parses as local midnight instead of UTC midnight offset issues.
  const startDate = startDateStr ? new Date(startDateStr + "T00:00:00") : null;
  const endDate = endDateStr ? new Date(endDateStr + "T00:00:00") : null;

  await db.update(events).set({
    title,
    category,
    month,
    description,
    dateStr,
    timeStr,
    startDate,
    endDate,
    location,
    campus,
    ...(imageFile && imageFile !== "undefined" && { image: await uploadImage(imageFile) as string }),
    price: price || null,
    capacity,
    featured,
  }).where(eq(events.id, id));

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}
