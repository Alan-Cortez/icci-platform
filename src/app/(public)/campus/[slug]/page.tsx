import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CAMPUSES } from "@/lib/constants";
import { CampusClient } from "./CampusClient";
import { CampusGallery } from "@/components/campus/CampusGallery";
import { getServicePhotos } from "@/actions/gallery";
import { getCampusImages } from "@/actions/campus";
import { db } from "@/db";
import { campuses, campusSchedules } from "@/db/schema";
import { eq, or, asc } from "drizzle-orm";

export const revalidate = 60;

// Google Maps link for the real address
const GOOGLE_MAPS_URL =
  "https://maps.google.com/?q=Calle+Benito+Ju%C3%A1rez+%231705+Norte,+Allende,+Coahuila,+M%C3%A9xico";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbCampuses = await db.select({ slug: campuses.slug, id: campuses.id }).from(campuses).catch(() => []);
  if (dbCampuses.length > 0) {
    return dbCampuses.map((c) => ({ slug: c.slug || c.id }));
  }
  return CAMPUSES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [dbCampus] = await db
    .select()
    .from(campuses)
    .where(or(eq(campuses.slug, slug), eq(campuses.id, slug)))
    .catch(() => []);

  const campus = dbCampus || CAMPUSES.find((c) => c.id === slug);
  if (!campus) return { title: "Campus no encontrado" };
  return {
    title: campus.isMain
      ? "Iglesias Comunidad de Cristo Internacional"
      : `Campus ${campus.name}`,
    description: campus.description,
  };
}

export default async function CampusDetailPage({ params }: Props) {
  const { slug } = await params;

  // 1. Fetch campus from DB
  const [dbCampus] = await db
    .select()
    .from(campuses)
    .where(or(eq(campuses.slug, slug), eq(campuses.id, slug)))
    .catch(() => []);

  const campus = dbCampus || CAMPUSES.find((c) => c.id === slug);
  if (!campus) notFound();

  // 2. Fetch schedules for this specific campus from DB
  const schedules = await db
    .select()
    .from(campusSchedules)
    .where(eq(campusSchedules.campusId, campus.id))
    .orderBy(asc(campusSchedules.sortOrder))
    .catch(() => []);

  const displayName = campus.isMain
    ? "Iglesias Comunidad de Cristo Internacional"
    : `Campus ${campus.name}`;

  const pastorName = campus.pastor || (campus.isMain ? "Apóstol Óscar y Pastora Raquel Sosa" : "Pastor de Campus");

  const photos = await getServicePhotos(campus.id).catch(() => []);
  const customImages = await getCampusImages();

  // Use DB banner image first, then customImages, then default fallback
  const heroImage =
    campus.image || customImages[campus.id] || `/images/campus-${campus.id}.jpg`;

  return (
    <div>
      {/* ── Hero header (Banner / Fachada / Ciudad) ── */}
      <section className="relative overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center bg-navy"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        {/* Overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />

        {/* Text */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {campus.isMain && (
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-gold border border-gold/40 px-3 py-1 rounded-full mb-4 bg-navy/60 backdrop-blur-xs">
              Sede Central
            </span>
          )}
          <h1
            className="font-display text-white leading-none uppercase"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {displayName}
          </h1>
          <p className="font-serif text-white/70 italic font-light mt-2 text-lg">
            {campus.state}
          </p>
          <p className="text-white/80 mt-4 max-w-2xl leading-relaxed font-light">
            {campus.description}
          </p>
        </div>
      </section>

      {/* ── Info cards (Interactive) ── */}
      <CampusClient
        campus={campus}
        schedules={schedules}
        pastorName={pastorName}
        googleMapsUrl={GOOGLE_MAPS_URL}
      />

      {/* ── Fotos de cultos (se administran desde /admin/galeria) ── */}
      <CampusGallery photos={photos} campusName={campus.name} />
    </div>
  );
}
