"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: "user" | "admin" | "superadmin") {
  await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
  revalidatePath("/admin/usuarios");
}
