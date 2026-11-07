import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { CAMPUSES } from "@/lib/constants";
import { getYoutubeLiveStatus } from "@/lib/youtube";
import { CampusLiveSection } from "@/components/campus/CampusLiveSection";
import { getCampusImages } from "@/actions/campus";
import { db } from "@/db";
import { campuses } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Campus",
  description: "Ubicaciones de ICCI en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango, y transmisiones en vivo por YouTube.",
};

export const revalidate = 60;

// Map each campus id to its default fallback image
const CAMPUS_IMAGES: Record<string, string> = {
  allende: "/images/campus-allende.jpg",
  sabinas: "/images/campus-sabinas.jpg",
  muzquiz: "/images/campus-muzquiz.jpg",
  barroteran: "/images/campus-barroteran.jpg",
  anahuac: "/images/campus-anahuac.jpg",
  durango: "/images/campus-durango.jpg",
};

export default async function CampusListPage() {
  const [dbCampuses, liveStatus, customImages] = await Promise.all([
    db
      .select()
      .from(campuses)
      .orderBy(desc(campuses.isMain), asc(campuses.name))
      .catch(() => []),
    getYoutubeLiveStatus(),
    getCampusImages(),
  ]);

  const allCampuses =
    dbCampuses.length > 0
      ? dbCampuses
      : [...CAMPUSES].sort((a, b) =>
          a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
        );

  return (
    <div className="py-16 bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Ubicaciones"
          title="Nuestros Campus"
          description="Encuentra el campus ICCI más cercano a ti o acompáñanos a través de nuestras transmisiones en vivo en YouTube."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCampuses.map((campus: any) => {
            const customImage = customImages[campus.id];
            const img =
              campus.image || customImage || CAMPUS_IMAGES[campus.id] || CAMPUS_IMAGES.allende;
            const targetSlug = campus.slug || campus.id;

            return (
              <Link
                key={campus.id}
                href={`/campus/${targetSlug}`}
                aria-label={`Ver detalles del campus ${campus.name}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5 cursor-pointer block"
                style={{ minHeight: "280px" }}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: img ? `url('${img}')` : undefined,
                    backgroundColor: "#0a1628",
                  }}
                />

                {/* Readable gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/35 to-transparent" />

                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                {/* "Principal" badge */}
                {campus.isMain && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gold text-navy px-3 py-1 rounded-full shadow-xs">
                      Sede Central
                    </span>
                  </div>
                )}

                {/* Content pinned to bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 flex flex-col items-start gap-1">
                  <h3 className="font-display text-white text-3xl sm:text-4xl leading-none uppercase drop-shadow-sm">
                    {campus.name}
                  </h3>
                  <p className="text-white/75 text-xs font-light mb-1">
                    {campus.state}
                  </p>
                  {/* CTA */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:gap-2.5 transition-all duration-200">
                    Ver detalles <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Sección de Campus en Línea y Transmisión en Vivo ── */}
        <div id="transmision" className="mt-20">
          <CampusLiveSection initialStatus={liveStatus} />
        </div>
      </div>
    </div>
  );
}
