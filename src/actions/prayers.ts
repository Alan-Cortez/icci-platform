"use server";

import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createPrayerRequest(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const request = formData.get("request") as string;
  const isPublic = formData.get("isPublic") === "on";

  await db.insert(prayerRequests).values({
    name,
    email: email || null,
    phone: phone || null,
    request,
    isPublic,
  });

  // Revalidate if there is a public prayer wall, but for now just the admin page
  revalidatePath("/admin/oracion");
}

export async function updatePrayerStatus(id: string, status: "pending" | "prayed") {
  await db.update(prayerRequests).set({ status }).where(eq(prayerRequests.id, id));
  revalidatePath("/admin/oracion");
}

export async function deletePrayerRequest(id: string) {
  await db.delete(prayerRequests).where(eq(prayerRequests.id, id));
  revalidatePath("/admin/oracion");
}
