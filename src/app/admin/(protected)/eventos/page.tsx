import { db } from "@/db";
import { events, ministries, campuses } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { EventListClient } from "./EventListClient";
import { requireRole } from "@/lib/admin-auth";
import { canWriteEventsRole } from "@/lib/roles";

export const metadata = { title: "Gestión de Eventos | ICCI Admin" };

export default async function AdminEventosPage() {
  const user = await requireRole(
    ["superadmin", "admin", "pastor_general", "pastor_campus", "pastor"],
    "/admin"
  );

  const canEditEvents = canWriteEventsRole(user.role);

  const [allEvents, allMinistries, allCampuses] = await Promise.all([
    db.select().from(events).orderBy(desc(events.createdAt)),
    db.select({ id: ministries.id, name: ministries.name }).from(ministries).orderBy(asc(ministries.name)),
    db.select({ id: campuses.id, name: campuses.name }).from(campuses).orderBy(asc(campuses.name)),
  ]);

  return (
    <EventListClient
      initialEvents={allEvents}
      ministriesList={allMinistries}
      campusesList={allCampuses}
      canEditEvents={canEditEvents}
      defaultCampusId={user.campusId || ""}
    />
  );
}
