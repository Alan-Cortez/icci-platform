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

  await db.insert(events).values({
    title,
    category,
    month,
    description,
    dateStr,
    timeStr,
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

  await db.update(events).set({
    title,
    category,
    month,
    description,
    dateStr,
    timeStr,
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
