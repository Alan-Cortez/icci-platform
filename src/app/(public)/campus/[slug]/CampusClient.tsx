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
  const INTERACTIVE_SCHEDULES = ["Jóvenes", "Varones", "Servicio femenil"];

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
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
          style={{ background: "rgba(5,12,28,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl flex flex-col shadow-2xl overflow-hidden"
            style={{ maxHeight: "92vh", animation: "modalIn .25s cubic-bezier(.34,1.56,.64,1) both" }}
          >

            {/* ── Header con gradiente ───────────────────────────── */}
            <div className="relative bg-gradient-to-br from-navy via-navy-muted to-navy-light px-8 pt-8 pb-10 shrink-0 overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              {/* Botón cerrar */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 backdrop-blur-sm border border-white/10"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-gold text-[11px] font-bold uppercase tracking-[0.22em] mb-2">Más información</p>
              <h3 className="text-4xl font-black text-white tracking-tight leading-none mb-1">{activeModal}</h3>
              <div className="mt-4 w-10 h-0.5 bg-gold rounded-full" />
            </div>

            {/* ── Cuerpo scrollable ─────────────────────────────── */}
            <div className="overflow-y-auto flex-1 px-8 py-7 space-y-7 scrollbar-hide">

              {activeModal === "Jóvenes" ? (
                <>
                  {/* Intro */}
                  <p className="text-gray-600 text-[15px] leading-relaxed">
                    ¡Bienvenidos a la red de <span className="font-semibold text-navy">Jóvenes Con Todo</span>! Somos una generación apasionada por Dios, listos para marcar la diferencia en nuestra ciudad y nuestro entorno.
                  </p>

                  {/* Liderazgo */}
                  <div className="bg-gradient-to-br from-gray-50 to-off-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center">
                        <User className="w-4 h-4 text-gold" />
                      </div>
                      <h4 className="font-bold text-navy text-base tracking-tight">Liderazgo</h4>
                    </div>
                    <div className="pl-10 space-y-2">
                      <p className="text-sm font-semibold text-navy">Pastores de Jóvenes</p>
                      <p className="text-sm text-gray-700 font-medium">Omar y Jacqueline Laborico</p>
                      <p className="text-sm text-gray-500 leading-relaxed pt-1 border-t border-gray-100 mt-2">
                        Contamos con un equipo de líderes apasionados por guiar a cada joven a su máximo potencial en Cristo, creando una atmósfera de amistad, respeto y crecimiento espiritual.
                      </p>
                    </div>
                  </div>

                  {/* Redes sociales */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">Síguenos en nuestras redes</p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://www.instagram.com/jovenescontodoicc?igsh=azk1NzducHQydzFi"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        style={{ background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)" }}
                      >
                        <Instagram className="w-4 h-4" /> Instagram
                      </a>
                      <a
                        href="https://www.facebook.com/share/14jAxX7pjUE/"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 bg-[#1877F2] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0d6fd8] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <Facebook className="w-4 h-4" /> Facebook
                      </a>
                    </div>
                  </div>

                  {/* Divisor */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Media */}
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center">
                          <Video className="w-4 h-4 text-gold" />
                        </div>
                        <h4 className="font-bold text-navy text-base tracking-tight">Lo más reciente</h4>
                      </div>
                      <p className="text-sm text-gray-500 mb-4 pl-10">
                        Conoce lo que vivimos cada fin de semana en nuestras reuniones.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pl-10">
                        <img
                          src="/images/jovenes.jpg"
                          alt="Jóvenes"
                          className="rounded-xl w-full h-28 object-cover shadow-sm"
                        />
                        <div className="rounded-xl w-full h-28 bg-gradient-to-br from-navy-muted to-navy flex items-center justify-center">
                          <span className="text-gold/50 text-[11px] text-center px-3 leading-relaxed">Más fotos próximamente</span>
                        </div>
                      </div>
                    </div>

                    {/* TikTok embed */}
                    <div className="w-full flex justify-center bg-gray-50 rounded-2xl overflow-hidden min-h-[360px] border border-gray-100">
                      <blockquote
                        className="tiktok-embed w-full m-0"
                        cite="https://www.tiktok.com/@jovenes.con.todo"
                        data-unique-id="jovenes.con.todo"
                        data-embed-type="creator"
                        style={{ maxWidth: "780px", minWidth: "288px" }}
                      >
                        <section>
                          <a target="_blank" href="https://www.tiktok.com/@jovenes.con.todo?refer=creator_embed" rel="noreferrer">
                            @jovenes.con.todo
                          </a>
                        </section>
                      </blockquote>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 leading-relaxed text-[15px]">
                  La información detallada sobre <span className="font-semibold text-navy">{activeModal}</span> estará disponible próximamente.
                </p>
              )}
            </div>

            {/* ── Footer ────────────────────────────────────────── */}
            <div className="px-8 py-5 border-t border-gray-100 shrink-0 bg-white">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-navy hover:bg-navy-light text-white font-semibold text-sm py-3.5 rounded-2xl transition-all duration-200 hover:shadow-lg tracking-wide"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
