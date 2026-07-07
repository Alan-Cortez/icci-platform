import { db } from "@/db";
import { campuses } from "@/db/schema";
import { desc } from "drizzle-orm";
import { CampusListClient } from "./CampusListClient";

export const metadata = { title: "Sedes | ICCI Admin" };

export default async function AdminCampusPage() {
  const allCampuses = await db.select().from(campuses).orderBy(desc(campuses.isMain)); // Sort by isMain first

  return <CampusListClient initialCampuses={allCampuses} />;
}
