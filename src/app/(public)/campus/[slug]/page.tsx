import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import { Button, Card, SectionHeading } from "@/components/ui";
import { CAMPUSES, SCHEDULES } from "@/lib/constants";

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
              style={{ backgroundImage: "url('/campus-allende.jpg')" }}
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
            {campus.state} · {campus.location ?? "Allende, Coahuila"}
          </p>
          <p className="text-white/70 mt-4 max-w-2xl leading-relaxed font-light">
            {campus.description}
          </p>
        </div>
      </section>

      {/* ── Info cards ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Pastor + Ubicación */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pastor */}
          <Card className="p-6">
            <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" /> Pastor
            </h2>
            <p className="text-gray-700 font-medium">{pastorName}</p>
          </Card>

          {/* Ubicación → Google Maps */}
          <Card className="p-6">
            <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" /> Ubicación
            </h2>
            <p className="text-gray-700">{campus.address}</p>
            <a
              href={campus.isMain ? GOOGLE_MAPS_URL : `https://maps.google.com/?q=${encodeURIComponent(campus.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-semibold border-2 border-navy text-navy px-4 py-2 rounded-full hover:bg-navy hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Cómo llegar
            </a>
          </Card>
        </div>

        {/* Schedules (main campus only) */}
        {campus.isMain && (
          <div>
            <SectionHeading subtitle="Horarios" title="Servicios y actividades" centered={false} />
            <div className="grid sm:grid-cols-2 gap-4">
              {SCHEDULES.map((schedule) => (
                <Card key={schedule.title + schedule.days} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{schedule.title}</p>
                    <p className="text-sm text-gray-500">{schedule.days} · {schedule.time}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <Card className="p-6">
          <h2 className="font-bold text-navy text-lg mb-4">Contacto del campus</h2>
          <div className="flex flex-wrap gap-6 text-gray-700">
            <a
              href={`tel:${campus.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-navy"
            >
              <Phone className="w-4 h-4 text-gold" /> {campus.phone}
            </a>
            <a
              href="mailto:contacto@icci.org.mx"
              className="flex items-center gap-2 hover:text-navy"
            >
              <Mail className="w-4 h-4 text-gold" /> contacto@icci.org.mx
            </a>
          </div>
          <div className="flex gap-4 mt-6">
            <Button href="/oracion" size="sm">Solicitar oración</Button>
            <Button href="/eventos" variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-1" /> Ver eventos
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
