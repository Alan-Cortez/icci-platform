"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Mail, MapPin, Phone, User, X, ChevronRight, Instagram, Facebook, Video } from "lucide-react";
import { Button, Card, SectionHeading } from "@/components/ui";
import { SCHEDULES } from "@/lib/constants";

interface CampusClientProps {
  campus: any;
  pastorName: string;
  googleMapsUrl: string;
}

export function CampusClient({ campus, pastorName, googleMapsUrl }: CampusClientProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Schedules that should open a modal
  const INTERACTIVE_SCHEDULES = ["Jóvenes"];

  // Determine pastor details based on name
  let pastorImg = null;
  let pastorColor = "from-navy-light to-navy";
  
  if (pastorName.includes("Oscar") || pastorName.includes("Óscar")) {
    pastorImg = "/images/pastores-sosa.jpg";
    pastorColor = "from-navy to-navy-light";
  }

  // Load TikTok script when modal is Jóvenes
  useEffect(() => {
    if (activeModal === "Jóvenes") {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        // We don't necessarily need to remove it, but it's good practice.
        // However, TikTok's script might leave some global variables.
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [activeModal]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Pastor + Ubicación */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pastor Visual Card */}
          <div 
            className="relative group rounded-3xl overflow-hidden shadow-md border border-gray-100 h-[300px] sm:h-[360px] md:h-[400px] lg:h-[460px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${pastorColor}`}>
              {pastorImg && (
                <img
                  src={pastorImg}
                  alt={pastorName}
                  className="w-full h-full object-cover object-top"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="inline-flex items-center gap-1.5 text-gold text-xs font-bold uppercase tracking-widest mb-3 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                <User className="w-3.5 h-3.5" /> Pastor
              </div>
              <p className="font-black text-white text-2xl leading-none">{pastorName}</p>
            </div>
          </div>

          {/* Ubicación & Contacto */}
          <div className="space-y-6 flex flex-col justify-between">
            <Card className="p-6 flex-1 flex flex-col justify-center">
              <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" /> Ubicación
              </h2>
              <p className="text-gray-700">{campus.address}</p>
              <div>
                <a
                  href={campus.isMain ? googleMapsUrl : `https://maps.google.com/?q=${encodeURIComponent(campus.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold border-2 border-navy text-navy px-5 py-2 rounded-full hover:bg-navy hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Cómo llegar
                </a>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div className="space-y-3">
                  <h2 className="font-bold text-navy text-sm uppercase tracking-wider">Contacto</h2>
                  <div className="flex flex-col gap-2 text-gray-600 text-sm">
                    <a href={`tel:${campus.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-navy transition-colors">
                      <Phone className="w-4 h-4 text-gold" /> {campus.phone}
                    </a>
                    <a href="mailto:contacto@icci.org.mx" className="flex items-center gap-2 hover:text-navy transition-colors">
                      <Mail className="w-4 h-4 text-gold" /> contacto@icci.org.mx
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <Button href="/oracion" size="sm" className="w-full">Solicitar oración</Button>
                  <Button href="/eventos" variant="outline" size="sm" className="w-full">
                    <Calendar className="w-4 h-4 mr-1" /> Eventos
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Schedules (main campus only) */}
        {campus.isMain && (
          <div>
            <SectionHeading subtitle="Horarios" title="Servicios y actividades" centered={false} />
            <div className="grid sm:grid-cols-2 gap-4">
              {SCHEDULES.map((schedule) => {
                const isInteractive = INTERACTIVE_SCHEDULES.includes(schedule.title);
                
                return (
                  <Card 
                    key={schedule.title + schedule.days} 
                    className={`p-4 flex items-center justify-between gap-4 ${isInteractive ? 'cursor-pointer hover:border-gold/40 hover:shadow-md transition-all duration-300' : ''}`}
                    onClick={() => isInteractive && setActiveModal(schedule.title)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isInteractive ? 'bg-gold text-navy' : 'bg-gold/10 text-gold'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-navy">{schedule.title}</p>
                        <p className="text-sm text-gray-500">{schedule.days} · {schedule.time}</p>
                      </div>
                    </div>
                    {isInteractive && (
                      <ChevronRight className="w-5 h-5 text-gray-300 mr-2" />
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal for Interactive Schedules */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(5,12,28,0.8)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-[2rem] flex flex-col md:flex-row shadow-2xl overflow-hidden relative"
            style={{ maxHeight: "90vh", animation: "modalIn .4s cubic-bezier(.16,1,.3,1) both" }}
          >
            {/* Close Button (Floating) */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 hover:text-black transition-all duration-200 backdrop-blur-md"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "Jóvenes" ? (
              <>
                {/* ── Left Side: Hero Image & Overlay ────────────────── */}
                <div className="w-full md:w-2/5 relative min-h-[250px] md:min-h-full shrink-0">
                  <img 
                    src="/images/jovenes.jpg" 
                    alt="Jóvenes Con Todo" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2">Ministerio</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
                      Jóvenes<br/>Con Todo
                    </h3>
                    <div className="flex gap-3">
                      <a
                        href="https://www.instagram.com/jovenescontodoicc?igsh=azk1NzducHQydzFi"
                        target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.facebook.com/share/14jAxX7pjUE/"
                        target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* ── Right Side: Content Scrollable ────────────────── */}
                <div className="w-full md:w-3/5 overflow-y-auto p-8 md:p-12 scrollbar-hide bg-off-white">
                  
                  <div className="max-w-xl space-y-10">
                    {/* Intro */}
                    <div>
                      <h4 className="text-2xl font-bold text-navy mb-4">Nuestra Visión</h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Somos una generación apasionada por Dios, listos para marcar la diferencia en nuestra ciudad y nuestro entorno. Creemos en el potencial de cada joven para transformar su mundo cuando su identidad está fundamentada en Cristo.
                      </p>
                    </div>

                    {/* Liderazgo */}
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Liderazgo</h4>
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-navy" />
                        </div>
                        <div>
                          <p className="font-bold text-navy text-lg">Omar y Jacqueline Laborico</p>
                          <p className="text-sm text-gold font-semibold mb-2">Pastores de Jóvenes</p>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Contamos con un equipo de líderes apasionados por guiar a cada joven a su máximo potencial, creando una atmósfera de amistad, respeto y crecimiento espiritual.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TikTok embed */}
                    <div>
                       <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Lo más reciente</h4>
                       <div className="w-full flex justify-center bg-white rounded-2xl overflow-hidden min-h-[400px] border border-gray-100 shadow-sm">
                        <blockquote
                          className="tiktok-embed w-full m-0"
                          cite="https://www.tiktok.com/@jovenes.con.todo"
                          data-unique-id="jovenes.con.todo"
                          data-embed-type="creator"
                          style={{ maxWidth: "100%", minWidth: "288px" }}
                        >
                          <section>
                            <a target="_blank" href="https://www.tiktok.com/@jovenes.con.todo?refer=creator_embed" rel="noreferrer">
                              @jovenes.con.todo
                            </a>
                          </section>
                        </blockquote>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center w-full">
                <p className="text-gray-500 leading-relaxed text-lg">
                  La información detallada sobre <span className="font-semibold text-navy">{activeModal}</span> estará disponible próximamente.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
