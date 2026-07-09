"use server";

import { db } from "@/db";
import { comments, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getComments(devotionalId?: string, testimonyId?: string) {
  if (!devotionalId && !testimonyId) return [];

  const conditions = [];
  if (devotionalId) conditions.push(eq(comments.devotionalId, devotionalId));
  if (testimonyId) conditions.push(eq(comments.testimonyId, testimonyId));

  const list = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userId: comments.userId,
      user: {
        name: users.name,
        image: users.image,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(comments.createdAt));

  return list;
}

export async function createComment(content: string, devotionalId?: string, testimonyId?: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Debes iniciar sesión para comentar.");
  }

  // Find user in database by email to get their id
  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!dbUser) {
    throw new Error("Usuario no encontrado en la base de datos.");
  }

  if (!content.trim()) {
    throw new Error("El comentario no puede estar vacío.");
  }

  await db.insert(comments).values({
    userId: dbUser.id,
    devotionalId: devotionalId || null,
    testimonyId: testimonyId || null,
    content: content.trim(),
  });

  if (devotionalId) {
    revalidatePath(`/devocionales`);
    revalidatePath(`/admin/devocionales`);
  }
  if (testimonyId) {
    revalidatePath(`/testimonios`);
  }
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("No autorizado");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  if (!dbUser) {
    throw new Error("Usuario no encontrado");
  }

  const existingComment = await db.query.comments.findFirst({
    where: eq(comments.id, id),
  });

  if (!existingComment) {
    throw new Error("Comentario no encontrado");
  }

  // Only the comment owner or an administrator can delete comments
  const isOwner = existingComment.userId === dbUser.id;
  const isAdmin = dbUser.role === "admin" || dbUser.role === "superadmin";

  if (!isOwner && !isAdmin) {
    throw new Error("No tienes permisos para eliminar este comentario.");
  }

  await db.delete(comments).where(eq(comments.id, id));

  if (existingComment.devotionalId) {
    revalidatePath(`/devocionales`);
  }
  if (existingComment.testimonyId) {
    revalidatePath(`/testimonios`);
  }
}
