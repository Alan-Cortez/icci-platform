import Link from "next/link";
import { Play, Calendar, MapPin, Clock, ChevronRight, ExternalLink, Sparkles } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { HomeSections } from "@/components/layout/HomeSections";
import { WeeklySchedule } from "@/components/layout/WeeklySchedule";
import { getFeaturedTestimonies } from "@/actions/testimonies";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

function formatEventDate(ts: number | Date | null): string {
  if (!ts) return "";
  const d = new Date(ts).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export default async function HomePage() {
  const [featuredTestimonies, allEvents] = await Promise.all([
    getFeaturedTestimonies(),
    db.select().from(events).orderBy(desc(events.featured), asc(events.startDate)),
  ]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcomingEvent = allEvents.find((e) => new Date(e.startDate) >= now) || allEvents[0] || null;

  return (
    <>
      <HeroVideo />

      {/* ── Próximo Evento Destacado (si existe) ── */}
      {upcomingEvent && (
        <section className="bg-navy-light/95 border-y border-gold/20 py-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_60%)]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-gradient-to-br from-navy via-navy to-[#081324] rounded-3xl border border-gold/30 p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              
              {/* Event poster image if available */}
              {upcomingEvent.image && (
                <div className="w-full lg:w-2/5 shrink-0 rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-[4/3] bg-navy-muted shadow-lg border border-white/10 group">
                  <img
                    src={upcomingEvent.image}
                    alt={upcomingEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Event Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-gold text-navy shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Próximo Evento Especial
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/15">
                    {upcomingEvent.category}
                  </span>
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight leading-none">
                  {upcomingEvent.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gold pt-1">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-gold shrink-0" />
                    <span>{formatEventDate(upcomingEvent.startDate)}</span>
                  </div>
                  {upcomingEvent.timeStr && (
                    <div className="flex items-center gap-1.5 text-white/80 font-medium">
                      <Clock className="w-4 h-4 text-gold shrink-0" />
                      <span>{upcomingEvent.timeStr}</span>
                    </div>
                  )}
                  {upcomingEvent.location && (
                    <div className="flex items-center gap-1.5 text-white/70">
                      <MapPin className="w-4 h-4 text-gold shrink-0" />
                      <span>{upcomingEvent.location}</span>
                    </div>
                  )}
                </div>

                <p className="text-white/70 text-sm leading-relaxed line-clamp-3 font-light max-w-2xl pt-2">
                  {upcomingEvent.description}
                </p>

                <div className="pt-3 flex flex-wrap gap-3">
                  <Link
                    href="/eventos"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy text-sm font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Ver detalles del evento <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/calendario"
                    className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-white/10 transition-colors"
                  >
                    Ver calendario completo
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ── Programa Semanal ── */}
      <WeeklySchedule />

      {/* ── Servicio en Vivo de YouTube & Predicaciones ── */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.08),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Info & Live Schedule */}
            <div>
              {/* Live streaming status badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                TRANSMISIÓN EN VIVO · ICCTV
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight uppercase tracking-tight mb-4">
                Conéctate al <span className="text-gold">Servicio en Vivo</span>
              </h2>

              <p className="font-serif text-serif-lg text-white/80 italic font-light mb-4">
                Todos los domingos a las 10:00 AM y servicios especiales
              </p>

              <p className="text-white/60 leading-relaxed mb-8 font-light max-w-lg text-sm sm:text-base">
                Si no puedes acompañarnos de forma presencial en Allende o nuestros campus, únete a la transmisión en directo con alabanza, mensaje de la Palabra y oración a través de nuestro canal oficial de YouTube.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  href="https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  className="font-bold flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Ir al canal de YouTube
                  <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                </Button>
                <Link
                  href="/campus"
                  className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white hover:text-navy px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
                >
                  Asistir en persona
                </Link>
              </div>
            </div>

            {/* Right Column: YouTube Stream Player Embed */}
            <div>
              <div className="aspect-video rounded-3xl bg-navy-light overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/MuLpLancL80?autoplay=0&rel=0"
                  title="ICCI Transmisión y Predicación Destacada"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <p className="text-center text-xs text-white/40 mt-3 font-light">
                Canal oficial: <strong>@icctv-101</strong> · Suscríbete y activa la campana para notificaciones
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Conectar + Testimonios ── */}
      <HomeSections featuredTestimonies={featuredTestimonies} />
    </>
  );
}
