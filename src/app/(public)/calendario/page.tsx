import type { Metadata } from "next";
import { Calendar, Clock, MapPin, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";
import { SCHEDULES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Calendario – ICCI",
  description: "Horarios y eventos de Iglesias Comunidad De Cristo Internacional.",
};

const upcomingEvents = [
  {
    id: "e1",
    title: "Conferencia de Avivamiento",
    date: "Próximamente",
    time: "7:00 PM",
    location: "Auditorio Principal – Allende",
    campus: "Allende",
    category: "Conferencia",
    featured: true,
  },
  {
    id: "e2",
    title: "Retiro de Jóvenes",
    date: "Próximamente",
    time: "Todo el día",
    location: "Allende, Coahuila",
    campus: "Allende",
    category: "Retiro",
    featured: false,
  },
  {
    id: "e3",
    title: "Evangelización último domingo",
    date: "Último domingo del mes",
    time: "7:00 PM",
    location: "Comunidad local",
    campus: "Todos los campus",
    category: "Evangelismo",
    featured: false,
  },
];

const dayOrder = ["Lunes a viernes", "Miércoles", "Jueves", "Último viernes de cada mes", "Sábado", "Domingo", "Último domingo del mes"];

const categoryColors: Record<string, string> = {
  Conferencia: "bg-purple-100 text-purple-700",
  Retiro: "bg-blue-100 text-blue-700",
  Evangelismo: "bg-green-100 text-green-700",
};

export default function CalendarioPage() {
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
                  <div className="bg-navy sm:w-24 flex items-center justify-center p-4 sm:flex-col gap-1 shrink-0">
                    <Calendar className="w-6 h-6 text-gold" />
                    <span className="text-white/60 text-xs text-center">{event.date.split(" ")[0]}</span>
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
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{event.time}</span>
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
          </div>

          <div className="text-center mt-10">
            <Button href="/eventos">Ver todos los eventos</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
