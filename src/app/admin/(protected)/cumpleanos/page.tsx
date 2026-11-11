import { db } from "@/db";
import { members, ministries } from "@/db/schema";
import { CumpleanosClient } from "./CumpleanosClient";
import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

export const metadata = { title: "Cumpleaños y Directorio de Miembros | ICCI Admin" };

export default async function AdminCumpleanosPage() {
  const user = await requireRole([...EVENT_WRITER_ROLES, "pastor"], "/admin");
  const isReadOnly = user.role === "pastor";
  const [allMembers, allMinistries] = await Promise.all([
    db
      .select({
        id: members.id,
        name: members.name,
        paternalSurname: members.paternalSurname,
        maternalSurname: members.maternalSurname,
        birthDay: members.birthDay,
        birthMonth: members.birthMonth,
        phone: members.phone,
        gender: members.gender,
        ministryId: members.ministryId,
        campusId: members.campusId,
        isActive: members.isActive,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
      })
      .from(members)
      .orderBy(asc(members.name), asc(members.paternalSurname)),
    db
      .select({
        id: ministries.id,
        name: ministries.name,
        slug: ministries.slug,
        category: ministries.category,
        description: ministries.description,
        schedule: ministries.schedule,
        leader: ministries.leader,
        leaderId: ministries.leaderId,
        isActive: ministries.isActive,
        createdAt: ministries.createdAt,
      })
      .from(ministries)
      .orderBy(asc(ministries.name)),
  ]);

  return (
    <CumpleanosClient
      initialMembers={allMembers as any}
      ministriesList={allMinistries as any}
      isReadOnly={isReadOnly}
    />
  );
}
