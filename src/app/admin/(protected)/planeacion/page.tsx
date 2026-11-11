import { db } from "@/db";
import { planningEvents, ministries } from "@/db/schema";
import { PlaneacionClient } from "./PlaneacionClient";
import { desc, asc } from "drizzle-orm";
import { requireRole, getAccessibleMinistryIds } from "@/lib/admin-auth";
import { ADMIN_PANEL_ROLES } from "@/lib/roles";

export const metadata = { title: "Planeación y Calendario de Actividades | ICCI Admin" };

export default async function AdminPlaneacionPage() {
  const user = await requireRole(ADMIN_PANEL_ROLES, "/admin");
  const accessibleMinistryIds = await getAccessibleMinistryIds(user);

  const [eventsList, ministriesList] = await Promise.all([
    db.select().from(planningEvents).orderBy(desc(planningEvents.date)),
    db.select().from(ministries).orderBy(asc(ministries.name)),
  ]);

  return (
    <PlaneacionClient
      initialEvents={eventsList}
      ministriesList={ministriesList}
      userRole={user.role}
      accessibleMinistryIds={accessibleMinistryIds}
    />
  );
}
