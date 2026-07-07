import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import { EventListClient } from "./EventListClient";

export const metadata = { title: "Gestión de Eventos | ICCI Admin" };

export default async function AdminEventosPage() {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

  return <EventListClient initialEvents={allEvents} />;
}
