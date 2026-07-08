"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ─── Pastors data ─────────────────────────────────────────────────────────────

const PASTORS = [
  {
    id: "pastores-generales",
    name: "Pastores Oscar y Raquel Sosa",
    role: "Pastores Principales",
    desc:
      "Fundadores y visionarios de Iglesias Comunidad De Cristo Internacional. Su liderazgo y pasión por la adoración han guiado la red de campus hacia un crecimiento sostenido y profundo.",
    img: "/images/pastores-sosa.jpg",
    color: "from-navy to-navy-light",
  },
  {
    id: "copastores-rojero",
    name: "Co-pastores Tomás y Mary Rojero",
    role: "Co-Pastores",
    desc:
      "Siervos fieles y pilares de la iglesia, Tomás y Mary Rojero co-pastorean con dedicación y amor, apoyando el crecimiento espiritual de cada familia en la comunidad.",
    img: "/images/pastores-rojero.jpg",
    color: "from-gold/60 to-gold/30",
  },
  {
    id: "copastores-quistiano",
    name: "Co-pastores Epitacio y Ana Quistiano",
    role: "Co-Pastores",
    desc:
      "Epitacio y Ana Quistiano sirven con corazón pastoral, acompañando a la congregación con sabiduría, fe y un amor genuino por las personas.",
    img: "/images/pastores-quistiano.jpg",
    color: "from-navy-muted to-navy",
  },
  {
    id: "pastores-jovenes",
    name: "Pastores Omar y Jacqueline Laborico",
    role: "Pastores de Jóvenes",
    desc:
      "Omar y Jacqueline lideran el ministerio de jóvenes con pasión y visión, formando una generación de líderes comprometidos con Dios y con su propósito.",
    img: null,
    color: "from-gold/40 to-navy-light",
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

// ─── Component ────────────────────────────────────────────────────────────────

export function ConocenosClient() {
  const [activePastor, setActivePastor] = useState<string | null>(null);

  return (
    <div className="min-h-screen">

      {/* ── 1. Hero — NAVY ─────────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center py-36 overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span className="absolute text-[28vw] font-black text-white/[0.04] -bottom-6 -left-4 tracking-tighter leading-none">
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

      {/* ── 2. Historia + Video — OFF-WHITE ────────────────────────────────── */}
      <section className="bg-off-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Text */}
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                Nuestra historia
              </p>
              <div className="h-0.5 w-10 bg-gold mb-8" />
              <h2 className="text-4xl sm:text-5xl font-black mb-10 leading-tight text-navy">
                Nuestra historia
              </h2>
              <div className="space-y-5 text-gray-600 leading-relaxed text-base">
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
                <h3 className="text-2xl font-black mb-4 text-navy">Propósito</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ayudamos a las personas a{" "}
                  <strong className="text-navy">conocer a Dios</strong>,
                  encontrar libertad, descubrir su propósito y hacer la
                  diferencia.
                </p>
              </div>
            </div>

            {/* YouTube embed */}
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video bg-navy-light border border-navy/10">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/6t1sApLp0ro?controls=1&rel=0"
                  title="Video de la iglesia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Pastores — NAVY ─────────────────────────────────────────────── */}
      <section className="bg-navy text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
            Liderazgo
          </p>
          <div className="h-0.5 w-10 bg-gold mb-8" />
          <h2 className="text-4xl sm:text-5xl font-black mb-14">
            Pastores principales
          </h2>
        </div>

        {/* ── Carousel ── */}
        <div className="relative">
          {/* Scroll container */}
          <div
            className="flex gap-5 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            id="pastors-carousel"
          >
            {PASTORS.map((pastor) => (
              <div
                key={pastor.id}
                className="relative group rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-gold/40 transition-all duration-500 flex-shrink-0 snap-start"
                style={{ height: "420px", width: "300px" }}
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

                {/* Dark gradient overlay */}
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

          {/* Gradient fades on sides */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-navy to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-navy to-transparent" />
        </div>
      </section>


      {/* ── 4. Visión & Misión — OFF-WHITE ─────────────────────────────────── */}
      <section className="bg-off-white py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Visión */}
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                Hacia dónde vamos
              </p>
              <div className="h-0.5 w-10 bg-gold mb-8" />
              <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-none text-navy">
                VISIÓN
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-lg">
                Edificar una iglesia grande, Cristocéntrica, basada en la
                Biblia, con un mover fresco de Dios, que equipa a las personas
                para liderar en cada área de la vida, planta nuevas iglesias y
                sirve a las naciones.
              </p>
              <Link
                href="/conocenos/vision"
                className="inline-flex items-center gap-2 mt-8 bg-navy text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy-light transition-all"
              >
                Conoce la Visión <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Misión */}
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                Por qué existimos
              </p>
              <div className="h-0.5 w-10 bg-gold mb-8" />
              <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-none text-navy">
                MISIÓN
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-lg">
                Glorificar y disfrutar a Dios cumpliendo el Gran Mandamiento y
                la Gran Comisión: amar a Dios, amar al prójimo y hacer
                discípulos en todas las naciones.
              </p>
              <Link
                href="/conocenos/mision"
                className="inline-flex items-center gap-2 mt-8 border-2 border-navy text-navy px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy hover:text-white transition-all"
              >
                Nuestra misión <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. ¿Qué Creemos? CTA — NAVY ────────────────────────────────────── */}
      <section className="bg-navy text-white py-28 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="text-gold tracking-widest uppercase text-xs font-semibold mb-3">
            Nuestros fundamentos
          </p>
          <div className="h-0.5 w-10 bg-gold mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl font-black mb-6">¿Qué Creemos?</h2>
          <p className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto">
            Conoce los pilares bíblicos que guían nuestra fe, nuestra doctrina
            y nuestra forma de vivir como comunidad cristiana.
          </p>
          <Link
            href="/conocenos/que-creemos"
            className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-full hover:bg-gold-light transition-colors"
          >
            Ver nuestras creencias <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
}

