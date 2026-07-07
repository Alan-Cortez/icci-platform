"use server";

import { db } from "@/db";
import { campuses, ministries } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

// --- CAMPUS ---
export async function createCampus(formData: FormData) {
  const name = formData.get("name") as string;
  const state = formData.get("state") as string;
  const pastor = formData.get("pastor") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File | string | null;
  const isMain = formData.get("isMain") === "on";

  await db.insert(campuses).values({
    name,
    state,
    pastor,
    address,
    phone,
    description,
    image: await uploadImage(imageFile),
    isMain,
  });

  revalidatePath("/admin/campus");
  revalidatePath("/campus");
}

export async function updateCampus(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const state = formData.get("state") as string;
  const pastor = formData.get("pastor") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const description = formData.get("description") as string;
  const imageFile = formData.get("image") as File | string | null;
  const isMain = formData.get("isMain") === "on";

  await db.update(campuses).set({
    name,
    state,
    pastor,
    address,
    phone,
    description,
    ...(imageFile && imageFile !== "undefined" && { image: await uploadImage(imageFile) }),
    isMain,
  }).where(eq(campuses.id, id));
  
  revalidatePath("/admin/campus");
  revalidatePath("/campus");
}

export async function deleteCampus(id: string) {
  await db.delete(campuses).where(eq(campuses.id, id));
  revalidatePath("/admin/campus");
  revalidatePath("/campus");
}

// --- MINISTRIES ---
export async function createMinistry(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const schedule = formData.get("schedule") as string;
  const leader = formData.get("leader") as string;
  const imageFile = formData.get("image") as File | string | null;

  await db.insert(ministries).values({
    name,
    description,
    schedule: schedule || null,
    leader: leader || null,
    image: await uploadImage(imageFile),
  });

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function updateMinistry(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const schedule = formData.get("schedule") as string;
  const leader = formData.get("leader") as string;
  const imageFile = formData.get("image") as File | string | null;

  await db.update(ministries).set({
    name,
    description,
    schedule: schedule || null,
    leader: leader || null,
    ...(imageFile && imageFile !== "undefined" && { image: await uploadImage(imageFile) }),
  }).where(eq(ministries.id, id));
  
  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function deleteMinistry(id: string) {
  await db.delete(ministries).where(eq(ministries.id, id));
  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}
