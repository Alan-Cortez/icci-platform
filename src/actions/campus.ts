"use server";

import { db } from "@/db";
import { campuses, ministries } from "@/db/schema";
import type { NewCampus, NewMinistry } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/upload";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    redirect("/admin/login");
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── CAMPUSES ────────────────────────────────────────────────────────────────

export async function createCampus(formData: FormData) {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const state = formData.get("state") as string;
    const pastor = formData.get("pastor") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const isMain = formData.get("isMain") === "on";
    const imageFile = formData.get("image") as File | string | null;

    let slug = generateSlug(name);
    const existing = await db.query.campuses.findFirst({ where: eq(campuses.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewCampus = {
      name,
      slug,
      state,
      pastor,
      address,
      phone,
      email: email || null,
      description,
      latitude: latitude || null,
      longitude: longitude || null,
      isMain,
      image: await uploadImage(imageFile),
    };

    await db.insert(campuses).values(values);
    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    return { success: true };
  } catch (error) {
    console.error("createCampus error:", error);
    return { success: false, error: "No se pudo crear el campus." };
  }
}

export async function updateCampus(id: string, formData: FormData) {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const state = formData.get("state") as string;
    const pastor = formData.get("pastor") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const description = formData.get("description") as string;
    const latitude = formData.get("latitude") as string;
    const longitude = formData.get("longitude") as string;
    const isMain = formData.get("isMain") === "on";
    const imageFile = formData.get("image") as File | string | null;

    const uploadedImage = await uploadImage(imageFile);

    await db
      .update(campuses)
      .set({
        name,
        state,
        pastor,
        address,
        phone,
        email: email || null,
        description,
        latitude: latitude || null,
        longitude: longitude || null,
        isMain,
        ...(uploadedImage ? { image: uploadedImage } : {}),
      })
      .where(eq(campuses.id, id));

    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    return { success: true };
  } catch (error) {
    console.error("updateCampus error:", error);
    return { success: false, error: "No se pudo actualizar el campus." };
  }
}

export async function deleteCampus(id: string) {
  await requireAdmin();
  try {
    await db.delete(campuses).where(eq(campuses.id, id));
    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    return { success: true };
  } catch (error) {
    console.error("deleteCampus error:", error);
    return { success: false, error: "No se pudo eliminar el campus." };
  }
}

export async function toggleCampusActive(id: string) {
  await requireAdmin();
  try {
    const campus = await db.query.campuses.findFirst({ where: eq(campuses.id, id) });
    if (!campus) return { success: false, error: "Campus no encontrado." };

    await db.update(campuses).set({ isActive: !campus.isActive }).where(eq(campuses.id, id));
    revalidatePath("/admin/campus");
    revalidatePath("/campus");
    return { success: true };
  } catch (error) {
    console.error("toggleCampusActive error:", error);
    return { success: false, error: "No se pudo cambiar el estado del campus." };
  }
}

// ─── MINISTRIES ──────────────────────────────────────────────────────────────

export async function createMinistry(formData: FormData) {
  await requireAdmin();
  try {
    const name = formData.get("name") as string;
    const campusId = formData.get("campusId") as string | null;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const schedule = formData.get("schedule") as string;
    const leader = formData.get("leader") as string;
    const imageFile = formData.get("image") as File | string | null;

    let slug = generateSlug(name);
    const existing = await db.query.ministries.findFirst({ where: eq(ministries.slug, slug) });
    if (existing) slug = `${slug}-${Date.now()}`;

    const values: NewMinistry = {
      name,
      slug,
      campusId: campusId || null,
      category,
      description,
      schedule: schedule || null,
      leader: leader || null,
      image: await uploadImage(imageFile),
    };

    await db.insert(ministries).values(values);
    revalidatePath("/admin/ministerios");
    revalidatePath("/ministerios");
    return { success: true };
  } catch (error) {
    console.error("createMinistry error:", error);
    return { success: false, error: "No se pudo crear el ministerio." };
  }
}

export async function deleteMinistry(id: string) {
  await requireAdmin();
  try {
    await db.delete(ministries).where(eq(ministries.id, id));
    revalidatePath("/admin/ministerios");
    revalidatePath("/ministerios");
    return { success: true };
  } catch (error) {
    console.error("deleteMinistry error:", error);
    return { success: false, error: "No se pudo eliminar el ministerio." };
  }
}
