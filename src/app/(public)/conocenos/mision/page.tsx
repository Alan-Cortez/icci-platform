import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Target, Globe, Heart, Star, ShieldCheck, Sparkles, BookOpen, Users2 } from "lucide-react";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Misión – ICCI",
  description: "La misión, propósito y fundamento de Iglesias Comunidad De Cristo Internacional.",
};

const values = [
  {
    icon: Target,
    title: "Proclamación del Reino",
    description: "Proclamar las buenas nuevas de salvación con denuedo y unción, llevando el mensaje de Jesucristo a toda persona.",
  },
  {
    icon: Heart,
    title: "Restauración Integral",
    description: "Sanar, reconciliar y levantar a las familias, guiándolas a una transformación profunda mediante el amor y el poder de Dios.",
  },
  {
    icon: BookOpen,
    title: "Edificación y Discipulado",
    description: "Formar el Cuerpo de Cristo para que cada miembro viva bajo los principios, orden y gobierno teocrático de Dios.",
  },
  {
    icon: Globe,
    title: "Alcance Hispano y Misionero",
    description: "Extender el Evangelio a nivel local, regional e internacional, plantando fe y nuevos campus en cada comunidad.",
  },
];

export default function MisionPage() {
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
            Por qué existimos • Fundamento
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-navy leading-tight tracking-tight mb-4">
            Nuestra Misión
          </h1>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Somos una iglesia comprometida con la proclamación del Evangelio del Reino, la restauración de vidas y la edificación del Cuerpo de Cristo.
          </p>
        </div>

        {/* ── Misión statement ── */}
        <div className="my-10 relative overflow-hidden rounded-3xl bg-navy text-white p-8 sm:p-12 shadow-2xl border border-gold/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-5 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-navy mx-auto">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              Declaración de Misión
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-serif italic text-white/95 leading-relaxed">
              &ldquo;Tener como base y fundamento la proclamación del Evangelio del Reino, para la Restauración y Evangelización de los perdidos y la edificación del Cuerpo de Cristo por medio de la cual, la iglesia aprenderá a vivir bajo el Gobierno Teocrático establecido por Dios y su aplicación en todas las áreas de la vida.&rdquo;
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-light pt-2 border-t border-white/10">
              Ministerio de Restauración • Iglesia Comunidad de Cristo Internacional
            </p>
          </div>
        </div>

        {/* ── Values ── */}
        <h3 className="text-2xl font-bold text-navy mb-8 text-center">Pilares de nuestra misión</h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {values.map((v) => (
            <Card key={v.title} className="p-6 sm:p-7 flex gap-4 bg-white hover:border-gold/30 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center shrink-0 text-gold-dark">
                <v.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-lg">{v.title}</h4>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{v.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* ── How we live the mission ── */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-gray-100 shadow-sm mb-14">
          <h3 className="font-bold text-navy text-xl sm:text-2xl mb-6 flex items-center gap-2">
            <Users2 className="w-6 h-6 text-gold" />
            ¿Cómo vivimos nuestra misión día con día?
          </h3>
          <div className="space-y-4">
            {[
              "Proclamando el Evangelio del Reino con claridad, pasión y fidelidad bíblica en cada servicio.",
              "Brindando un ministerio de restauración familiar y sanidad interior a través del Espíritu Santo.",
              "Enseñando a vivir bajo el gobierno, orden y principios de Dios en la familia, el trabajo y la sociedad.",
              "Formando discípulos comprometidos y líderes de fe para la siguiente generación.",
              "Extendiendo el amor de Dios hacia el pueblo hispano a nivel local, regional e internacional.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-navy text-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── NUESTRA PROMESA (Isaías 54:17) ── */}
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
                La herencia espiritual y escudo de Dios para toda la congregación de Iglesias Comunidad De Cristo Internacional.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/conocenos/vision"
                className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-7 py-3 rounded-full hover:bg-gold-light transition-all shadow-md cursor-pointer"
              >
                Conoce también nuestra Visión
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
