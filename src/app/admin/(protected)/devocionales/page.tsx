import { db } from "@/db";
import { devotionals } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DevocionalListClient } from "./DevocionalListClient";
import { requireRole } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

export const metadata = { title: "Devocionales | ICCI Admin" };

export default async function AdminDevocionalesPage() {
  await requireRole(EVENT_WRITER_ROLES, "/admin");
  const allDevotionals = await db.select().from(devotionals).orderBy(desc(devotionals.date));

  return <DevocionalListClient initialDevotionals={allDevotionals} />;
}
