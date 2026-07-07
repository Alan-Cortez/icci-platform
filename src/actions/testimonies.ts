"use server";

import { db } from "@/db";
import { testimonies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTestimonyStatus(id: string, status: "pending" | "approved" | "rejected") {
  await db.update(testimonies).set({ status }).where(eq(testimonies.id, id));
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
}

export async function deleteTestimony(id: string) {
  await db.delete(testimonies).where(eq(testimonies.id, id));
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
}
