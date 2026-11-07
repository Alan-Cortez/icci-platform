import { db } from "@/db";
import { campuses, campusSchedules } from "@/db/schema";
import { CampusClient } from "./CampusClient";
import { desc, asc } from "drizzle-orm";

export const metadata = { title: "Gestión de Campus | ICCI Admin" };

export default async function AdminCampusPage() {
  const [campusesList, schedulesList] = await Promise.all([
    db.select().from(campuses).orderBy(desc(campuses.isMain), asc(campuses.name)),
    db.select().from(campusSchedules).orderBy(asc(campusSchedules.sortOrder)),
  ]);

  return <CampusClient initialCampuses={campusesList} initialSchedules={schedulesList} />;
}
