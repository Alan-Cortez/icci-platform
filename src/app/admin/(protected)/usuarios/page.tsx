import { db } from "@/db";
import { users, ministries } from "@/db/schema";
import { UsuariosClient } from "./UsuariosClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";

export const metadata = { title: "Gestión de Usuarios | ICCI Admin" };

export default async function AdminUsuariosPage() {
  const session = await auth();
  const role = session?.user.role;

  if (role !== "superadmin" && role !== "admin" && role !== "pastor") {
    redirect("/admin");
  }

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
