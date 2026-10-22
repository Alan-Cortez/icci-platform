"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  X,
  ChevronRight,
  Instagram,
  Facebook,
  Video,
  Sparkles,
  Heart,
  Shield,
  Church,
  Zap,
  Flame,
  Compass,
  ArrowUpRight,
  Radio,
  ExternalLink,
} from "lucide-react";
import { Button, Card } from "@/components/ui";

interface CampusClientProps {
  campus: any;
  pastorName: string;
  googleMapsUrl: string;
}

// ─── Horarios Detallados con Categorías y Jerarquía Visual ────────────────────

const DETAILED_SCHEDULES = [
  {
    title: "Servicio de Oración",
    category: "Oración Matutina",
    days: "Lunes a viernes",
    time: "9:00 AM - 10:00 AM",
    description: "Comenzando el día en la presencia de Dios a través de la oración e intercesión comunitaria.",
    icon: Heart,
    tagColor: "bg-navy/5 text-navy border-navy/10",
  },
  {
    title: "Servicio Femenil",
    category: "Ministerio de Mujeres",
    days: "Miércoles",
    time: "7:00 PM",
    description: "Un espacio de edificación, amistad y fortalecimiento de la fe diseñado especialmente para mujeres.",
    icon: Sparkles,
    tagColor: "bg-gold/15 text-gold-dark border-gold/30",
  },
  {
    title: "Servicio General",
    category: "Adoración & Palabra",
    days: "Jueves",
    time: "7:00 PM",
    description: "Reunión de mitad de semana con alabanza, estudio bíblico y tiempo de refrigerio espiritual.",
    icon: Church,
    tagColor: "bg-navy/5 text-navy border-navy/10",
  },
  {
    title: "Jóvenes Con Todo",
    category: "Ministerio Juvenil",
    days: "Sábado",
    time: "7:00 PM",
    extra: "11 años en adelante",
    description: "Una generación apasionada por Dios. Alabanza dinámica, mensajes relevantes y una gran comunidad.",
    icon: Zap,
    isInteractive: true,
    tagColor: "bg-gold text-navy font-bold shadow-sm",
  },
  {
    title: "Ministerio de Varones",
    category: "Hombres de Fe",
    days: "Sábado",
    time: "7:00 PM",
    description: "Hombres unidos para crecer como líderes espirituales en su hogar, trabajo e iglesia.",
    icon: Shield,
    tagColor: "bg-navy/5 text-navy border-navy/10",
  },
  {
    title: "Vigilia de Oración",
    category: "Clamor & Búsqueda",
    days: "Último viernes de cada mes",
    time: "7:00 PM",
    description: "Noche dedicada a la búsqueda profunda de Dios, oración ferviente y llenura del Espíritu Santo.",
    icon: Flame,
    tagColor: "bg-navy/5 text-navy border-navy/10",
  },
  {
    title: "Jornada de Evangelización",
    category: "Impacto Comunitario",
    days: "Último domingo del mes",
    time: "7:00 PM",
    description: "Llevando el amor de Jesús a las calles, compartiendo esperanza y sirviendo a nuestra comunidad.",
    icon: Compass,
    tagColor: "bg-navy/5 text-navy border-navy/10",
  },
];

export function CampusClient({ campus, pastorName, googleMapsUrl }: CampusClientProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Determinar foto del pastor
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-20">

        {/* ═══════════════════════════════════════════════════════════════════
            1. SECCIÓN SUPERIOR: LIDERAZGO PASTORAL + HUB DE INFORMACIÓN
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ── Col 1: Tarjeta Visual de Pastores (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex-1 min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] bg-black">
              {/* Foto o fondo negro */}
              <div className="absolute inset-0 bg-black">
                {pastorImg && (
                  <img
                    src={pastorImg}
                    alt={pastorName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>

              {/* Degradado para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Contenido inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2 z-10">
                <div className="inline-flex items-center gap-1.5 text-gold text-[11px] font-bold uppercase tracking-widest bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <User className="w-3.5 h-3.5" />
                  {isMain ? "Pastores Principales" : "Liderazgo Pastoral"}
                </div>
                <h2 className="font-display text-white text-2xl sm:text-3xl font-bold leading-tight">
                  {pastorName}
                </h2>
                <p className="text-white/70 text-xs sm:text-sm font-light">
                  {isMain
                    ? "Guiando a la familia de Iglesias Comunidad de Cristo Internacional con visión y amor."
                    : `Pastoreando con dedicación la congregación de Campus ${campus.name}.`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Col 2: Hub Ejecutivo de Ubicación y Contacto (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 p-8 sm:p-10 flex-1 flex flex-col justify-between">
              
              {/* Encabezado */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gold bg-gold/15 px-3 py-1 rounded-full">
                    {isMain ? "Sede Central · Allende, Coah." : `Campus ${campus.name}`}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-navy font-bold leading-tight">
                  Visítanos y Conéctate
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                  {campus.description || "Nuestras puertas están abiertas para recibirte a ti y a tu familia en cada uno de nuestros servicios y actividades."}
                </p>
              </div>

              {/* Tarjeta de Ubicación con botón de Google Maps */}
              <div className="my-6 p-5 sm:p-6 rounded-2xl bg-off-white border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Dirección del Campus
                    </p>
                    <p className="font-bold text-navy text-sm sm:text-base mt-0.5 leading-snug">
                      {campus.address}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {campus.state ? `${campus.name}, ${campus.state}, México` : "Coahuila, México"}
                    </p>
                  </div>
                </div>

                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-full transition-all shadow-sm hover:shadow-md shrink-0"
                >
                  <MapPin className="w-4 h-4 text-gold" />
                  Cómo llegar
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>

              {/* Canales de Contacto Directo */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <a
                  href={`tel:${campus.phone.replace(/\s/g, "")}`}
                  className="p-4 rounded-2xl bg-off-white/60 hover:bg-off-white border border-gray-100 transition-colors flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy group-hover:text-white flex items-center justify-center shrink-0 transition-colors text-navy">
                    <Phone className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Teléfono</p>
                    <p className="text-sm font-bold text-navy truncate group-hover:text-gold transition-colors">
                      {campus.phone}
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:contacto@icci.org.mx"
                  className="p-4 rounded-2xl bg-off-white/60 hover:bg-off-white border border-gray-100 transition-colors flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy group-hover:text-white flex items-center justify-center shrink-0 transition-colors text-navy">
                    <Mail className="w-4 h-4 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Correo</p>
                    <p className="text-sm font-bold text-navy truncate group-hover:text-gold transition-colors">
                      contacto@icci.org.mx
                    </p>
                  </div>
                </a>
              </div>

              {/* Botones de Acción Rápida */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <Button href="/oracion" variant="primary" className="font-bold flex-1 sm:flex-initial">
                  <Heart className="w-4 h-4 mr-2" />
                  Solicitar oración
                </Button>
                <Button href="/eventos" variant="outline" className="font-semibold flex-1 sm:flex-initial">
                  <Calendar className="w-4 h-4 mr-2" />
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
          <div className="space-y-10">
            
            {/* Encabezado de la sección */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
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
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-navy via-navy to-[#081324] border-2 border-gold/40 shadow-2xl p-7 sm:p-10 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                
                {/* Lado izquierdo: Info del servicio dominical */}
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gold text-navy shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-current" />
                    Reunión Principal de la Familia ICCI
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
                    Celebración Dominical General
                  </h3>

                  <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                    Nuestra mayor fiesta semanal con alabanza en vivo, mensaje bíblico edificante para toda la familia y atención especializada para niños.
                  </p>
                </div>

                {/* Lado derecho: Horario y CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-4 shrink-0 w-full sm:w-auto">
                  <div className="px-6 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-left lg:text-right">
                    <p className="text-[11px] uppercase tracking-wider text-gold font-bold">Cada Domingo</p>
                    <p className="font-display text-2xl sm:text-3xl font-black text-white">10:00 AM</p>
                    <p className="text-xs text-white/60">Hora del Centro</p>
                  </div>

                  <Link
                    href="/campus#campus-online"
                    className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all shadow-md hover:shadow-lg"
                  >
                    <Video className="w-4 h-4" />
                    Ver opción en vivo <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>

            {/* ── Grilla de los Demás Servicios y Ministerios ── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {DETAILED_SCHEDULES.map((svc) => {
                const IconComponent = svc.icon;
                const isInteractive = Boolean(svc.isInteractive);

                return (
                  <div
                    key={svc.title}
                    onClick={() => isInteractive && setActiveModal("Jóvenes")}
                    className={`rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                      isInteractive
                        ? "bg-gradient-to-b from-white to-gold/[0.04] border-2 border-gold/40 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                        : "bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    <div>
                      {/* Cabecera de la tarjeta */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${svc.tagColor}`}>
                          {svc.category}
                        </span>

                        <div className="w-9 h-9 rounded-xl bg-navy/5 text-navy flex items-center justify-center shrink-0">
                          <IconComponent className="w-4 h-4 text-gold" />
                        </div>
                      </div>

                      {/* Título y Días */}
                      <h4 className="font-bold text-navy text-lg leading-snug">
                        {svc.title}
                      </h4>
                      <p className="text-xs font-semibold text-gold-dark mt-1">
                        {svc.days} · {svc.time}
                      </p>

                      {/* Descripción */}
                      <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed mt-3">
                        {svc.description}
                      </p>
                    </div>

                    {/* Pie de tarjeta */}
                    {isInteractive && (
                      <div className="pt-4 mt-4 border-t border-gold/20 flex items-center justify-between text-xs font-bold text-navy">
                        <span className="flex items-center gap-1.5 text-gold-dark">
                          <Zap className="w-3.5 h-3.5 text-gold fill-current" />
                          Conocer el ministerio
                        </span>
                        <ChevronRight className="w-4 h-4 text-gold-dark group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Banner Elegante: Campus en Línea ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-navy text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.1),transparent_50%)] pointer-events-none" />

              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Radio className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gold">Campus en Línea</p>
                  <p className="font-bold text-white text-base sm:text-lg">
                    ¿No puedes acompañarnos de manera presencial?
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm font-light mt-0.5">
                    Sigue nuestra transmisión oficial cada domingo a las 10:00 AM desde cualquier lugar.
                  </p>
                </div>
              </div>

              <Link
                href="/campus#campus-online"
                className="relative z-10 inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg shrink-0 w-full md:w-auto justify-center"
              >
                <Video className="w-4 h-4" />
                Ir a Transmisión en Vivo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        ) : (
          /* ── Otros Campus (Sabinas, Múzquiz, etc.) ── */
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-100 shadow-lg text-center max-w-3xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 text-gold flex items-center justify-center mx-auto">
              <Church className="w-7 h-7 text-gold" />
            </div>
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(5,12,28,0.8)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}
        >
          <div 
            className="bg-white w-full max-w-5xl rounded-[2rem] flex flex-col md:flex-row shadow-2xl overflow-hidden relative"
            style={{ maxHeight: "90vh", animation: "modalIn .4s cubic-bezier(.16,1,.3,1) both" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-gray-700 hover:text-black transition-all duration-200 backdrop-blur-md cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === "Jóvenes" ? (
              <>
                {/* ── Left Side: Hero Image & Overlay ── */}
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
                <div className="w-full md:w-3/5 overflow-y-auto p-8 md:p-12 scrollbar-hide bg-off-white">
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
