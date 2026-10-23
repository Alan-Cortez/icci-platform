import { getAllServicePhotos } from "@/actions/gallery";
import { CAMPUSES } from "@/lib/constants";
import { GaleriaClient } from "./GaleriaClient";

export const metadata = { title: "Fotos de Cultos | ICCI Admin" };

export default async function AdminGaleriaPage() {
  const photos = await getAllServicePhotos();
  const campuses = CAMPUSES.map((c) => ({ id: c.id, name: c.name }));

  return <GaleriaClient initialPhotos={photos} campuses={campuses} />;
}
