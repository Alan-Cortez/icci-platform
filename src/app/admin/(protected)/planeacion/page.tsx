import { db } from "@/db";
import { planningEvents, ministries } from "@/db/schema";
import { PlaneacionClient } from "./PlaneacionClient";
import { desc, asc } from "drizzle-orm";

export const metadata = { title: "Planeación de Actividades | ICCI Admin" };

export default async function AdminPlaneacionPage() {
  const [eventsList, ministriesList] = await Promise.all([
    db.select().from(planningEvents).orderBy(desc(planningEvents.date)),
    db.select().from(ministries).orderBy(asc(ministries.name)),
  ]);

  return <PlaneacionClient initialEvents={eventsList} ministriesList={ministriesList} />;
}
