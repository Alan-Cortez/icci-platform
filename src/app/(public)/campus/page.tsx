import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { CAMPUSES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Campus",
  description: "Ubicaciones de ICCI en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango.",
};
export const revalidate = 0;

// Map each campus id to its background image
const CAMPUS_IMAGES: Record<string, string> = {
  allende:    "/images/campus-allende.jpg",
  sabinas:    "/images/campus-sabinas.jpg",
  muzquiz:    "/images/campus-muzquiz.jpg",
  barroteran: "/images/campus-barroteran.jpg",
  anahuac:    "/images/campus-anahuac.jpg",
  durango:    "/images/campus-durango.jpg",
};

export default async function CampusListPage() {
  const allCampuses = [...CAMPUSES].sort((a, b) => (a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1));

  return (
    <div className="py-16 bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          subtitle="Ubicaciones"
          title="Nuestros Campus"
          description="Encuentra el campus ICCI más cercano a ti."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCampuses.map((campus) => {
            const img = (campus as any).image || CAMPUS_IMAGES[campus.name.toLowerCase()] || CAMPUS_IMAGES.allende;
            return (
              <Link
                key={campus.id}
                href={`/campus/${campus.id}`}
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

                {/* Gradient overlay — dark at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-navy/10" />

                {/* "Principal" badge */}
                {campus.isMain && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gold text-navy px-3 py-1 rounded-full">
                      Principal
                    </span>
                  </div>
                )}

                {/* Content pinned to bottom */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  {/* Location pill */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span className="text-gold text-xs font-semibold tracking-wide">
                      {campus.state}
                    </span>
                  </div>

                  {/* Name */}
                  <h3
                    className="font-display text-white leading-none uppercase mb-1"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
                  >
                    {campus.name}
                  </h3>

                  {/* Address */}
                  <p className="text-white/60 text-xs font-light leading-snug mb-4 line-clamp-1">
                    {campus.address}
                  </p>

                  {/* CTA */}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold group-hover:gap-2.5 transition-all duration-200">
                    Ver detalles <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
