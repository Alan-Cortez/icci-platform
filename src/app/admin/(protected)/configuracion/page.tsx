import { getCampusImages } from "@/actions/campus";
import { CAMPUSES } from "@/lib/constants";
import { ConfiguracionClient } from "./ConfiguracionClient";
import { requireRole } from "@/lib/admin-auth";
import { FULL_ADMIN_ROLES } from "@/lib/roles";

export const metadata = { title: "Configuración | ICCI Admin" };

export default async function AdminConfiguracionPage() {
  await requireRole(FULL_ADMIN_ROLES, "/admin");
  const custom = await getCampusImages();

  const campuses = CAMPUSES.map((c) => ({
    id: c.id,
    name: c.name,
    state: c.state,
    isMain: c.isMain,
    defaultImage: `/images/campus-${c.id}.jpg`,
    customImage: custom[c.id] ?? null,
  }));

  return <ConfiguracionClient campuses={campuses} />;
}
