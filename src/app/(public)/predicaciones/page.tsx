import type { Metadata } from "next";
import { db } from "@/db";
import { sermons } from "@/db/schema";
import { desc } from "drizzle-orm";
import { PredicacionesClient } from "./PredicacionesClient";

export const metadata: Metadata = { title: "Predicaciones | ICCI" };
export const revalidate = 0;

export default async function PredicacionesPage() {
  const allSermons = await db.select().from(sermons).orderBy(desc(sermons.date));

  return <PredicacionesClient initialSermons={allSermons} />;
}
