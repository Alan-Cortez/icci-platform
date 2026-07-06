"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MapPin, ChevronRight, X } from "lucide-react";
import { CAMPUSES } from "@/lib/constants";

// ─── Pastors data ─────────────────────────────────────────────────────────────

const PASTORS = [
  {
    id: "pastores-generales",
    name: "Pastores Oscar y Raquel Sosa",
    role: "Pastores Principales",
    desc:
      "Fundadores y visionarios de Iglesias Comunidad De Cristo Internacional. Su liderazgo y pasión por la adoración han guiado la red de campus hacia un crecimiento sostenido y profundo.",
    img: "/pastores-sosa.png",
    color: "from-navy to-navy-light",
  },
  {
    id: "pastor-campus",
    name: "Pastores de Campus",
    role: "Red de Liderazgo ICCI",
    desc:
      "Cada campus cuenta con pastores comprometidos que sirven a su comunidad local con excelencia, amor y visión.",
    img: null,
    color: "from-navy-light to-navy",
  },
];

// ─── Campus map pins (normalized 0-1 for a simple visual map) ─────────────────

const MAP_PINS = [
  { id: "allende", label: "Allende, Coah.", x: 32, y: 34, main: true },
  { id: "sabinas", label: "Sabinas, Coah.", x: 31, y: 30 },
  { id: "muzquiz", label: "Múzquiz, Coah.", x: 29, y: 29 },
  { id: "nueva-rosita", label: "Nueva Rosita, Coah.", x: 33, y: 31 },
  { id: "monclova", label: "Monclova, Coah.", x: 34, y: 33 },
  { id: "acuna", label: "Acuña, Coah.", x: 28, y: 35 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ConocenosClient() {
  const [activePastor, setActivePastor] = useState<string | null>(null);
  const [activePin, setActivePin] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-[#111] text-white min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center py-32 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
          <span className="absolute text-[25vw] font-black text-white/10 -bottom-8 -left-4 tracking-tighter leading-none select-none">
            ICCI
          </span>
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4">
            Iglesias Comunidad De Cristo Internacional
          </p>
          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight">
            Conócenos
          </h1>
          <p className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed">
            Descubre quiénes somos, qué creemos y el propósito que mueve todo
            lo que hacemos.
          </p>
        </div>
      </section>

      {/* ── Historia + Video ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-black mb-10 leading-tight">
              Nuestra historia
            </h2>
            <div className="space-y-5 text-white/70 leading-relaxed text-base">
              <p>
                ICCI nació del corazón de Dios y del deseo de edificar
                comunidades de fe sólidas en el noreste de México. Desde
                Allende, Coahuila, la iglesia ha crecido con raíces
                profundas en la Biblia y un corazón misionero.
              </p>
              <p>
                A lo largo de los años, Dios ha levantado campus en múltiples
                ciudades de Coahuila, unidas por la misma visión: llevar el
                evangelio con excelencia y transformar vidas con el poder de
                Cristo.
              </p>
              <p>
                Hoy, Iglesias Comunidad De Cristo Internacional es una red de
                campus comprometidos con la Gran Comisión — plantando fe,
                restaurando familias y edificando comunidad.
              </p>
            </div>

            {/* Sub-section: Propósito */}
            <div className="mt-14">
              <h3 className="text-2xl font-black mb-4">Propósito</h3>
              <p className="text-white/70 leading-relaxed">
                Ayudamos a las personas a{" "}
                <strong className="text-white">conocer a Dios</strong>,
                encontrar libertad, descubrir su propósito y hacer la
                diferencia.
              </p>
            </div>
          </div>

          {/* YouTube embed */}
          <div className="sticky top-24">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0"
                title="Video de la iglesia"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-white/30 text-xs mt-3 text-center">
              Coloca el ID de tu video de YouTube en{" "}
              <code className="text-gold">src/app/(public)/conocenos/ConocenosClient.tsx</code>
            </p>
          </div>
        </div>
      </section>

      {/* ── Pastores ──────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-black mb-14">
            Pastores principales
          </h2>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PASTORS.map((pastor) => (
              <div
                key={pastor.id}
                className="relative group rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-gold/30 transition-all duration-500"
                style={{ height: "420px" }}
                onClick={() =>
                  setActivePastor(activePastor === pastor.id ? null : pastor.id)
                }
              >
                {/* Full background photo or gradient */}
                <div className={`absolute inset-0 bg-gradient-to-b ${pastor.color}`}>
                  {pastor.img && (
                    <img
                      src={pastor.img}
                      alt={pastor.name}
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>

                {/* Dark gradient overlay at bottom always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Name bar — always visible at bottom */}
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                    activePastor === pastor.id
                      ? "opacity-0 translate-y-2"
                      : "opacity-100 translate-y-0 group-hover:opacity-0 group-hover:translate-y-2"
                  }`}
                >
                  <div className="m-4 px-4 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <p className="font-semibold text-white text-sm">{pastor.name}</p>
                  </div>
                </div>

                {/* Info panel — slides up on hover or click */}
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                    activePastor === pastor.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0"
                  }`}
                >
                  <div className="m-4 p-5 bg-white rounded-2xl shadow-2xl">
                    <p className="font-bold text-navy text-base mb-2">{pastor.name}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{pastor.desc}</p>
                    <button className="inline-flex items-center gap-1 text-sm border border-gray-300 text-gray-700 px-4 py-1.5 rounded-full hover:border-navy hover:text-navy transition-colors font-medium">
                      Más información
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Campus Map ────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5 bg-[#0e0e0e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-white/40 text-sm mb-2">
              Tenemos campus en varias ubicaciones en Coahuila, México.
            </p>
            <h2 className="text-4xl sm:text-5xl font-black">
              Nuestros campus
            </h2>
          </div>

          {/* Simple visual campus list — replace with map SVG if desired */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {CAMPUSES.map((campus, i) => (
              <Link
                key={campus.id}
                href={`/campus/${campus.id}`}
                className="group flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-gold/40 hover:bg-white/5 transition-all"
              >
                <span className="w-7 h-7 rounded-full bg-gold text-navy text-xs font-black flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-sm leading-tight">
                    {campus.name}
                  </p>
                  <p className="text-white/40 text-xs">{campus.state}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/campus"
              className="inline-flex items-center gap-2 text-gold font-semibold hover:underline"
            >
              Ver todos los campus <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Visión & Misión ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/5">
        {/* Background image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0a0a2a] to-black opacity-95" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-4">
                Hacia dónde vamos
              </p>
              <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-none">
                VISIÓN
              </h2>
              <p className="text-white/70 leading-relaxed max-w-lg">
                Edificar una iglesia grande, Cristocéntrica, basada en la
                Biblia, con un mover fresco de Dios, que equipa a las personas
                para liderar en cada área de la vida, planta nuevas iglesias y
                sirve a las naciones.
              </p>
              <Link
                href="/conocenos/vision"
                className="inline-flex items-center gap-2 mt-8 border border-gold/40 text-gold px-5 py-2 rounded-full text-sm hover:bg-gold hover:text-navy transition-all"
              >
                Conoce la Visión <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <p className="text-white/30 tracking-[0.3em] uppercase text-xs mb-4">
                Por qué existimos
              </p>
              <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-none">
                MISIÓN
              </h2>
              <p className="text-white/70 leading-relaxed max-w-lg">
                Glorificar y disfrutar a Dios cumpliendo el Gran Mandamiento y
                la Gran Comisión: amar a Dios, amar al prójimo y hacer
                discípulos en todas las naciones.
              </p>
              <Link
                href="/conocenos/mision"
                className="inline-flex items-center gap-2 mt-8 border border-white/20 text-white/60 px-5 py-2 rounded-full text-sm hover:border-gold hover:text-gold transition-all"
              >
                Nuestra misión <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Huge watermark text */}
        <div className="relative overflow-hidden pb-6">
          <p className="text-[15vw] font-black text-white/[0.03] tracking-tight leading-none select-none whitespace-nowrap px-4">
            MISIÓN · VISIÓN · MISIÓN · VISIÓN
          </p>
        </div>
      </section>

      {/* ── Qué Creemos CTA ──────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-gold tracking-widest uppercase text-xs mb-4">
            Nuestros fundamentos
          </p>
          <h2 className="text-4xl font-black mb-6">¿Qué Creemos?</h2>
          <p className="text-white/50 leading-relaxed mb-10">
            Conoce los pilares bíblicos que guían nuestra fe, nuestra doctrina
            y nuestra forma de vivir como comunidad cristiana.
          </p>
          <Link
            href="/conocenos/que-creemos"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-full hover:bg-gold/90 transition-colors"
          >
            Ver nuestras creencias <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
