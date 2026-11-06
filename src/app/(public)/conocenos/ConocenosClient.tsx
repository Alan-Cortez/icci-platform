"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

// ─── Pastors data ─────────────────────────────────────────────────────────────

const PASTORS = [
  {
    id: "pastores-generales",
    name: "Pastores Oscar y Raquel Sosa",
    role: "Pastores Principales",
    desc:
      "Fundadores y visionarios de Iglesias Comunidad De Cristo Internacional. Su liderazgo y pasión por la adoración han guiado la red de campus hacia un crecimiento sostenido y profundo.",
    img: "/images/pastores-sosa.jpg",
  },
  {
    id: "copastores-rojero",
    name: "Pastores asociados Tomás y Mary Rojero",
    role: "Pastores Asociados",
    desc:
      "Siervos fieles y pilares de la iglesia, Tomás y Mary Rojero pastorean con dedicación y amor, apoyando el crecimiento espiritual de cada familia en la comunidad.",
    img: "/images/pastores-rojero.jpg",
  },
  {
    id: "copastores-quistiano",
    name: "Pastores asociados Epitacio y Ana Quistiano",
    role: "Pastores Asociados",
    desc:
      "Epitacio y Ana Quistiano sirven con corazón pastoral, acompañando a la congregación con sabiduría, fe y un amor genuino por las personas.",
    img: "/images/pastores-quistiano.jpg",
  },
  {
    id: "pastores-jovenes",
    name: "Pastores Omar y Jacqueline Laborico",
    role: "Pastores de Jóvenes",
    desc:
      "Omar y Jacqueline lideran el ministerio de jóvenes con pasión y visión, formando una generación de líderes comprometidos con Dios y con su propósito.",
    img: null,
  },
  {
    id: "pastor-campus",
    name: "Pastores de Campus",
    role: "Red de Liderazgo ICCI",
    desc:
      "Cada campus cuenta con pastores comprometidos que sirven a su comunidad local con excelencia, amor y visión.",
    img: null,
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
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight sm:leading-none tracking-tight break-words">
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
                Testimonio Fundacional • Desde 2010
              </p>
              <div className="h-0.5 w-10 bg-gold mb-8" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight text-navy">
                Una visión nacida en el corazón de Dios
              </h2>

              {/* Frase distintiva */}
              <div className="bg-white p-5 rounded-2xl border-l-4 border-gold shadow-sm mb-6">
                <blockquote className="font-serif italic text-navy text-base sm:text-lg leading-relaxed">
                  &ldquo;No comenzamos porque teníamos todos los recursos; comenzamos porque teníamos una palabra de Dios. Y cuando Dios entrega una visión, también prepara la provisión para cumplirla.&rdquo;
                </blockquote>
                <p className="text-xs text-gold-dark font-bold uppercase tracking-wider mt-2">
                  — Pastor Teodoro Oscar Sosa Espinoza
                </p>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                <p>
                  En <strong>2010</strong>, en medio de uno de los momentos más desafiantes y violentos en el norte del país, Dios puso una asignación sagrada en el corazón del Pastor Oscar Sosa en Allende, Coahuila: levantar una antorcha de esperanza y salvación donde reinaba el temor.
                </p>
                <p>
                  El primer servicio comenzó con solo <strong>cinco personas</strong>, pero con la entrega como si hubiera mil. Al siguiente domingo llegaron 12 personas por su propia iniciativa, y en menos de seis meses la congregación superaba las 90 personas buscando a Dios.
                </p>
                <p>
                  Hoy, Comunidad de Cristo Internacional es una red que trasciende fronteras con presencia en <strong>Coahuila, Nuevo León y Durango</strong>, llevando el Evangelio con amor práctico a las familias y brindando cobertura pastoral a nuevos ministerios.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href="/conocenos/historia"
                  className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-md cursor-pointer"
                >
                  Leer testimonio completo <ChevronRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-gray-500 font-medium">
                  Presencia en 3 estados • 6 campus activos
                </span>
              </div>
            </div>

            {/* YouTube embed */}
            <div className="sticky top-24">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-video bg-navy-light border border-navy/10 relative">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/6t1sApLp0ro?controls=1&rel=0"
                  title="Testimonio de la iglesia Comunidad de Cristo Internacional"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-center text-gray-500 mt-3 italic">
                Documental oficial: La historia de fe y milagros detrás de ICCI.
              </p>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-10 sm:mb-14">
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
                style={{ height: "420px", width: "min(300px, 82vw)" }}
                onClick={() =>
                  setActivePastor(activePastor === pastor.id ? null : pastor.id)
                }
              >
                {/* Full background: photo or solid black */}
                <div className="absolute inset-0 bg-black">
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


      {/* ── 4. Visión, Misión & Promesa — OFF-WHITE ─────────────────────────── */}
      <section className="bg-off-white py-24 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Visión */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                  Hacia dónde vamos • ADN Espiritual
                </p>
                <div className="h-0.5 w-10 bg-gold mb-6" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-none text-navy">
                  VISIÓN ICC
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  <p className="font-medium text-navy/90">
                    El establecimiento de una iglesia con una <strong className="text-navy">experiencia Restauradora, carismática y misionera</strong>, guiada por la Revelación divina para alcanzar al pueblo hispano local e internacional en general.
                  </p>
                  <p className="text-sm text-gray-600">
                    Teniendo como base y fundamento la proclamación del Evangelio del Reino, para la Restauración y Evangelización de los perdidos y la edificación del Cuerpo de Cristo, viviendo bajo el Gobierno establecido por Dios en todas las áreas de la vida.
                  </p>
                  {/* Pilares ARDE */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-gold mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Pilares Visión ARDE
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-off-white border border-gray-100 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-navy text-gold text-[10px] font-black flex items-center justify-center shrink-0">A</span>
                        <span className="font-semibold text-navy">Alcanzar</span>
                      </div>
                      <div className="p-2 rounded-lg bg-off-white border border-gray-100 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-navy text-gold text-[10px] font-black flex items-center justify-center shrink-0">R</span>
                        <span className="font-semibold text-navy">Restaurar</span>
                      </div>
                      <div className="p-2 rounded-lg bg-off-white border border-gray-100 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-navy text-gold text-[10px] font-black flex items-center justify-center shrink-0">D</span>
                        <span className="font-semibold text-navy">Discipular</span>
                      </div>
                      <div className="p-2 rounded-lg bg-off-white border border-gray-100 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-navy text-gold text-[10px] font-black flex items-center justify-center shrink-0">E</span>
                        <span className="font-semibold text-navy">Enviar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/conocenos/vision"
                  className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy-light transition-all shadow-md"
                >
                  Conoce la Visión completa <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Misión */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-3">
                  Por qué existimos • Nuestro Fundamento
                </p>
                <div className="h-0.5 w-10 bg-gold mb-6" />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-none text-navy">
                  MISIÓN ICC
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                  <p className="font-medium text-navy/90">
                    Proclamar con autoridad el <strong className="text-navy">Evangelio del Reino</strong> para la salvación de los perdidos, restaurar de manera integral a las familias y levantar discípulos maduros.
                  </p>
                  <p className="text-sm text-gray-600">
                    Edificar el Cuerpo de Cristo a través del poder transformador del Espíritu Santo y la Palabra de Dios, aprendiendo a vivir bajo el gobierno, orden y principios celestiales con alcance local, regional e internacional.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-off-white border border-gray-100">
                      <span className="block text-[11px] font-bold text-gold uppercase tracking-wider">Restauración</span>
                      <span className="text-xs text-gray-600">Sanidad integral para toda la familia</span>
                    </div>
                    <div className="p-3 rounded-xl bg-off-white border border-gray-100">
                      <span className="block text-[11px] font-bold text-gold uppercase tracking-wider">Evangelización</span>
                      <span className="text-xs text-gray-600">Alcanzar a nuestra comunidad y las naciones</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/conocenos/mision"
                  className="inline-flex items-center gap-2 border-2 border-navy text-navy px-6 py-3 rounded-full text-sm font-semibold hover:bg-navy hover:text-white transition-all"
                >
                  Nuestra misión completa <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── 5. Nuestra Promesa Divina (Isaías 54:17) ── */}
          <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-light text-white p-8 sm:p-12 border border-gold/30 shadow-2xl">
            {/* Background glow & accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Nuestra Promesa Divina
              </div>

              <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl italic font-normal text-white leading-relaxed tracking-wide">
                &ldquo;Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio. Esta es la herencia de los siervos de Jehová, y su salvación de mí vendrá, dijo Jehová.&rdquo;
              </blockquote>

              <div className="pt-2">
                <p className="text-gold font-bold text-base sm:text-lg tracking-wider uppercase">
                  Isaías 54:17 (RVR1960)
                </p>
                <p className="text-white/60 text-xs sm:text-sm font-light mt-1">
                  Promesa y fundamento espiritual de Dios para Iglesias Comunidad De Cristo Internacional
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

