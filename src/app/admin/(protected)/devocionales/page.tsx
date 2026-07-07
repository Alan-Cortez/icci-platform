import { db } from "@/db";
import { devotionals } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DevocionalListClient } from "./DevocionalListClient";

export const metadata = { title: "Devocionales | ICCI Admin" };

export default async function AdminDevocionalesPage() {
  const allDevotionals = await db.select().from(devotionals).orderBy(desc(devotionals.date));

  return <DevocionalListClient initialDevotionals={allDevotionals} />;
}
