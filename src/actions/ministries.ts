"use server";

import { db } from "@/db";
import { ministries, type NewMinistry } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

async function requireAdminOrPastor() {
  const session = await auth();
  const allowed = ["superadmin", "admin", "pastor"];
  if (!session || !allowed.includes(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session.user;
}

export async function getMinistries() {
  const session = await auth();
  if (!session) throw new Error("No autorizado");
  return db.select().from(ministries).orderBy(asc(ministries.name));
}

export async function createMinistry(data: {
  name: string;
  category?: string;
  description: string;
  schedule?: string;
  leader?: string;
  leaderId?: string;
  image?: string;
}) {
  await requireAdminOrPastor();

  try {
    const slug = slugify(data.name);
    const id = slug;

    const [created] = await db
      .insert(ministries)
      .values({
        id,
        name: data.name.trim(),
        slug,
        category: data.category || "general",
        description: data.description.trim(),
        schedule: data.schedule?.trim() || null,
        leader: data.leader?.trim() || null,
        leaderId: data.leaderId || null,
        image: data.image || null,
        isActive: true,
        createdAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/ministerios");
    revalidatePath("/admin/usuarios");
    return { success: true, ministry: created };
  } catch (error) {
    console.error("Error creating ministry:", error);
    return { success: false, error: "No se pudo registrar el ministerio." };
  }
}

export async function updateMinistry(
  id: string,
  data: Partial<Omit<NewMinistry, "id" | "createdAt">>
) {
  await requireAdminOrPastor();

  try {
    await db
      .update(ministries)
      .set(data)
      .where(eq(ministries.id, id));

    revalidatePath("/admin/ministerios");
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error updating ministry:", error);
    return { success: false, error: "No se pudo actualizar el ministerio." };
  }
}

export async function deleteMinistry(id: string) {
  const user = await requireAdminOrPastor();
  if (user.role !== "superadmin") {
    return { success: false, error: "Solo el Super Admin puede eliminar ministerios." };
  }

  try {
    await db.delete(ministries).where(eq(ministries.id, id));
    revalidatePath("/admin/ministerios");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return { success: false, error: "No se pudo eliminar el ministerio." };
  }
}
