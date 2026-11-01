"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  X,
  Instagram,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui";

interface CampusClientProps {
  campus: any;
  pastorName: string;
  googleMapsUrl: string;
}

// ─── 6 Servicios y Actividades organizados de forma equilibrada ──────────────
const CAMPUS_SERVICES = [
  {
    day: "Lunes a viernes",
    time: "9:00 AM - 10:00 AM",
    title: "Servicio de Oración",
    category: "Oración Matutina",
    description: "Comenzando el día en la presencia de Dios a través de la oración comunitaria e intercesión.",
  },
  {
    day: "Miércoles",
    time: "7:00 PM",
    title: "Servicio Femenil",
    category: "Ministerio de Mujeres",
    description: "Un espacio de edificación, amistad y crecimiento espiritual diseñado especialmente para mujeres.",
  },
  {
    day: "Jueves",
    time: "7:00 PM",
    title: "Servicio General",
    category: "Adoración & Palabra",
    description: "Reunión de mitad de semana con tiempo de alabanza, estudio de la Palabra y refrigerio espiritual.",
  },
  {
    day: "Sábado",
    time: "7:00 PM",
    title: "Jóvenes Con Todo",
    category: "Ministerio Juvenil · 11 años en adelante",
    description: "Una generación apasionada por Dios. Alabanza dinámica, mensajes relevantes y una gran comunidad.",
    isInteractive: true,
  },
  {
    day: "Sábado",
    time: "7:00 PM",
    title: "Ministerio de Varones",
    category: "Hombres de Fe",
    description: "Hombres unidos para fortalecer su fe y crecer como líderes espirituales en su hogar, trabajo e iglesia.",
  },
  {
    day: "Citas Mensuales",
    time: "7:00 PM",
    title: "Vigilia & Evangelización",
    category: "Reuniones de Impacto",
    description: "Vigilia de oración el último viernes de cada mes y jornada de evangelización el último domingo.",
  },
];

export function CampusClient({ campus, pastorName, googleMapsUrl }: CampusClientProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  let pastorImg = null;
  if (pastorName.includes("Oscar") || pastorName.includes("Óscar")) {
    pastorImg = "/images/pastores-sosa.jpg";
  }

  const isMain = campus.isMain;
  const mapsHref = isMain
    ? googleMapsUrl
    : `https://maps.google.com/?q=${encodeURIComponent(campus.address)}`;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-16">

        {/* ═══════════════════════════════════════════════════════════════════
            1. SECCIÓN SUPERIOR: LIDERAZGO PASTORAL + HUB DE INFORMACIÓN
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ── Col 1: Tarjeta Visual de Pastores (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex-1 min-h-[380px] sm:min-h-[440px] bg-navy">
              {pastorImg ? (
                <img
                  src={pastorImg}
                  alt={pastorName}
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
              )}

              {/* Degradado para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

              {/* Contenido inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2 z-10">
                <span className="inline-block text-gold text-[11px] font-bold uppercase tracking-widest bg-navy/80 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-gold/30">
                  {isMain ? "Pastores Principales" : "Liderazgo Pastoral"}
                </span>
                <h2 className="font-display text-white text-2xl sm:text-3xl font-bold leading-tight">
                  {pastorName}
                </h2>
                <p className="text-white/75 text-xs sm:text-sm font-light leading-relaxed">
                  {isMain
                    ? "Guiando a la familia de Iglesias Comunidad de Cristo Internacional con visión, fe y amor."
                    : `Pastoreando con dedicación la congregación de Campus ${campus.name}.`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Col 2: Hub Ejecutivo de Ubicación y Contacto (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 p-6 sm:p-8 lg:p-10 flex-1 flex flex-col justify-between">
              
              {/* Encabezado */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full border border-gold/20">
                    {isMain ? "Sede Central · Allende, Coah." : `Campus ${campus.name}`}
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl text-navy font-bold leading-tight">
                  Visítanos y Conéctate
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light">
                  {campus.description || "Nuestras puertas están abiertas para recibirte a ti y a tu familia en cada uno de nuestros servicios y actividades."}
                </p>
              </div>

              {/* Tarjeta de Ubicación con botón de Google Maps */}
              <div className="my-5 p-5 rounded-2xl bg-off-white border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Dirección del Campus
                    </p>
                    <p className="font-bold text-navy text-sm sm:text-base mt-0.5 leading-snug">
                      {campus.address}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {campus.state ? `${campus.name}, ${campus.state}, México` : "Coahuila, México"}
                    </p>
                  </div>
                </div>

                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-xs hover:shadow-md shrink-0"
                >
                  Cómo llegar
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Canales de Contacto Directo */}
              <div className="grid sm:grid-cols-2 gap-3.5 mb-5">
                <a
                  href={`tel:${campus.phone.replace(/\s/g, "")}`}
                  className="p-3.5 rounded-2xl bg-off-white/70 hover:bg-off-white border border-gray-100 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy/5 group-hover:bg-navy flex items-center justify-center shrink-0 transition-colors text-navy">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Teléfono</p>
                    <p className="text-sm font-bold text-navy truncate group-hover:text-gold-dark transition-colors">
                      {campus.phone}
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:contacto@icci.org.mx"
                  className="p-3.5 rounded-2xl bg-off-white/70 hover:bg-off-white border border-gray-100 transition-colors flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-navy/5 group-hover:bg-navy flex items-center justify-center shrink-0 transition-colors text-navy">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Correo</p>
                    <p className="text-sm font-bold text-navy truncate group-hover:text-gold-dark transition-colors">
                      contacto@icci.org.mx
                    </p>
                  </div>
                </a>
              </div>

              {/* Botones de Acción Rápida */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <Button href="/oracion" variant="primary" className="font-bold flex-1 sm:flex-initial text-sm">
                  Solicitar oración
                </Button>
                <Button href="/eventos" variant="outline" className="font-semibold flex-1 sm:flex-initial text-sm">
                  Próximos eventos
                </Button>
              </div>

            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            2. SECCIÓN DE HORARIOS Y ACTIVIDADES (Campus Principal)
            ═══════════════════════════════════════════════════════════════════ */}
        {isMain ? (
          <div className="space-y-8">
            
            {/* Encabezado de la sección */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <p className="label-eyebrow">Horarios y Citas Semanales</p>
              <div className="divider-gold mx-auto" />
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy uppercase tracking-tight">
                Servicios y Actividades
              </h2>
              <p className="text-gray-500 text-sm sm:text-base font-light">
                Cada servicio está diseñado para una etapa y necesidad específica. ¡Hay un lugar esperando por ti!
              </p>
            </div>

            {/* ── Spotlight: Celebración Dominical Principal ── */}
            <div className="rounded-3xl bg-navy border border-gold/30 shadow-xl p-6 sm:p-8 text-white relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                
                {/* Lado izquierdo: Info del servicio dominical */}
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-navy">
                    Reunión Principal de la Familia ICCI
                  </span>

                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white font-bold leading-tight">
                    Celebración Dominical General
                  </h3>

                  <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                    Nuestra mayor fiesta semanal con alabanza en vivo, mensaje bíblico edificante para toda la familia y atención especializada para niños.
                  </p>
                </div>

                {/* Lado derecho: Horario y CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0 w-full lg:w-auto">
                  <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/15 text-left lg:text-right w-full sm:w-auto">
                    <p className="text-[10px] uppercase tracking-wider text-gold font-bold">Cada Domingo</p>
                    <p className="font-display text-2xl sm:text-3xl font-black text-white">10:00 AM</p>
                    <p className="text-xs text-white/60">Hora del Centro</p>
                  </div>

                  <Link
                    href="/campus#campus-online"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-md w-full sm:w-auto justify-center"
                  >
                    Ver opción en vivo <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

            {/* ── Grilla Balanceada de Servicios (6 tarjetas simétricas, sin íconos innecesarios) ── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAMPUS_SERVICES.map((svc) => {
                const isInteractive = Boolean(svc.isInteractive);

                return (
                  <div
                    key={svc.title}
                    onClick={() => isInteractive && setActiveModal("Jóvenes")}
                    className={`rounded-2xl p-6 bg-white border border-gray-200/80 shadow-xs hover:shadow-md hover:border-gold/50 transition-all flex flex-col justify-between ${
                      isInteractive ? "cursor-pointer group hover:-translate-y-0.5 border-gold/40" : ""
                    }`}
                  >
                    <div>
                      {/* Día y Hora sin íconos decorativos */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-navy uppercase tracking-wider bg-gray-100 px-2.5 py-1 rounded-md">
                          {svc.day}
                        </span>
                        <span className="font-bold text-gold-dark">
                          {svc.time}
                        </span>
                      </div>

                      {/* Título y Categoría */}
                      <h4 className="font-bold text-navy text-lg leading-snug">
                        {svc.title}
                      </h4>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {svc.category}
                      </p>

                      {/* Descripción */}
                      <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed mt-3">
                        {svc.description}
                      </p>
                    </div>

                    {/* Enlace interactivo solo si aplica */}
                    {isInteractive && (
                      <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gold-dark group-hover:text-navy transition-colors">
                        <span>Conocer ministerio</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Banner Sutil y Limpio: Transmisión en YouTube ── */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">Transmisión en YouTube · ICCTV</p>
                <p className="text-base font-bold text-navy mt-0.5">
                  ¿No puedes acompañarnos de manera presencial?
                </p>
                <p className="text-xs sm:text-sm text-gray-500 font-light mt-0.5">
                  Sigue nuestras reuniones en vivo los jueves a las 7:00 PM y domingos a las 10:00 AM desde cualquier lugar.
                </p>
              </div>

              <Link
                href="/campus#transmision"
                className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
              >
                Ver transmisiones <ChevronRight className="w-3.5 h-3.5 text-gold" />
              </Link>
            </div>

          </div>
        ) : (
          /* ── Otros Campus (Sabinas, Múzquiz, etc.) ── */
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-100 shadow-lg text-center max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl text-navy font-bold">
                Reuniones en Campus {campus.name}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
                Para consultar los días y horarios específicos de las reuniones de este campus, te invitamos a comunicarte directamente con nosotros o seguir nuestras redes oficiales.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                href={`tel:${campus.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
              >
                <Phone className="w-4 h-4 text-gold" />
                Llamar al campus: {campus.phone}
              </a>
              <Link
                href="/campus/allende"
                className="inline-flex items-center gap-2 border border-navy/30 hover:border-navy text-navy text-sm font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Ver horarios de Campus Central <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MODAL INTERACTIVO: MINISTERIO DE JÓVENES
          ═══════════════════════════════════════════════════════════════════ */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          style={{ background: "rgba(5,12,28,0.8)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-[1.5rem] sm:rounded-[2rem] flex flex-col md:flex-row shadow-2xl overflow-hidden relative max-h-[92vh] sm:max-h-[90vh]"
            style={{ animation: "modalIn .4s cubic-bezier(.16,1,.3,1) both" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 hover:text-black transition-all duration-200 backdrop-blur-md cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "Jóvenes" ? (
              <>
                {/* ── Left Side: Hero Image & Overlay ── */}
                <div className="w-full md:w-2/5 relative h-48 sm:h-64 md:h-auto min-h-[160px] md:min-h-full shrink-0">
                  <img 
                    src="/images/jovenes.jpg" 
                    alt="Jóvenes Con Todo" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
                    <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2">Ministerio</p>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3 sm:mb-4">
                      Jóvenes<br/>Con Todo
                    </h3>
                    <div className="flex gap-3">
                      <a
                        href="https://www.instagram.com/jovenescontodoicc?igsh=azk1NzducHQydzFi"
                        target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                        aria-label="Instagram Jóvenes"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.facebook.com/share/14jAxX7pjUE/"
                        target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                        aria-label="Facebook Jóvenes"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.tiktok.com/@jovenes.con.todo"
                        target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-colors"
                        aria-label="TikTok Jóvenes"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.72a4.85 4.85 0 01-1.01-.03z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ── Right Side: Content Scrollable ── */}
                <div className="w-full md:w-3/5 overflow-y-auto p-5 sm:p-8 md:p-12 scrollbar-hide bg-off-white">
                  <div className="max-w-xl space-y-10">
                    <div>
                      <h4 className="text-2xl font-bold text-navy mb-4">Nuestra Visión</h4>
                      <p className="text-gray-600 text-base leading-relaxed">
                        Somos una generación apasionada por Dios, listos para marcar la diferencia en nuestra ciudad y nuestro entorno. Creemos en el potencial de cada joven para transformar su mundo cuando su identidad está fundamentada en Cristo.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Liderazgo</h4>
                      <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-navy text-lg">Omar y Jacqueline Laborico</p>
                          <p className="text-sm text-gold font-semibold mb-2">Pastores de Jóvenes</p>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            Contamos con un equipo de líderes apasionados por guiar a cada joven a su máximo potencial, creando una atmósfera de amistad, respeto y crecimiento espiritual.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Redes y contenido</h4>
                      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.72a4.85 4.85 0 01-1.01-.03z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-navy text-base">@jovenes.con.todo</p>
                            <p className="text-xs text-gray-500">Conoce lo que vivimos cada fin de semana en TikTok</p>
                          </div>
                        </div>
                        <a
                          href="https://www.tiktok.com/@jovenes.con.todo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors shrink-0"
                        >
                          Ver en TikTok →
                        </a>
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
