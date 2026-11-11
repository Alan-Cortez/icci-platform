import { db } from "@/db";
import { users, ministries, campuses } from "@/db/schema";
import { UsuariosClient } from "./UsuariosClient";
import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";
import { FULL_ADMIN_ROLES } from "@/lib/roles";

export const metadata = { title: "Gestión de Usuarios | ICCI Admin" };

export default async function AdminUsuariosPage() {
  const currentUser = await requireRole(FULL_ADMIN_ROLES, "/admin");
  const role = currentUser.role;

  const [allUsers, allMinistries, allCampuses] = await Promise.all([
    db.select().from(users).orderBy(asc(users.name)),
    db.select({ id: ministries.id, name: ministries.name, slug: ministries.slug }).from(ministries).orderBy(asc(ministries.name)),
    db.select({ id: campuses.id, name: campuses.name }).from(campuses).orderBy(asc(campuses.name)),
  ]);

  return (
    <UsuariosClient
      initialUsers={allUsers}
      ministriesList={allMinistries}
      campusesList={allCampuses}
      currentUserRole={role || "user"}
    />
  );
}
