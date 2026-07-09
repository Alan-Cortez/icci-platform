import { Play } from "lucide-react";
import Script from "next/script";
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
                Ver predicaciones
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

      {/* ── Conectar + Testimonios ── */}
      <HomeSections />

      {/* ── TikTok Embed ── */}
      <section className="bg-off-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <p className="label-eyebrow mb-3">Síguenos en TikTok</p>
          <div className="divider-gold mx-auto mb-10" />
          
          <blockquote 
            className="tiktok-embed" 
            cite="https://www.tiktok.com/@iglesiacomunidaddecristo" 
            data-unique-id="iglesiacomunidaddecristo" 
            data-embed-type="creator" 
            style={{ maxWidth: "780px", minWidth: "288px" }} 
          > 
            <section> 
              <a target="_blank" href="https://www.tiktok.com/@iglesiacomunidaddecristo?refer=creator_embed" rel="noreferrer">
                @iglesiacomunidaddecristo
              </a> 
            </section> 
          </blockquote> 
          <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
        </div>
      </section>
    </>
  );
}
