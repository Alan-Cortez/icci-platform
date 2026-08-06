"use server";

import { db } from "@/db";
import { sermons, devotionals, blogPosts, gallery } from "@/db/schema";
import type { NewSermon, NewDevotional, NewBlogPost, NewGalleryItem } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";
import { auth } from "@/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── SERMONS (Predicaciones) ────────────────────────────────────────────────

export async function createSermon(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const series = formData.get("series") as string;
    const speaker = formData.get("speaker") as string;
    const campusId = formData.get("campusId") as string | null;
    const imageFile = formData.get("image") as File | string | null;
    const date = new Date(formData.get("date") as string);

    let slug = generateSlug(title);
    const existing = await db.query.sermons.findFirst({ where: eq(sermons.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewSermon = {
      title,
      slug,
      description: description || null,
      youtubeUrl: youtubeUrl || null,
      series: series || null,
      speaker,
      campusId: campusId || null,
      image: await uploadImage(imageFile),
      date,
    };

    await db.insert(sermons).values(values);
    revalidatePath("/admin/predicaciones");
    revalidatePath("/predicaciones");
    return { success: true };
  } catch (error) {
    console.error("createSermon error:", error);
    return { success: false, error: "No se pudo crear la predicación." };
  }
}

export async function updateSermon(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const youtubeUrl = formData.get("youtubeUrl") as string;
    const series = formData.get("series") as string;
    const speaker = formData.get("speaker") as string;
    const campusId = formData.get("campusId") as string | null;
    const imageFile = formData.get("image") as File | string | null;
    const dateStr = formData.get("date") as string;

    const uploadedImage = await uploadImage(imageFile);

    await db
      .update(sermons)
      .set({
        title,
        description: description || null,
        youtubeUrl: youtubeUrl || null,
        series: series || null,
        speaker,
        campusId: campusId || null,
        ...(uploadedImage ? { image: uploadedImage } : {}),
        ...(dateStr ? { date: new Date(dateStr) } : {}),
      })
      .where(eq(sermons.id, id));

    revalidatePath("/admin/predicaciones");
    revalidatePath("/predicaciones");
    return { success: true };
  } catch (error) {
    console.error("updateSermon error:", error);
    return { success: false, error: "No se pudo actualizar la predicación." };
  }
}

export async function deleteSermon(id: string) {
  try {
    await db.delete(sermons).where(eq(sermons.id, id));
    revalidatePath("/admin/predicaciones");
    revalidatePath("/predicaciones");
    return { success: true };
  } catch (error) {
    console.error("deleteSermon error:", error);
    return { success: false, error: "No se pudo eliminar la predicación." };
  }
}

// ─── DEVOTIONALS (Devocionales) ─────────────────────────────────────────────

export async function createDevotional(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const type = (formData.get("type") as string) || "classic";
    const verse = formData.get("verse") as string;
    const verseText = formData.get("verseText") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const imageFile = formData.get("image") as File | string | null;
    const date = new Date(formData.get("date") as string);

    let slug = generateSlug(title);
    const existing = await db.query.devotionals.findFirst({ where: eq(devotionals.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewDevotional = {
      title,
      slug,
      type,
      verse: verse || null,
      verseText: verseText || null,
      content,
      author,
      image: await uploadImage(imageFile),
      date,
    };

    await db.insert(devotionals).values(values);
    revalidatePath("/admin/devocionales");
    revalidatePath("/devocionales");
    return { success: true };
  } catch (error) {
    console.error("createDevotional error:", error);
    return { success: false, error: "No se pudo crear el devocional." };
  }
}

export async function updateDevotional(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const type = (formData.get("type") as string) || "classic";
    const verse = formData.get("verse") as string;
    const verseText = formData.get("verseText") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const imageFile = formData.get("image") as File | string | null;
    const dateStr = formData.get("date") as string;

    const uploadedImage = await uploadImage(imageFile);

    await db
      .update(devotionals)
      .set({
        title,
        type,
        verse: verse || null,
        verseText: verseText || null,
        content,
        author,
        ...(uploadedImage ? { image: uploadedImage } : {}),
        ...(dateStr ? { date: new Date(dateStr) } : {}),
      })
      .where(eq(devotionals.id, id));

    revalidatePath("/admin/devocionales");
    revalidatePath("/devocionales");
    return { success: true };
  } catch (error) {
    console.error("updateDevotional error:", error);
    return { success: false, error: "No se pudo actualizar el devocional." };
  }
}

export async function deleteDevotional(id: string) {
  try {
    await db.delete(devotionals).where(eq(devotionals.id, id));
    revalidatePath("/admin/devocionales");
    revalidatePath("/devocionales");
    return { success: true };
  } catch (error) {
    console.error("deleteDevotional error:", error);
    return { success: false, error: "No se pudo eliminar el devocional." };
  }
}

// ─── BLOG ───────────────────────────────────────────────────────────────────

export async function createBlogPost(formData: FormData) {
  try {
    const session = await auth();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const coverImageFile = formData.get("coverImage") as File | string | null;
    const publishedAtStr = formData.get("publishedAt") as string;

    let slug = generateSlug(title);
    const existing = await db.query.blogPosts.findFirst({ where: eq(blogPosts.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewBlogPost = {
      title,
      slug,
      excerpt,
      content,
      author,
      authorId: session?.user?.id ?? null,
      coverImage: await uploadImage(coverImageFile),
      isPublished: !!publishedAtStr,
      publishedAt: publishedAtStr ? new Date(publishedAtStr) : null,
    };

    await db.insert(blogPosts).values(values);
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("createBlogPost error:", error);
    return { success: false, error: "No se pudo crear el artículo." };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const coverImageFile = formData.get("coverImage") as File | string | null;
    const publishedAtStr = formData.get("publishedAt") as string;

    const uploadedImage = await uploadImage(coverImageFile);

    await db
      .update(blogPosts)
      .set({
        title,
        excerpt,
        content,
        author,
        ...(uploadedImage ? { coverImage: uploadedImage } : {}),
        ...(publishedAtStr ? { publishedAt: new Date(publishedAtStr), isPublished: true } : {}),
      })
      .where(eq(blogPosts.id, id));

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("updateBlogPost error:", error);
    return { success: false, error: "No se pudo actualizar el artículo." };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    console.error("deleteBlogPost error:", error);
    return { success: false, error: "No se pudo eliminar el artículo." };
  }
}

// ─── GALLERY (Galería) ───────────────────────────────────────────────────────

export async function createGalleryImage(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const imageFile = formData.get("imageUrl") as File | string | null;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const campusId = formData.get("campusId") as string | null;

    const values: NewGalleryItem = {
      title,
      imageUrl: (await uploadImage(imageFile)) ?? "",
      description: description || null,
      category,
      campusId: campusId || null,
    };

    await db.insert(gallery).values(values);
    revalidatePath("/admin/galeria");
    revalidatePath("/galeria");
    return { success: true };
  } catch (error) {
    console.error("createGalleryImage error:", error);
    return { success: false, error: "No se pudo subir la imagen." };
  }
}

export async function updateGalleryImage(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const imageFile = formData.get("imageUrl") as File | string | null;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const campusId = formData.get("campusId") as string | null;

    const uploadedImage = await uploadImage(imageFile);

    await db
      .update(gallery)
      .set({
        title,
        ...(uploadedImage ? { imageUrl: uploadedImage } : {}),
        description: description || null,
        category,
        campusId: campusId || null,
      })
      .where(eq(gallery.id, id));

    revalidatePath("/admin/galeria");
    revalidatePath("/galeria");
    return { success: true };
  } catch (error) {
    console.error("updateGalleryImage error:", error);
    return { success: false, error: "No se pudo actualizar la imagen." };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await db.delete(gallery).where(eq(gallery.id, id));
    revalidatePath("/admin/galeria");
    revalidatePath("/galeria");
    return { success: true };
  } catch (error) {
    console.error("deleteGalleryImage error:", error);
    return { success: false, error: "No se pudo eliminar la imagen." };
  }
}
