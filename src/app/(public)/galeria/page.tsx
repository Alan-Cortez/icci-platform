import type { Metadata } from "next";
import { db } from "@/db";
import { gallery } from "@/db/schema";
import { desc } from "drizzle-orm";
import { GaleriaClient } from "./GaleriaClient";

export const metadata: Metadata = { title: "Galería | ICCI" };

export default async function GaleriaPage() {
  const allPhotos = await db.select().from(gallery).orderBy(desc(gallery.createdAt));

  return <GaleriaClient initialPhotos={allPhotos} />;
}
