import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import { UsuariosClient } from "./UsuariosClient";
import { asc } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";

export const metadata = { title: "Gestión de Usuarios | ICCI Admin" };

export default async function AdminUsuariosPage() {
  const currentUser = await requireRole(["superadmin", "admin", "pastor"], "/admin");
  const role = currentUser.role;

  const [allUsers, allMinistries] = await Promise.all([
    db.select().from(users).orderBy(asc(users.name)),
    db.select().from(ministries).orderBy(asc(ministries.name)),
  ]);

  return (
    <UsuariosClient
      initialUsers={allUsers}
      ministriesList={allMinistries}
      currentUserRole={role || "user"}
    />
  );
}
