import { db } from "@/db";
import { preachingSchedules, campuses, users } from "@/db/schema";
import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";
import { canManagePreachingsUser } from "@/lib/roles";
import { PredicacionesClient } from "./PredicacionesClient";

export const metadata = { title: "Rol de Predicaciones del Mes | ICCI Admin" };

export default async function AdminPredicacionesPage() {
  const user = await requireRole(
    ["superadmin", "admin", "pastor_general", "pastor_campus", "pastor"],
    "/admin"
  );

  const canManage = canManagePreachingsUser(user);

  const [items, campusesList, pastorUsers] = await Promise.all([
    db.select().from(preachingSchedules).orderBy(asc(preachingSchedules.date)),
    db.select({ id: campuses.id, name: campuses.name }).from(campuses).orderBy(asc(campuses.name)),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .orderBy(asc(users.name)),
  ]);

  const preachersSuggestions = pastorUsers.filter(
    (u) =>
      u.role === "pastor" ||
      u.role === "pastor_general" ||
      u.role === "pastor_campus" ||
      u.role === "superadmin" ||
      u.role === "admin"
  );

  return (
    <PredicacionesClient
      initialItems={items}
      campusesList={campusesList}
      preachersSuggestions={preachersSuggestions}
      canManage={canManage}
      defaultCampusId={user.campusId || ""}
    />
  );
}
