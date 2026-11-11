import { db } from "@/db";
import { events, ministries } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { EventListClient } from "./EventListClient";
import { requireRole } from "@/lib/admin-auth";

export const metadata = { title: "Gestión de Eventos | ICCI Admin" };

export default async function AdminEventosPage() {
  await requireRole(["superadmin", "admin", "pastor"], "/admin");

  const [allEvents, allMinistries] = await Promise.all([
    db.select().from(events).orderBy(desc(events.createdAt)),
    db.select().from(ministries).orderBy(asc(ministries.name)),
  ]);

  return <EventListClient initialEvents={allEvents} ministriesList={allMinistries} />;
}
