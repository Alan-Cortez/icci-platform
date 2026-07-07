import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { Button, Card, SectionHeading } from "@/components/ui";
import { SCHEDULES, CAMPUSES } from "@/lib/constants";
import { CampusClient } from "./CampusClient";

// Google Maps link for the real address
const GOOGLE_MAPS_URL =
  "https://maps.google.com/?q=Calle+Benito+Ju%C3%A1rez+%231705+Norte,+Allende,+Coahuila,+M%C3%A9xico";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CAMPUSES.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campus = CAMPUSES.find((c) => c.id === slug);
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
  const campus = CAMPUSES.find((c) => c.id === slug);
  if (!campus) notFound();

  // For the main campus use the real church name and photo header
  const displayName = campus.isMain
    ? "Iglesias Comunidad de Cristo Internacional"
    : `Campus ${campus.name}`;

  const pastorName = campus.isMain
    ? "Pastores Óscar y Raquel Sosa"
    : campus.pastor;

  return (
    <div>
      {/* ── Hero header ── */}
      <section className="relative overflow-hidden min-h-[260px] flex items-end">
        {/* Background: photo if main, navy otherwise */}
        {campus.isMain ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-navy"
              style={{ backgroundImage: (campus as any).image ? `url('${(campus as any).image}')` : "url('/images/campus-allende.jpg')" }}
            />
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-navy" />
        )}

        {/* Text */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {campus.isMain && (
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-gold border border-gold/40 px-3 py-1 rounded-full mb-4">
              Campus Principal
            </span>
          )}
          <h1 className="font-display text-white leading-none uppercase"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {displayName}
          </h1>
          <p className="font-serif text-white/60 italic font-light mt-2 text-lg">
            {campus.state}
          </p>
          <p className="text-white/70 mt-4 max-w-2xl leading-relaxed font-light">
            {campus.description}
          </p>
        </div>
      </section>

      {/* ── Info cards (Interactive) ── */}
      <CampusClient campus={campus} pastorName={pastorName} googleMapsUrl={GOOGLE_MAPS_URL} />
    </div>
  );
}
