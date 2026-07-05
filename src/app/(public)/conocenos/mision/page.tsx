import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Target, Globe, Heart, Star } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Misión – ICCI",
  description: "La misión y propósito de Iglesias Comunidad De Cristo Internacional.",
};

const values = [
  {
    icon: Target,
    title: "Propósito",
    description: "Cada persona tiene un propósito divino. Ayudamos a nuestra comunidad a descubrirlo y vivirlo con convicción.",
  },
  {
    icon: Globe,
    title: "Alcance",
    description: "El evangelio no tiene fronteras. Nos extendemos a nuevas ciudades y regiones con el mensaje de salvación.",
  },
  {
    icon: Heart,
    title: "Amor",
    description: "Servimos con amor genuino, atendiendo las necesidades espirituales, emocionales y prácticas de nuestra comunidad.",
  },
  {
    icon: Star,
    title: "Excelencia",
    description: "Todo lo que hacemos lo hacemos con excelencia, honrando a Dios en cada detalle de nuestro ministerio.",
  },
];

export default function MisionPage() {
  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1 text-gold text-sm font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        <SectionHeading
          subtitle="Por qué existimos"
          title="Nuestra Misión"
          description="Somos una iglesia comprometida con transformar vidas a través del evangelio de Jesucristo."
        />

        {/* Misión statement */}
        <div className="my-10 relative overflow-hidden rounded-3xl bg-navy text-white p-10 text-center">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">Nuestra misión</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">
            Llevar el evangelio de Jesucristo a cada persona, fortalecer a las familias y extender el Reino de Dios
            en nuestra región y más allá.
          </h2>
        </div>

        {/* Values */}
        <h3 className="text-xl font-bold text-navy mb-6 text-center">Valores que nos guían</h3>
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {values.map((v) => (
            <Card key={v.title} className="p-6 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                <v.icon className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h4 className="font-bold text-navy text-lg">{v.title}</h4>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">{v.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* How we live the mission */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="font-bold text-navy text-xl mb-6">¿Cómo vivimos nuestra misión?</h3>
          <div className="space-y-4">
            {[
              "Proclamando el evangelio con claridad en cada campus y servicio.",
              "Discipulando a creyentes a través de estudios bíblicos, ministerios y grupos pequeños.",
              "Sirviendo a nuestra comunidad con amor práctico y generosidad.",
              "Multiplicando campus para alcanzar a más familias en nuevas ciudades.",
              "Formando líderes que continúen la misión con la siguiente generación.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-navy text-xs font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
