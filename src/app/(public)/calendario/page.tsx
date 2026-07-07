import type { Metadata } from "next";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";
import { SCHEDULES } from "@/lib/constants";
import { db } from "@/db";
import { events } from "@/db/schema";
import { gte } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Calendario – ICCI",
  description: "Horarios y eventos de Iglesias Comunidad De Cristo Internacional.",
};

// Removed hardcoded events

const dayOrder = ["Lunes a viernes", "Miércoles", "Jueves", "Último viernes de cada mes", "Sábado", "Domingo", "Último domingo del mes"];

const categoryColors: Record<string, string> = {
  Conferencia: "bg-purple-100 text-purple-700",
  Retiro: "bg-blue-100 text-blue-700",
  Evangelismo: "bg-green-100 text-green-700",
};

export const revalidate = 0; // Ensure fresh events

export default async function CalendarioPage() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // start of today
  
  // Fetch events from DB that have a startDate >= today (or just all events if we want to show past as well, but usually calendar shows upcoming)
  // Let's just fetch all and sort them by startDate ascending. Or fetch only upcoming:
  const dbEvents = await db.select().from(events).orderBy(events.startDate);
  
  // Filter for upcoming (events where startDate or endDate is >= today)
  // If startDate is null, we can still show them at the end, or filter them out if they don't have dates.
  const upcomingEvents = dbEvents.filter(e => {
    if (!e.startDate) return true; // Show those without dates just in case
    const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
    return end >= now;
  }).slice(0, 10); // Show max 10 upcoming events here
  
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Planifica tu semana"
          title="Calendario"
          description="Encuentra los horarios regulares y los próximos eventos especiales de ICCI."
        />

        {/* Weekly schedule */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-gold" />
            Horarios semanales
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEDULES.map((s) => (
              <div
                key={s.title + s.days}
                className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-100 hover:border-gold/40 hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-full" />
                <Calendar className="w-5 h-5 text-gold mb-3" />
                <h3 className="font-bold text-navy">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{s.days}</p>
                <p className="text-gold font-semibold mt-2">{s.time}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            * Horarios del campus Allende (principal). Puede variar por campus.{" "}
            <Link href="/campus" className="text-gold hover:underline">
              Ver campus →
            </Link>
          </p>
        </section>

        {/* Upcoming events */}
        <section>
          <h2 className="text-2xl font-bold text-navy mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gold" />
            Próximos eventos
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="bg-navy sm:w-28 flex items-center justify-center p-4 sm:flex-col gap-1 shrink-0 text-center">
                    <Calendar className="w-6 h-6 text-gold mb-1" />
                    {event.startDate ? (
                      <span className="text-white/80 text-xs font-semibold uppercase leading-tight">
                        {new Date(event.startDate).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}
                        {event.endDate && event.endDate !== event.startDate && (
                          <> - <br/> {new Date(event.endDate).toLocaleDateString("es-MX", { month: "short", day: "numeric" })}</>
                        )}
                      </span>
                    ) : (
                      <span className="text-white/60 text-xs text-center">{event.dateStr}</span>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {event.featured && <Badge variant="gold">Destacado</Badge>}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColors[event.category] ?? "bg-gray-100 text-gray-700"}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-navy text-lg">{event.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.dateStr}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{event.timeStr}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.campus}</span>
                    </div>
                  </div>
                  <div className="p-6 flex items-center shrink-0">
                    <Link
                      href="/eventos"
                      className="flex items-center gap-1 text-gold text-sm font-medium hover:underline"
                    >
                      Ver más <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay eventos próximos agendados por el momento.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Button href="/eventos">Ver todos los eventos</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
