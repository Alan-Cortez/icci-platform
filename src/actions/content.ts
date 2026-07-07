"use server";

import { db } from "@/db";
import { sermons, devotionals, blogPosts, gallery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- SERMONS (Predicaciones) ---
export async function createSermon(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const speaker = formData.get("speaker") as string;
  const image = formData.get("image") as string;
  const date = new Date(formData.get("date") as string);

  await db.insert(sermons).values({
    title,
    description: description || null,
    youtubeUrl,
    speaker,
    image: image || null,
    date,
  });

  revalidatePath("/admin/predicaciones");
  revalidatePath("/predicaciones");
}

export async function updateSermon(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const speaker = formData.get("speaker") as string;
  const image = formData.get("image") as string;
  const dateStr = formData.get("date") as string;

  const dataToUpdate: any = {
    title,
    description: description || null,
    youtubeUrl,
    speaker,
    image: image || null,
  };

  if (dateStr) {
    dataToUpdate.date = new Date(dateStr);
  }

  await db.update(sermons).set(dataToUpdate).where(eq(sermons.id, id));
  revalidatePath("/admin/predicaciones");
  revalidatePath("/predicaciones");
}

export async function deleteSermon(id: string) {
  await db.delete(sermons).where(eq(sermons.id, id));
  revalidatePath("/admin/predicaciones");
  revalidatePath("/predicaciones");
}

// --- DEVOTIONALS (Devocionales) ---
export async function createDevotional(formData: FormData) {
  const title = formData.get("title") as string;
  const verse = formData.get("verse") as string;
  const verseText = formData.get("verseText") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;
  const date = new Date(formData.get("date") as string);

  await db.insert(devotionals).values({
    title,
    verse: verse || null,
    verseText: verseText || null,
    content,
    author,
    image: image || null,
    date,
  });

  revalidatePath("/admin/devocionales");
  revalidatePath("/devocionales");
}

export async function updateDevotional(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const verse = formData.get("verse") as string;
  const verseText = formData.get("verseText") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;
  const dateStr = formData.get("date") as string;

  const dataToUpdate: any = {
    title,
    verse: verse || null,
    verseText: verseText || null,
    content,
    author,
    image: image || null,
  };

  if (dateStr) {
    dataToUpdate.date = new Date(dateStr);
  }

  await db.update(devotionals).set(dataToUpdate).where(eq(devotionals.id, id));
  revalidatePath("/admin/devocionales");
  revalidatePath("/devocionales");
}

export async function deleteDevotional(id: string) {
  await db.delete(devotionals).where(eq(devotionals.id, id));
  revalidatePath("/admin/devocionales");
  revalidatePath("/devocionales");
}

// --- BLOG ---
export async function createBlogPost(formData: FormData) {
  const title = formData.get("title") as string;
  let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const coverImage = formData.get("coverImage") as string;
  const publishedAt = new Date(formData.get("publishedAt") as string);

  // Simple slug duplicate prevention (could be improved)
  const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  if (existing.length > 0) {
    slug = `${slug}-${Date.now()}`;
  }

  await db.insert(blogPosts).values({
    title,
    slug,
    excerpt,
    content,
    author,
    coverImage: coverImage || null,
    publishedAt,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const coverImage = formData.get("coverImage") as string;
  const publishedAtStr = formData.get("publishedAt") as string;

  const dataToUpdate: any = {
    title,
    excerpt,
    content,
    author,
    coverImage: coverImage || null,
  };

  if (publishedAtStr) {
    dataToUpdate.publishedAt = new Date(publishedAtStr);
  }

  await db.update(blogPosts).set(dataToUpdate).where(eq(blogPosts.id, id));
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function deleteBlogPost(id: string) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

// --- GALLERY (Galería) ---
export async function createGalleryImage(formData: FormData) {
  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await db.insert(gallery).values({
    title,
    imageUrl,
    description: description || null,
    category,
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}

export async function updateGalleryImage(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await db.update(gallery).set({
    title,
    imageUrl,
    description: description || null,
    category,
  }).where(eq(gallery.id, id));
  
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}

export async function deleteGalleryImage(id: string) {
  await db.delete(gallery).where(eq(gallery.id, id));
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
}
