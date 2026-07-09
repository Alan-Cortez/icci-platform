"use server";

import { db } from "@/db";
import { testimonies, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function updateTestimonyStatus(id: string, status: "pending" | "approved" | "rejected") {
  // If we reject a testimony, make sure it is unfeatured too
  const updateData: any = { status };
  if (status === "rejected") {
    updateData.featured = false;
  }
  await db.update(testimonies).set(updateData).where(eq(testimonies.id, id));
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
  revalidatePath("/");
}

export async function toggleTestimonyFeatured(id: string, featured: boolean) {
  await db.update(testimonies).set({ featured }).where(eq(testimonies.id, id));
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
  revalidatePath("/");
}

export async function deleteTestimony(id: string) {
  await db.delete(testimonies).where(eq(testimonies.id, id));
  revalidatePath("/admin/testimonios");
  revalidatePath("/testimonios");
  revalidatePath("/");
}

export async function createTestimony(content: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Debes iniciar sesión para compartir tu testimonio.");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!dbUser) {
    throw new Error("Usuario no encontrado.");
  }

  if (!content.trim()) {
    throw new Error("El testimonio no puede estar vacío.");
  }

  await db.insert(testimonies).values({
    userId: dbUser.id,
    content: content.trim(),
    status: "pending", // Always pending moderation
    featured: false,
  });

  revalidatePath("/testimonios");
}

export async function getApprovedTestimonies() {
  const list = await db
    .select({
      id: testimonies.id,
      content: testimonies.content,
      status: testimonies.status,
      featured: testimonies.featured,
      createdAt: testimonies.createdAt,
      userId: testimonies.userId,
      user: {
        name: users.name,
        image: users.image,
      },
    })
    .from(testimonies)
    .innerJoin(users, eq(testimonies.userId, users.id))
    .where(eq(testimonies.status, "approved"))
    .orderBy(desc(testimonies.createdAt));

  return list;
}

export async function getAllTestimonies() {
  const list = await db
    .select({
      id: testimonies.id,
      content: testimonies.content,
      status: testimonies.status,
      featured: testimonies.featured,
      createdAt: testimonies.createdAt,
      userId: testimonies.userId,
      user: {
        name: users.name,
        email: users.email,
        image: users.image,
      },
    })
    .from(testimonies)
    .innerJoin(users, eq(testimonies.userId, users.id))
    .orderBy(desc(testimonies.createdAt));

  return list;
}

export async function getFeaturedTestimonies() {
  const list = await db
    .select({
      id: testimonies.id,
      content: testimonies.content,
      status: testimonies.status,
      featured: testimonies.featured,
      createdAt: testimonies.createdAt,
      userId: testimonies.userId,
      user: {
        name: users.name,
        image: users.image,
      },
    })
    .from(testimonies)
    .innerJoin(users, eq(testimonies.userId, users.id))
    .where(and(eq(testimonies.status, "approved"), eq(testimonies.featured, true)))
    .orderBy(desc(testimonies.createdAt));

  return list;
}
