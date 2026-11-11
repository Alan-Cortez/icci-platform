import { getAllServicePhotos } from "@/actions/gallery";
import { CAMPUSES } from "@/lib/constants";
import { GaleriaClient } from "./GaleriaClient";
import { requireRole } from "@/lib/admin-auth";

export const metadata = { title: "Banco de Fotos | ICCI Admin" };

export default async function AdminGaleriaPage() {
  await requireRole(["superadmin", "admin", "pastor"], "/admin");
  const photos = await getAllServicePhotos();
  const campuses = CAMPUSES.map((c) => ({ id: c.id, name: c.name }));

  return <GaleriaClient initialPhotos={photos} campuses={campuses} />;
}
