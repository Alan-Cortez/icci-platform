"use server";

import { db } from "@/db";
import { ministries, ministryMembers, members, users, type NewMinistry } from "@/db/schema";
import { eq, asc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentAdminUser, getAccessibleMinistryIds } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

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
  const user = await getCurrentAdminUser();
  if (!user || !EVENT_WRITER_ROLES.includes(user.role)) {
    throw new Error("No autorizado");
  }
  return user;
}

/**
 * Links existing Google-authenticated users automatically if their ID or email
 * is assigned as leader or pastor on a ministry.
 */
async function syncAssignedUsersWithMinistry(
  ministryId: string,
  leaderId?: string | null,
  leaderEmail?: string | null,
  pastorEmail?: string | null
): Promise<string | null> {
  let resolvedLeaderId = leaderId || null;

  if (leaderId) {
    const target = await db.query.users.findFirst({ where: eq(users.id, leaderId) });
    if (target && (target.role === "user" || target.role === "leader")) {
      await db
        .update(users)
        .set({ role: "leader", ministryId })
        .where(eq(users.id, target.id));
    }
  } else if (leaderEmail && leaderEmail.trim()) {
    const normalized = leaderEmail.trim().toLowerCase();
    const matched = await db
      .select()
      .from(users)
      .where(sql`lower(trim(${users.email})) = ${normalized}`)
      .limit(1);

    if (matched.length > 0) {
      const target = matched[0];
      resolvedLeaderId = target.id;
      if (target.role === "user" || target.role === "leader") {
        await db
          .update(users)
          .set({ role: "leader", ministryId })
          .where(eq(users.id, target.id));
      }
    }
  }

  if (pastorEmail && pastorEmail.trim()) {
    const normalizedPastor = pastorEmail.trim().toLowerCase();
    const matchedPastor = await db
      .select()
      .from(users)
      .where(sql`lower(trim(${users.email})) = ${normalizedPastor}`)
      .limit(1);

    if (matchedPastor.length > 0 && matchedPastor[0].role === "user") {
      await db
        .update(users)
        .set({ role: "pastor" })
        .where(eq(users.id, matchedPastor[0].id));
    }
  }

  return resolvedLeaderId;
}

export async function getMinistries() {
  const user = await getCurrentAdminUser();
  if (!user) throw new Error("No autorizado");
  return db.select().from(ministries).orderBy(asc(ministries.name));
}

export async function createMinistry(data: {
  name: string;
  category?: string;
  description: string;
  schedule?: string;
  leader?: string;
  leaderId?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  pastor?: string;
  pastorEmail?: string;
  pastorPhone?: string;
  image?: string;
}) {
  await requireAdminOrPastor();

  try {
    const slug = slugify(data.name);
    const id = slug;

    const resolvedLeaderId = await syncAssignedUsersWithMinistry(
      id,
      data.leaderId || null,
      data.leaderEmail || null,
      data.pastorEmail || null
    );

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
        leaderId: resolvedLeaderId,
        leaderEmail: data.leaderEmail?.trim() || null,
        leaderPhone: data.leaderPhone?.trim() || null,
        pastor: data.pastor?.trim() || null,
        pastorEmail: data.pastorEmail?.trim() || null,
        pastorPhone: data.pastorPhone?.trim() || null,
        image: data.image || null,
        isActive: true,
        createdAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/ministerios");
    revalidatePath("/admin/usuarios");
    revalidatePath("/ministerios");
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
  const user = await getCurrentAdminUser();
  if (!user) return { success: false, error: "No autorizado" };

  try {
    if (user.role === "pastor") {
      return { success: false, error: "Acceso de solo lectura en ministerios." };
    }

    if (user.role === "leader") {
      const accessible = await getAccessibleMinistryIds(user);
      if (!accessible || !accessible.includes(id)) {
        return { success: false, error: "Solo puedes editar información de tu propio ministerio." };
      }

      // Leaders can update description and schedule of their own ministry
      await db
        .update(ministries)
        .set({
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.schedule !== undefined ? { schedule: data.schedule } : {}),
        })
        .where(eq(ministries.id, id));

      revalidatePath("/admin/ministerios");
      revalidatePath("/ministerios");
      return { success: true };
    }

    const resolvedLeaderId = await syncAssignedUsersWithMinistry(
      id,
      data.leaderId,
      data.leaderEmail,
      data.pastorEmail
    );

    const payload = {
      ...data,
      ...(resolvedLeaderId ? { leaderId: resolvedLeaderId } : {}),
    };

    await db.update(ministries).set(payload).where(eq(ministries.id, id));

    revalidatePath("/admin/ministerios");
    revalidatePath("/admin/usuarios");
    revalidatePath("/ministerios");
    return { success: true, resolvedLeaderId };
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
    revalidatePath("/ministerios");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return { success: false, error: "No se pudo eliminar el ministerio." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MINISTRY TEAM ROSTER (Members serving in each ministry)
// ─────────────────────────────────────────────────────────────────────────────

async function canManageMinistryTeam(ministryId: string) {
  const user = await getCurrentAdminUser();
  if (!user || user.role === "pastor") return null;
  const accessible = await getAccessibleMinistryIds(user);
  if (accessible !== null && !accessible.includes(ministryId)) {
    return null;
  }
  return user;
}

export async function addMemberToMinistry(input: {
  ministryId: string;
  memberId: number;
  role: "pastor" | "lider" | "servidor";
  email?: string;
  phone?: string;
}) {
  const user = await canManageMinistryTeam(input.ministryId);
  if (!user) {
    return { success: false, error: "No tienes permisos para modificar este ministerio." };
  }

  try {
    const existing = await db
      .select()
      .from(ministryMembers)
      .where(
        and(
          eq(ministryMembers.ministryId, input.ministryId),
          eq(ministryMembers.memberId, input.memberId)
        )
      )
      .limit(1);

    let savedId: string;
    if (existing.length > 0) {
      savedId = existing[0].id;
      await db
        .update(ministryMembers)
        .set({
          role: input.role,
          email: input.email?.trim() || existing[0].email,
          phone: input.phone?.trim() || existing[0].phone,
        })
        .where(eq(ministryMembers.id, savedId));
    } else {
      const id = `mm-${input.ministryId}-${input.memberId}-${Date.now()}`;
      savedId = id;
      await db.insert(ministryMembers).values({
        id,
        ministryId: input.ministryId,
        memberId: input.memberId,
        role: input.role,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        createdAt: new Date(),
      });
    }

    // Also fill member.ministryId if empty
    const [memberRow] = await db
      .select()
      .from(members)
      .where(eq(members.id, input.memberId))
      .limit(1);

    if (memberRow && !memberRow.ministryId) {
      await db
        .update(members)
        .set({ ministryId: input.ministryId })
        .where(eq(members.id, input.memberId));
    }

    revalidatePath("/admin/ministerios");
    return {
      success: true,
      assignment: {
        id: savedId,
        ministryId: input.ministryId,
        memberId: input.memberId,
        role: input.role,
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || memberRow?.phone || null,
        memberName: memberRow
          ? [memberRow.name, memberRow.paternalSurname, memberRow.maternalSurname]
              .filter(Boolean)
              .join(" ")
          : "Miembro",
        memberPhone: memberRow?.phone || null,
      },
    };
  } catch (error) {
    console.error("addMemberToMinistry error:", error);
    return { success: false, error: "No se pudo agregar al hermano al ministerio." };
  }
}

export async function updateMinistryMemberRole(
  assignmentId: string,
  role: "pastor" | "lider" | "servidor",
  email?: string,
  phone?: string
) {
  try {
    const [existing] = await db
      .select()
      .from(ministryMembers)
      .where(eq(ministryMembers.id, assignmentId))
      .limit(1);

    if (!existing) return { success: false, error: "Registro no encontrado." };
    const user = await canManageMinistryTeam(existing.ministryId);
    if (!user) return { success: false, error: "No autorizado." };

    await db
      .update(ministryMembers)
      .set({
        role,
        ...(email !== undefined ? { email: email.trim() || null } : {}),
        ...(phone !== undefined ? { phone: phone.trim() || null } : {}),
      })
      .where(eq(ministryMembers.id, assignmentId));

    revalidatePath("/admin/ministerios");
    return { success: true };
  } catch (error) {
    console.error("updateMinistryMemberRole error:", error);
    return { success: false, error: "No se pudo actualizar el rol." };
  }
}

export async function removeMemberFromMinistry(assignmentId: string) {
  try {
    const [existing] = await db
      .select()
      .from(ministryMembers)
      .where(eq(ministryMembers.id, assignmentId))
      .limit(1);

    if (!existing) return { success: false, error: "Registro no encontrado." };
    const user = await canManageMinistryTeam(existing.ministryId);
    if (!user) return { success: false, error: "No autorizado." };

    await db.delete(ministryMembers).where(eq(ministryMembers.id, assignmentId));
    revalidatePath("/admin/ministerios");
    return { success: true };
  } catch (error) {
    console.error("removeMemberFromMinistry error:", error);
    return { success: false, error: "No se pudo quitar al miembro del ministerio." };
  }
}
