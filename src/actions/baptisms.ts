"use server";

import { db } from "@/db";
import { baptisms } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBaptismRegistration(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const age = parseInt(formData.get("age") as string);
  const campus = formData.get("campus") as string;
  const notes = formData.get("notes") as string;

  await db.insert(baptisms).values({
    fullName,
    email,
    phone,
    age,
    campus,
    notes: notes || null,
  });

  revalidatePath("/admin/bautizos");
}

export async function updateBaptismStatus(id: string, status: "pending" | "approved" | "completed") {
  await db.update(baptisms).set({ status }).where(eq(baptisms.id, id));
  revalidatePath("/admin/bautizos");
}

export async function deleteBaptismRegistration(id: string) {
  await db.delete(baptisms).where(eq(baptisms.id, id));
  revalidatePath("/admin/bautizos");
}
