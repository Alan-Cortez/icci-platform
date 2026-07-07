import { db } from "@/db";
import { prayerRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { PrayerListClient } from "./PrayerListClient";

export const metadata = { title: "Solicitudes de Oración | ICCI Admin" };

export default async function AdminOracionPage() {
  const allPrayers = await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));

  return <PrayerListClient initialPrayers={allPrayers} />;
}
