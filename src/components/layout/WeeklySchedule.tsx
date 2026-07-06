"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ─── Schedule Data (navy/gold palette) ───────────────────────────────────────

const WEEKLY_SERVICES = [
  {
    id: "lunes-viernes",
    day: "Lun – Vie",
    title: "Servicio de Oración",
    subtitle: "Oración matutina",
    time: "9 AM",
    timeAlign: "right" as const,
    style: "primary",   // navy bg + gold pill
  },
  {
    id: "miercoles",
    day: "Miércoles",
    title: "Servicio Femenil",
    subtitle: "Un espacio de fe para mujeres",
    time: "7 PM",
    timeAlign: "left" as const,
    style: "accent",    // gold bg + navy text
    image: "/servicio-femenil.jpg",
  },
  {
    id: "jueves",
    day: "Jueves",
    title: "Servicio General",
    subtitle: "Adoración y palabra",
    time: "7 PM",
    timeAlign: "right" as const,
    style: "primary",
  },
  {
    id: "sabado",
    day: "Sábado",
    title: "Jóvenes & Varones",
    subtitle: "11 años en adelante",
    time: "7 PM",
    timeAlign: "left" as const,
    style: "muted",     // navy-light bg
  },
  {
    id: "domingo",
    day: "Domingo",
    title: "Servicio General",
    subtitle: "Celebración dominical",
    time: "10 AM",
    timeAlign: "right" as const,
    style: "accent",
  },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const BG: Record<string, string> = {
  primary: "bg-navy border-white/10",
  accent:  "bg-gold border-gold",
  muted:   "bg-navy-light border-white/10",
};

const TEXT: Record<string, string> = {
  primary: "text-white",
  accent:  "text-navy",
  muted:   "text-white",
};

const PILL_BG: Record<string, string> = {
  primary: "bg-gold text-navy",
  accent:  "bg-navy text-gold",
  muted:   "bg-gold text-navy",
};

const SUBTITLE: Record<string, string> = {
  primary: "text-white/50",
  accent:  "text-navy/60",
  muted:   "text-white/50",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WeeklySchedule() {
  return (
    <section className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="label-eyebrow mb-3">Únete a nosotros</p>
          <div className="divider-gold mx-auto mb-4" />
          <h2 className="font-display text-display text-navy">
            Programa Semanal
          </h2>
          <p className="font-serif text-navy/50 mt-3 text-lg italic font-light">
            Allende, Coahuila · Calle Benito Juárez #1705 Norte
          </p>
        </div>

        {/* 2-column grid — banners horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEEKLY_SERVICES.map((svc, i) => {
            const isLeft = svc.timeAlign === "left";
            const isLast = i === WEEKLY_SERVICES.length - 1;

            return (
              <Link
                key={svc.id}
                href="/campus/allende"
                /* last item spans full width on md+ */
                className={`group relative flex items-center rounded-2xl border overflow-hidden h-[88px] cursor-pointer transition-all duration-300 hover:scale-[1.015] hover:shadow-xl ${BG[svc.style]} ${
                  isLast ? "md:col-span-2" : ""
                }`}
              >
                {/* Optional Background Image */}
                {svc.image && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 transition-opacity duration-500 mix-blend-multiply pointer-events-none"
                    style={{ backgroundImage: `url(${svc.image})` }}
                  />
                )}

                {/* Left accent stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold/60 rounded-l-2xl z-10" />

                {/* Inner layout */}
                <div className="relative flex items-center justify-between w-full px-6 sm:px-8 z-10">

                  {/* Time pill — left */}
                  {isLeft && <TimePill label={svc.time} pillClass={PILL_BG[svc.style]} />}

                  {/* Text */}
                  <div
                    className={`flex flex-col flex-1 ${
                      isLeft ? "items-start ml-5" : "items-end mr-5"
                    }`}
                  >
                    <p
                      className={`font-display leading-none uppercase ${TEXT[svc.style]}`}
                      style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)" }}
                    >
                      {svc.day}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 tracking-wide ${TEXT[svc.style]}`}>
                      {svc.title}
                    </p>
                    <p className={`text-xs mt-0.5 font-light ${SUBTITLE[svc.style]}`}>
                      {svc.subtitle}
                    </p>
                  </div>

                  {/* Time pill — right */}
                  {!isLeft && <TimePill label={svc.time} pillClass={PILL_BG[svc.style]} />}
                </div>

                {/* Hover shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/0 via-white/5 to-white/0 pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/campus"
            className="inline-flex items-center gap-2 border-2 border-navy text-navy text-sm font-semibold px-6 py-3 rounded-full hover:bg-navy hover:text-white transition-all duration-300"
          >
            Ver todos los campus y horarios
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Time Pill ────────────────────────────────────────────────────────────────

function TimePill({ label, pillClass }: { label: string; pillClass: string }) {
  return (
    <div
      className={`flex-shrink-0 rounded-full px-4 py-1.5 flex items-center justify-center shadow-sm font-black text-sm tracking-tight leading-none ${pillClass}`}
      style={{ minWidth: "60px" }}
    >
      {label}
    </div>
  );
}
