import type { Metadata } from "next";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { EventosClient } from "./EventosClient";

export const metadata: Metadata = { title: "Eventos | ICCI" };
export const revalidate = 0;

export default async function EventosPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.startDate), desc(events.createdAt));

  return <EventosClient initialEvents={allEvents} />;
}
