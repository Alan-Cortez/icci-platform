"use client";

import Link from "next/link";
import { Clock, MapPin, ChevronRight, Sparkles, Radio } from "lucide-react";
import { WEEKLY_SERVICES } from "@/lib/constants";

export function WeeklySchedule() {
  return (
    <section className="py-24 bg-off-white relative overflow-hidden">
      {/* Subtle decorative background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="label-eyebrow mb-3">Reuniones y Servicios</p>
          <div className="divider-gold mx-auto mb-5" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-navy uppercase tracking-tight">
            Programa Semanal
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs sm:text-sm mt-3 font-light">
            <MapPin className="w-4 h-4 text-gold shrink-0" />
            <span>Campus Allende (Principal) · Calle Benito Juárez #1705 Norte</span>
          </div>
        </div>

        {/* Executive Agenda Card Container */}
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
                {/* Left: Day Badge & Title */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                  {/* Day pill */}
                  <div className={`w-28 shrink-0 text-center py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider ${
                    isSunday
                      ? "bg-gold text-navy border-gold shadow-sm"
                      : "bg-navy/5 text-navy border-navy/10 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-colors"
                  }`}>
                    {svc.day}
                  </div>

                  {/* Service info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy text-base sm:text-lg group-hover:text-gold-dark transition-colors truncate">
                        {svc.title}
                      </h3>
                      {isSunday && (
                        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                          <Radio className="w-3 h-3 animate-pulse text-red-500" /> En Vivo
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 font-light mt-0.5">
                      {svc.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right: Time Pill & Arrow */}
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

        {/* Footer info note & CTA */}
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
    </section>
  );
}
