import { db } from "@/db";
import { ministries, ministryMembers, members, users } from "@/db/schema";
import { MinisteriosClient } from "./MinisteriosClient";
import { asc, eq, inArray } from "drizzle-orm";
import { requireRole, getAccessibleMinistryIds } from "@/lib/admin-auth";
import { ADMIN_PANEL_ROLES } from "@/lib/roles";

export const metadata = { title: "Gestión de Ministerios y Liderazgo | ICCI Admin" };

export default async function AdminMinisteriosPage() {
  const user = await requireRole(ADMIN_PANEL_ROLES, "/admin");
  const accessibleIds = await getAccessibleMinistryIds(user);
  const isLeaderView = user.role === "leader";
  const isReadOnly = user.role === "pastor";

  const [allMinistries, allUsers, allMembers, rawAssignments] = await Promise.all([
    accessibleIds === null
      ? db.select().from(ministries).orderBy(asc(ministries.name))
      : accessibleIds.length > 0
      ? db
          .select()
          .from(ministries)
          .where(inArray(ministries.id, accessibleIds))
          .orderBy(asc(ministries.name))
      : Promise.resolve([]),
    isLeaderView
      ? Promise.resolve([])
      : db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            role: users.role,
          })
          .from(users)
          .orderBy(asc(users.name)),
    db
      .select({
        id: members.id,
        name: members.name,
        paternalSurname: members.paternalSurname,
        maternalSurname: members.maternalSurname,
        phone: members.phone,
        campusId: members.campusId,
        isActive: members.isActive,
      })
      .from(members)
      .orderBy(asc(members.name), asc(members.paternalSurname)),
    db
      .select({
        id: ministryMembers.id,
        ministryId: ministryMembers.ministryId,
        memberId: ministryMembers.memberId,
        role: ministryMembers.role,
        email: ministryMembers.email,
        phone: ministryMembers.phone,
        memberName: members.name,
        paternalSurname: members.paternalSurname,
        maternalSurname: members.maternalSurname,
        memberPhone: members.phone,
      })
      .from(ministryMembers)
      .leftJoin(members, eq(ministryMembers.memberId, members.id))
      .orderBy(asc(members.name)),
  ]);

  const initialAssignments = rawAssignments.map((row) => ({
    id: row.id,
    ministryId: row.ministryId,
    memberId: row.memberId,
    role: row.role as "pastor" | "lider" | "servidor",
    email: row.email,
    phone: row.phone,
    memberName: [row.memberName, row.paternalSurname, row.maternalSurname]
      .filter(Boolean)
      .join(" "),
    memberPhone: row.memberPhone,
  }));

  return (
    <MinisteriosClient
      initialMinistries={allMinistries}
      usersList={allUsers}
      membersList={allMembers.filter((m) => m.isActive)}
      initialAssignments={initialAssignments}
      userRole={user.role}
      isLeaderView={isLeaderView}
      isReadOnly={isReadOnly}
    />
  );
}
