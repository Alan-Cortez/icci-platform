import { db } from "@/db";
import { users } from "@/db/schema";
import { UsuariosClient } from "./UsuariosClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Gestión de Usuarios | ICCI Admin" };

export default async function AdminUsuariosPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  
  if (role !== "superadmin") {
    redirect("/admin");
  }

  const allUsers = await db.select().from(users);

  return <UsuariosClient initialUsers={allUsers} />;
}
