import type { Metadata } from "next";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Eventos" };

const events = [
  {
    id: "event-001",
    title: "Conferencia de Avivamiento",
    description: "Tres días de adoración, enseñanza y renovación espiritual para toda la familia.",
    date: "Próximamente",
    time: "7:00 PM",
    location: "Auditorio Principal - Allende",
    campus: "Allende",
    capacity: 500,
    featured: true,
  },
];

export default function EventosPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Actividades"
          title="Eventos"
          description="Conferencias, retiros y actividades especiales en todos nuestros campus."
        />
        <div className="space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="grid lg:grid-cols-3">
                <div className="bg-navy-light h-48 lg:h-auto flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-gold/30" />
                </div>
                <div className="lg:col-span-2 p-8">
                  <div className="flex items-center gap-2 mb-3">
                    {event.featured && <Badge variant="gold">Destacado</Badge>}
                    <Badge variant="navy">{event.campus}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-navy">{event.title}</h3>
                  <p className="text-gray-600 mt-2 leading-relaxed">{event.description}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Cupo: {event.capacity}</span>
                  </div>
                  <Button className="mt-6" size="sm">Registrarme</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/calendario" variant="outline">Ver calendario completo</Button>
        </div>
      </div>
    </div>
  );
}
