import { db } from "@/db";
import { sermons } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SermonListClient } from "./SermonListClient";

export const metadata = { title: "Predicaciones | ICCI Admin" };

export default async function AdminPredicacionesPage() {
  const allSermons = await db.select().from(sermons).orderBy(desc(sermons.date));

  return <SermonListClient initialSermons={allSermons} />;
}
