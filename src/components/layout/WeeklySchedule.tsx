"use client";

import Link from "next/link";
import { Clock, MapPin, ChevronRight, Sparkles, Calendar } from "lucide-react";
import { WEEKLY_SERVICES } from "@/lib/constants";

function formatEventDate(ts: number | Date | null): string {
  if (!ts) return "";
  const d = new Date(ts).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return d.charAt(0).toUpperCase() + d.slice(1);
}

interface WeeklyScheduleProps {
  upcomingEvent?: any;
}

export function WeeklySchedule({ upcomingEvent }: WeeklyScheduleProps) {
  return (
    <section className="py-20 lg:py-24 bg-off-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gold/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <p className="label-eyebrow mb-3">Reuniones y Agenda</p>
          <div className="divider-gold mx-auto mb-5" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy uppercase tracking-tight">
            Programa y Próximos Eventos
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 font-light">
            Conoce los horarios de nuestros servicios regulares y acompáñanos en nuestras actividades especiales.
          </p>
        </div>

        {upcomingEvent ? (
          /* ── Layout de 2 Columnas (Programa Semanal + Evento Destacado) ── */
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Columna Izquierda: Programa Semanal */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden flex-1 flex flex-col justify-between">
                
                {/* Cabecera interna */}
                <div className="p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy text-lg sm:text-xl">
                      Programa Semanal
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1 font-light">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>Campus Allende (Principal) · Benito Juárez #1705 Nte</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy bg-gold/20 px-3 py-1 rounded-full w-fit">
                    Presencial
                  </span>
                </div>

                {/* Lista de servicios */}
                <div className="divide-y divide-gray-100 flex-1">
                  {WEEKLY_SERVICES.map((svc) => {
                    const isSunday = svc.id === "domingo";

                    return (
                      <Link
                        key={svc.id}
                        href="/campus/allende"
                        className={`group flex items-center justify-between p-4 sm:px-6 transition-all duration-200 cursor-pointer ${
                          isSunday ? "bg-gold/[0.04] hover:bg-gold/[0.08]" : "hover:bg-gray-50/80"
                        }`}
                      >
                        {/* Izquierda: Día y Título */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <div className={`w-24 shrink-0 text-center py-2 px-2 rounded-xl border text-[11px] font-bold uppercase tracking-wider ${
                            isSunday
                              ? "bg-gold text-navy border-gold shadow-sm"
                              : "bg-navy/5 text-navy border-navy/10 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-colors"
                          }`}>
                            {svc.day}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-bold text-navy text-sm sm:text-base group-hover:text-gold-dark transition-colors truncate">
                              {svc.title}
                            </h4>
                            <p className="text-xs text-gray-500 font-light truncate">
                              {svc.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Derecha: Hora y Flecha */}
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                            <Clock className="w-3 h-3 text-gold" />
                            <span>{svc.time}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-navy group-hover:translate-x-0.5 transition-all hidden sm:block" />
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pie de la tarjeta */}
                <div className="p-4 sm:px-6 bg-off-white/50 border-t border-gray-100 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-gray-400 font-light">
                    * Horarios de campus sede.
                  </p>
                  <Link
                    href="/campus"
                    className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Ver todos los campus <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

            {/* Columna Derecha: Próximo Evento Destacado */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-gradient-to-br from-navy via-navy to-[#081324] rounded-3xl border border-gold/30 shadow-xl overflow-hidden text-white flex-1 flex flex-col justify-between relative group">
                
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

                <div className="p-6 sm:p-7 relative z-10 flex-1 flex flex-col">
                  
                  {/* Imagen de portada del evento */}
                  {upcomingEvent.image ? (
                    <div className="w-full rounded-2xl overflow-hidden aspect-[16/9] bg-navy-muted shadow-lg border border-white/10 mb-5 shrink-0 relative">
                      <img
                        src={upcomingEvent.image}
                        alt={upcomingEvent.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold text-navy shadow-md">
                          <Sparkles className="w-3 h-3 fill-current" />
                          Próximo Evento
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gold text-navy shadow-md">
                        <Sparkles className="w-3 h-3 fill-current" />
                        Próximo Evento
                      </span>
                    </div>
                  )}

                  {/* Categoría y Título */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
                        {upcomingEvent.category}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                      {upcomingEvent.title}
                    </h3>

                    {/* Metadata con iconos dorados */}
                    <div className="space-y-1.5 text-xs text-gold pt-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{formatEventDate(upcomingEvent.startDate)}</span>
                      </div>
                      {upcomingEvent.timeStr && (
                        <div className="flex items-center gap-2 text-white/80 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span>{upcomingEvent.timeStr}</span>
                        </div>
                      )}
                      {upcomingEvent.location && (
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                          <span className="truncate">{upcomingEvent.location}</span>
                        </div>
                      )}
                    </div>

                    {upcomingEvent.description && (
                      <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-3 font-light pt-2">
                        {upcomingEvent.description}
                      </p>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="pt-5 mt-4 border-t border-white/10 flex flex-wrap gap-2.5">
                    <Link
                      href="/eventos"
                      className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-light text-navy text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Ver detalles <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href="/calendario"
                      className="inline-flex items-center gap-1.5 border border-white/30 hover:border-white text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      Ver calendario completo
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        ) : (
          /* ── Layout de 1 Columna Centrado (Fallback si no hay eventos) ── */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl shadow-navy/5 border border-gray-100 overflow-hidden divide-y divide-gray-100">
              {WEEKLY_SERVICES.map((svc) => {
                const isSunday = svc.id === "domingo";

                return (
                  <Link
                    key={svc.id}
                    href="/campus/allende"
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:px-8 sm:py-6 transition-all duration-200 cursor-pointer ${
                      isSunday ? "bg-gold/[0.04] hover:bg-gold/[0.08]" : "hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                      <div className={`w-28 shrink-0 text-center py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider ${
                        isSunday
                          ? "bg-gold text-navy border-gold shadow-sm"
                          : "bg-navy/5 text-navy border-navy/10 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-colors"
                      }`}>
                        {svc.day}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-navy text-base sm:text-lg group-hover:text-gold-dark transition-colors truncate">
                          {svc.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 font-light mt-0.5">
                          {svc.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0 shrink-0">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy text-white text-xs sm:text-sm font-bold shadow-sm group-hover:shadow-md transition-shadow">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        <span>{svc.time}</span>
                      </div>

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 group-hover:text-navy group-hover:translate-x-1 transition-all">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2 text-center sm:text-left">
              <p className="text-xs text-gray-400 font-light">
                * Los horarios corresponden al campus sede. Las actividades pueden variar por ciudad.
              </p>
              <Link
                href="/campus"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors shrink-0"
              >
                Ver todos los campus y horarios <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
