import { Play } from "lucide-react";
import { Button } from "@/components/ui";
import { HeroVideo } from "@/components/layout/HeroVideo";
import { HomeSections } from "@/components/layout/HomeSections";
import { WeeklySchedule } from "@/components/layout/WeeklySchedule";

export default function HomePage() {
  return (
    <>
      <HeroVideo />


      {/* ── Programa Semanal ── */}
      <WeeklySchedule />

      {/* ── Predicación destacada ── */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label-eyebrow mb-3">Predicación destacada</p>
              <div className="divider-gold mb-5" />
              <h2 className="font-display text-display text-white leading-none mb-3">
                Fe Que Mueve
                <span className="block text-gold">Montañas</span>
              </h2>
              <p className="font-serif text-serif-lg text-white/60 italic font-light mb-4">
                Serie de Fe · Pastor Principal
              </p>
              <p className="text-white/55 leading-relaxed mb-8 font-light max-w-md">
                Descubre cómo una fe genuina puede transformar cada área de tu vida y abrir
                caminos donde parecía no haberlos.
              </p>
              <Button href="https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu" target="_blank" variant="secondary" className="group">
                <Play className="w-4 h-4 mr-2" />
                Ver predicaciones
              </Button>
            </div>
            <div className="aspect-video rounded-2xl bg-navy-light overflow-hidden border border-white/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 text-navy ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Conectar + Testimonios ── */}
      <HomeSections />
    </>
  );
}
