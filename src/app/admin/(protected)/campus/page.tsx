import { db } from "@/db";
import { campuses, campusSchedules } from "@/db/schema";
import { CampusClient } from "./CampusClient";
import { desc, asc } from "drizzle-orm";
import { requireRole } from "@/lib/admin-auth";

export const metadata = { title: "Gestión de Campus | ICCI Admin" };

export default async function AdminCampusPage() {
  await requireRole(["superadmin", "admin", "pastor"], "/admin");
  const [campusesList, schedulesList] = await Promise.all([
    db.select().from(campuses).orderBy(desc(campuses.isMain), asc(campuses.name)),
    db.select().from(campusSchedules).orderBy(asc(campusSchedules.sortOrder)),
  ]);

  return <CampusClient initialCampuses={campusesList} initialSchedules={schedulesList} />;
}
