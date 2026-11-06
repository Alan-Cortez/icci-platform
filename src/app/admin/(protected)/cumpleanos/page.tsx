import { db } from "@/db";
import { members, ministries } from "@/db/schema";
import { CumpleanosClient } from "./CumpleanosClient";
import { asc } from "drizzle-orm";

export const metadata = { title: "Cumpleaños y Directorio de Miembros | ICCI Admin" };

export default async function AdminCumpleanosPage() {
  const [allMembers, allMinistries] = await Promise.all([
    db.select().from(members).orderBy(asc(members.name), asc(members.paternalSurname)),
    db.select().from(ministries).orderBy(asc(ministries.name)),
  ]);

  return <CumpleanosClient initialMembers={allMembers} ministriesList={allMinistries} />;
}
