"use client";

import Link from "next/link";
import { ChevronRight, Sun, Sunrise, Moon } from "lucide-react";

// ─── Schedule Data ─────────────────────────────────────────────────────────────

const WEEKLY_SERVICES = [
  {
    id: "lunes-viernes",
    day: "Lun – Vie",
    title: "Oración Matutina",
    subtitle: "Servicio de oración",
    time: "9 AM",
    icon: Sunrise,
    variant: "navy" as const,
  },
  {
    id: "miercoles",
    day: "Miércoles",
    title: "Servicio Femenil",
    subtitle: "Un espacio de fe para mujeres",
    time: "7 PM",
    icon: Moon,
    variant: "gold" as const,
  },
  {
    id: "jueves",
    day: "Jueves",
    title: "Servicio General",
    subtitle: "Adoración y palabra",
    time: "7 PM",
    icon: Moon,
    variant: "navy" as const,
  },
  {
    id: "sabado",
    day: "Sábado",
    title: "Jóvenes & Varones",
    subtitle: "11 años en adelante",
    time: "7 PM",
    icon: Moon,
    variant: "outline" as const,
  },
  {
    id: "domingo",
    day: "Domingo",
    title: "Servicio General",
    subtitle: "Celebración dominical",
    time: "10 AM",
    icon: Sun,
    variant: "gold" as const,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WeeklySchedule() {
  return (
    <section className="py-24 bg-off-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="label-eyebrow mb-3">Únete a nosotros</p>
          <div className="divider-gold mx-auto mb-5" />
          <h2 className="font-display text-display text-navy">Programa Semanal</h2>
          <p className="font-serif text-navy/40 mt-3 text-base italic font-light">
            Allende, Coahuila · Calle Benito Juárez #1705 Norte
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {WEEKLY_SERVICES.map((svc) => {
            const Icon = svc.icon;
            const isGold = svc.variant === "gold";
            const isOutline = svc.variant === "outline";

            return (
              <Link
                key={svc.id}
                href="/campus/allende"
                className={`group relative flex flex-col justify-between rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border
                  ${isGold
                    ? "bg-gold border-gold text-navy"
                    : isOutline
                    ? "bg-white border-gray-200 hover:border-navy text-navy"
                    : "bg-navy border-navy text-white"
                  }`}
              >
                {/* Top row: icon + time */}
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                    ${isGold ? "bg-navy/10" : isOutline ? "bg-navy/5" : "bg-white/10"}`}
                  >
                    <Icon className={`w-4 h-4 ${isGold ? "text-navy/70" : isOutline ? "text-navy/50" : "text-white/70"}`} />
                  </div>
                  <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full
                    ${isGold ? "bg-navy text-gold" : isOutline ? "bg-navy text-white" : "bg-gold text-navy"}`}
                  >
                    {svc.time}
                  </span>
                </div>

                {/* Day */}
                <div>
                  <p className={`font-display uppercase leading-none mb-1
                    ${isGold ? "text-navy" : isOutline ? "text-navy" : "text-white"}`}
                    style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
                  >
                    {svc.day}
                  </p>
                  <p className={`text-sm font-semibold tracking-wide mt-1
                    ${isGold ? "text-navy" : isOutline ? "text-navy/80" : "text-white"}`}
                  >
                    {svc.title}
                  </p>
                  <p className={`text-xs mt-1 font-light
                    ${isGold ? "text-navy/60" : isOutline ? "text-navy/40" : "text-white/50"}`}
                  >
                    {svc.subtitle}
                  </p>
                </div>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isGold ? "bg-navy/30" : "bg-gold/60"}`}
                />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/campus"
            className="inline-flex items-center gap-2 border-2 border-navy text-navy text-sm font-semibold px-7 py-3 rounded-full hover:bg-navy hover:text-white transition-all duration-300"
          >
            Ver todos los campus y horarios
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
