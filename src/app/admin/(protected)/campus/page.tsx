import { db } from "@/db";
import { campuses, campusSchedules } from "@/db/schema";
import { CampusClient } from "./CampusClient";
import { desc, asc, eq } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

export const metadata = { title: "Gestión de Campus | ICCI Admin" };

export default async function AdminCampusPage() {
  const user = await requireRole(EVENT_WRITER_ROLES, "/admin");
  const filterByCampus = user.role === "pastor_campus" && user.campusId ? user.campusId : null;
  const [campusesList, schedulesList] = await Promise.all([
    filterByCampus
      ? db.select().from(campuses).where(eq(campuses.id, filterByCampus))
      : db.select().from(campuses).orderBy(desc(campuses.isMain), asc(campuses.name)),
    db.select().from(campusSchedules).orderBy(asc(campusSchedules.sortOrder)),
  ]);

  return <CampusClient initialCampuses={campusesList} initialSchedules={schedulesList} />;
}
