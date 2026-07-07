import type { Metadata } from "next";
import { db } from "@/db";
import { devotionals } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DevocionalesClient } from "./DevocionalesClient";

export const metadata: Metadata = { title: "Devocionales | ICCI" };
export const revalidate = 0;

export default async function DevocionalesPage() {
  const allDevotionals = await db.select().from(devotionals).orderBy(desc(devotionals.date));

  return <DevocionalesClient initialDevotionals={allDevotionals} />;
}
