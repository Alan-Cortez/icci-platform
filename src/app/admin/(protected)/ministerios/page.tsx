import { db } from "@/db";
import { ministries, users } from "@/db/schema";
import { MinisteriosClient } from "./MinisteriosClient";
import { asc } from "drizzle-orm";

export const metadata = { title: "Gestión de Ministerios y Liderazgo | ICCI Admin" };

export default async function AdminMinisteriosPage() {
  const [allMinistries, allUsers] = await Promise.all([
    db.select().from(ministries).orderBy(asc(ministries.name)),
    db.select().from(users).orderBy(asc(users.name)),
  ]);

  return <MinisteriosClient initialMinistries={allMinistries} usersList={allUsers} />;
}
