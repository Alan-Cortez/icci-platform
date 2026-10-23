import { getCampusImages } from "@/actions/campus";
import { CAMPUSES } from "@/lib/constants";
import { ConfiguracionClient } from "./ConfiguracionClient";

export const metadata = { title: "Configuración | ICCI Admin" };

export default async function AdminConfiguracionPage() {
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
