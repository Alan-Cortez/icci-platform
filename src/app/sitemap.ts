import type { MetadataRoute } from "next";
import { CAMPUSES, getBaseUrl } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/conocenos",
    "/conocenos/historia",
    "/conocenos/mision",
    "/conocenos/vision",
    "/conocenos/pastores",
    "/conocenos/que-creemos",
    "/campus",
    "/eventos",
    "/devocionales",
    "/testimonios",
    "/oracion",
    "/donaciones",
    "/contacto",
    "/calendario",
    "/ministerios",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const campusRoutes = CAMPUSES.map((campus) => ({
    url: `${baseUrl}/campus/${campus.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...campusRoutes];
}
