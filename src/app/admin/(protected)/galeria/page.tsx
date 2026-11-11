import { getAllServicePhotos } from "@/actions/gallery";
import { CAMPUSES } from "@/lib/constants";
import { GaleriaClient } from "./GaleriaClient";
import { requireRole } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

export const metadata = { title: "Banco de Fotos | ICCI Admin" };

export default async function AdminGaleriaPage() {
  await requireRole(EVENT_WRITER_ROLES, "/admin");
  const photos = await getAllServicePhotos();
  const campuses = CAMPUSES.map((c) => ({ id: c.id, name: c.name }));

  return <GaleriaClient initialPhotos={photos} campuses={campuses} />;
}
