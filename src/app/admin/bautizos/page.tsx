import { db } from "@/db";
import { baptisms } from "@/db/schema";
import { desc } from "drizzle-orm";
import { BaptismListClient } from "./BaptismListClient";

export const metadata = { title: "Registros de Bautizos | ICCI Admin" };

export default async function AdminBautizosPage() {
  const allBaptisms = await db.select().from(baptisms).orderBy(desc(baptisms.createdAt));

  return <BaptismListClient initialBaptisms={allBaptisms} />;
}
