import { Play } from "lucide-react";
import { Button } from "@/components/ui";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { HomeSections } from "@/components/layout/HomeSections";
import { WeeklySchedule } from "@/components/layout/WeeklySchedule";
import { getFeaturedTestimonies } from "@/actions/testimonies";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

export default async function HomePage() {
  const [featuredTestimonies, allEvents] = await Promise.all([
    getFeaturedTestimonies(),
    db.select().from(events).orderBy(desc(events.featured), asc(events.startDate)),
  ]);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // 1. Filtrar eventos activos (cuya fecha de inicio o fin sea hoy o en el futuro)
  const activeEvents = allEvents.filter((e) => {
    const end = e.endDate ? new Date(e.endDate) : new Date(e.startDate);
    end.setHours(23, 59, 59, 999);
    return end >= now;
  });

  // 2. Eventos del mes en curso
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthEvents = activeEvents.filter((e) => {
    const d = new Date(e.startDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // 3. Eventos marcados como destacados (featured)
  const featuredEvents = activeEvents.filter((e) => Boolean(e.featured));

  // 4. Combinar: Primero las destacadas, luego los eventos del mes, o el próximo evento activo
  const eventsMap = new Map<string, any>();
  featuredEvents.forEach((e) => eventsMap.set(e.id, e));
  monthEvents.forEach((e) => eventsMap.set(e.id, e));
  
  // Si no hay del mes ni destacadas, pero sí hay un próximo evento en los siguientes 60 días
  if (eventsMap.size === 0 && activeEvents.length > 0) {
    eventsMap.set(activeEvents[0].id, activeEvents[0]);
  }

  // Lista final: si no hay eventos activos futuros, queda vacía [] ("si no hay pues nada")
  const upcomingEvents = Array.from(eventsMap.values());

  return (
    <>
      {/* ── 1. Hero Principal (Oscuro) ── */}
      <HeroVideo />

      {/* ── 2. Programa Semanal + Eventos del Mes / Destacadas (Claro: bg-off-white) ── */}
      <WeeklySchedule events={upcomingEvents} />

      {/* ── 3. Predicación Destacada (Oscuro: bg-navy) ── */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label-eyebrow mb-3">Predicación destacada</p>
              <div className="divider-gold mb-5" />
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[3.25rem] text-white leading-none mb-3">
                La Aguja Que
                <span className="block text-gold">Desinfla Mi Ego</span>
              </h2>
              <p className="font-serif text-serif-lg text-white/60 italic font-light mb-4">
                Compartiendo con · Pastor Oscar Sosa (Parte 2)
              </p>
              <p className="text-white/55 leading-relaxed mb-8 font-light max-w-md">
                Escucha esta edificante y honesta conversación en el podcast de Producciones Buenas Nuevas Internacional junto al Pastor Oscar Sosa.
              </p>
              <Button href="https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu" target="_blank" variant="secondary" className="group">
                <Play className="w-4 h-4 mr-2" />
                Ver predicaciones en YouTube
              </Button>
            </div>
            <div className="aspect-video rounded-2xl bg-navy-light overflow-hidden border border-white/10 shadow-2xl relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/MuLpLancL80?autoplay=0&rel=0"
                title="Predicación destacada: Fe Que Mueve Montañas"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Conectar con Jesús (Claro) + 5. Testimonios (Oscuro) ── */}
      <HomeSections featuredTestimonies={featuredTestimonies} />
    </>
  );
}
