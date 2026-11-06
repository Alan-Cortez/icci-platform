import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Sparkles, Compass, HeartHandshake, BookOpen, Send, CheckCircle2, Flame } from "lucide-react";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Visión – ICCI",
  description: "La visión fundacional de Iglesias Comunidad De Cristo Internacional.",
};

const pillars = [
  {
    letter: "A",
    icon: Compass,
    title: "Alcanzar",
    subtitle: "Evangelismo y Alcance",
    description:
      "Llevar el mensaje de salvación a cada persona, compartiendo el amor y la gracia de Jesucristo en nuestra comunidad local y a nivel internacional.",
  },
  {
    letter: "R",
    icon: HeartHandshake,
    title: "Restaurar",
    subtitle: "Sanidad y Familia",
    description:
      "Ser un ministerio de sanidad donde las personas y familias encuentren la restauración integral que solo Dios puede dar a través de Su Espíritu y Su amor.",
  },
  {
    letter: "D",
    icon: BookOpen,
    title: "Discipular",
    subtitle: "Crecimiento y Gobierno de Dios",
    description:
      "Formar seguidores de Cristo maduros y arraigados en la Palabra, aprendiendo a vivir bajo el orden, gobierno y principios del Reino en todas las áreas de la vida.",
  },
  {
    letter: "E",
    icon: Send,
    title: "Enviar",
    subtitle: "Liderazgo y Misiones",
    description:
      "Comisionar líderes y servidores empoderados para que impacten su entorno, planten nuevas obras y cumplan el propósito misionero de Dios en el mundo.",
  },
];

const leadershipCommitments = [
  "Recibir y mantener la visión",
  "Proteger la integridad de la visión",
  "Lanzarla y comunicarla con efectividad",
];

export default function VisionPage() {
  return (
    <div className="py-16 bg-off-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1 text-gold text-sm font-semibold mb-8 hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-3">
            Ministerio de Restauración • Sep 2012
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-navy leading-tight tracking-tight mb-4">
            Visión ICC
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Fundamento espiritual establecido a través del Apóstol Teodoro Oscar Sosa Espinoza en Allende, Coahuila.
          </p>
        </div>

        {/* ── 1. Declaración Oficial de Visión (Tarjeta Principal) ── */}
        <div className="relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-12 shadow-2xl mb-12 border border-gold/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-navy">
                Declaración Oficial
              </span>
              <span className="text-white/60 text-xs">Iglesia Comunidad de Cristo</span>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl font-light text-white/95 leading-relaxed font-serif italic">
              &ldquo;El establecimiento de una iglesia con una experiencia Restauradora, carismática y misionera Guiada por la Revelación divina para alcanzar al pueblo hispano local e internacional en general, teniendo como base y fundamento la proclamación del Evangelio del Reino, para la Restauracion y Evangelizacion de los perdidos y la edificación del Cuerpo de Cristo por medio de la cual, la iglesia ICC aprenderá a vivir bajo el Gobierno Teocrático establecido por Dios y su aplicación en todas las áreas de la vida a través de las autoridades delegadas por Dios.&rdquo;
            </p>

            {/* Separador y principios del ADN */}
            <div className="pt-4 border-t border-white/10 space-y-3 text-sm text-white/80">
              <p className="font-semibold text-gold">
                &bull; La visión de la iglesia Comunidad de Cristo es definitivamente la visión de Dios y el ADN de la iglesia.
              </p>
              <p className="font-light italic text-white/70">
                &bull; La visión nunca se pondrá en venta, al antojo de la gente o diluirse; esta es Visión de Dios.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. Responsabilidad del Liderazgo ── */}
        <div className="bg-white rounded-2xl p-8 mb-12 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-navy text-xl mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold" />
            Responsabilidad de Comunicación y Protección
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
            Como responsable de lanzar y comunicar la visión en ICC, el Pastor y Líder principal debe mantener y proteger firmemente esta visión a través de tres principios rectores:
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {leadershipCommitments.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-off-white border border-gray-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-navy text-gold text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-navy font-semibold text-sm leading-snug pt-1">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Pilares de la Visión ARDE ── */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 text-gold-dark mb-2 border border-gold/30">
              Visión ARDE
            </span>
            <h3 className="font-bold text-navy text-2xl sm:text-3xl">
              Pilares fundamentales de la visión
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
              Cuatro pilares de acción que guían cada ministerio, campus y servicio en nuestra iglesia.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="relative p-7 sm:p-8 rounded-2xl border border-gray-100 bg-white hover:border-gold/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Huge Watermark Letter */}
                <span className="absolute -top-3 right-4 text-7xl sm:text-8xl font-black text-navy/[0.04] group-hover:text-gold/15 transition-colors select-none pointer-events-none">
                  {pillar.letter}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center text-navy shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                      <pillar.icon className="w-6 h-6 text-gold-dark group-hover:text-navy transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-navy text-gold text-xs font-black flex items-center justify-center">
                          {pillar.letter}
                        </span>
                        <h4 className="font-black text-navy text-xl sm:text-2xl">{pillar.title}</h4>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark block mt-0.5">
                        {pillar.subtitle}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm pt-2">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. NUESTRA PROMESA (Isaías 54:17) ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-light text-white p-8 sm:p-12 shadow-2xl border border-gold/40 text-center space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              Nuestra Promesa Divina
            </div>

            <blockquote className="font-serif text-2xl sm:text-3xl italic font-normal text-white leading-relaxed">
              &ldquo;Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio. Esta es la herencia de los siervos de Jehová, y su salvación de mí vendrá, dijo Jehová.&rdquo;
            </blockquote>

            <div>
              <p className="text-gold font-bold text-lg tracking-wider uppercase">
                Isaías 54:17 (RVR1960)
              </p>
              <p className="text-white/60 text-xs sm:text-sm font-light mt-1">
                La herencia espiritual y escudo divino sobre nuestra iglesia, pastores, familias y campus.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/campus"
                className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-gold-light transition-all shadow-md cursor-pointer"
              >
                Conoce nuestros campus
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
