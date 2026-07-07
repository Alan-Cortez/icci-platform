import { db } from "@/db";
import { gallery } from "@/db/schema";
import { desc } from "drizzle-orm";
import { GaleriaListClient } from "./GaleriaListClient";

export const metadata = { title: "Galería | ICCI Admin" };

export default async function AdminGaleriaPage() {
  const allPhotos = await db.select().from(gallery).orderBy(desc(gallery.createdAt));

  return <GaleriaListClient initialPhotos={allPhotos} />;
}
