"use server";

import { db } from "@/db";
import { devotionals } from "@/db/schema";
import type { NewDevotional } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
