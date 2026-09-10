"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ─── Schedule Data ─────────────────────────────────────────────────────────────

const WEEKLY_SERVICES = [
  {
    id: "lunes-viernes",
    day: "Lun – Vie",
    title: "Oración Matutina",
    subtitle: "Servicio de oración",
    time: "9 AM",
    variant: "navy" as const,
  },
  {
    id: "miercoles",
    day: "Miércoles",
    title: "Servicio Femenil",
    subtitle: "Un espacio de fe para mujeres",
    time: "7 PM",
    variant: "gold" as const,
  },
  {
    id: "jueves",
    day: "Jueves",
    title: "Servicio General",
    subtitle: "Adoración y palabra",
    time: "7 PM",
    variant: "navy" as const,
  },
  {
    id: "sabado",
    day: "Sábado",
    title: "Jóvenes & Varones",
    subtitle: "11 años en adelante",
    time: "7 PM",
    variant: "gold" as const,
  },
  {
    id: "domingo",
    day: "Domingo",
    title: "Servicio General",
    subtitle: "Celebración dominical",
    time: "10 AM",
    variant: "navy" as const,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function WeeklySchedule() {
  return (
    <section className="py-24 bg-off-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="label-eyebrow mb-3">Únete a nosotros</p>
          <div className="divider-gold mx-auto mb-5" />
          <h2 className="font-display text-display text-navy">Programa Semanal</h2>
          <p className="font-serif text-navy/40 mt-3 text-base italic font-light">
            Allende, Coahuila · Calle Benito Juárez #1705 Norte
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-8">
            {WEEKLY_SERVICES.map((svc, i) => {
              const isLeft = i % 2 === 0;
              const isGold = svc.variant === "gold";

              return (
                <div
                  key={svc.id}
                  className={`relative flex items-center gap-4 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <Link
                    href="/campus/allende"
                    className={`group flex-1 flex items-center gap-4 rounded-2xl px-6 py-5 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer
                      ${isLeft ? "md:mr-10" : "md:ml-10"}
                      ${isGold
                        ? "bg-gold border-gold text-navy"
                        : "bg-navy border-navy text-white"
                      }`}
                  >
                    {/* Time pill */}
                    <span
                      className={`flex-shrink-0 text-sm font-black px-3 py-1.5 rounded-full tracking-wide
                        ${isGold ? "bg-navy text-gold" : "bg-gold text-navy"}`}
                    >
                      {svc.time}
                    </span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-display uppercase leading-none tracking-wide ${
                          isGold ? "text-navy" : "text-white"
                        }`}
                        style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
                      >
                        {svc.day}
                      </p>
                      <p className={`text-sm font-semibold mt-0.5 ${isGold ? "text-navy" : "text-white"}`}>
                        {svc.title}
                      </p>
                      <p className={`text-xs mt-0.5 font-light ${isGold ? "text-navy/60" : "text-white/50"}`}>
                        {svc.subtitle}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isGold ? "text-navy/50" : "text-white/50"
                      }`}
                    />
                  </Link>

                  {/* Center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gold bg-off-white z-10 items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>

                  {/* Empty half on desktop */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
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
