import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Compass } from "lucide-react";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Visión – ICCI",
  description: "La visión de Iglesias Comunidad De Cristo Internacional.",
};

const pillars = [
  {
    number: "01",
    title: "Iglesias locales fuertes",
    description:
      "Cada campus debe ser una iglesia saludable, con liderazgo sólido, ministerios activos y comunidades que crecen en número y en madurez espiritual.",
  },
  {
    number: "02",
    title: "Multiplicación regional",
    description:
      "Nuestra visión es plantar nuevos campus en ciudades del norte de México donde el evangelio necesite ser proclamado con mayor fuerza.",
  },
  {
    number: "03",
    title: "Formación de líderes",
    description:
      "Levantamos y equipamos a la próxima generación de pastores, líderes y siervos para que multipliquen el impacto del reino de Dios.",
  },
  {
    number: "04",
    title: "Familias transformadas",
    description:
      "Creemos que cuando una familia encuentra a Cristo, una comunidad entera puede ser transformada. Invertimos en las familias de cada campus.",
  },
];

export default function VisionPage() {
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
          subtitle="Hacia dónde vamos"
          title="Nuestra Visión"
          description="Una red de iglesias unidas, sanas y en crecimiento constante, alcanzando a México para Cristo."
        />

        {/* Compass icon */}
        <div className="flex justify-center my-10">
          <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center">
            <Compass className="w-12 h-12 text-gold" />
          </div>
        </div>

        {/* Vision statement */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <blockquote className="text-2xl md:text-3xl font-light text-navy leading-relaxed italic">
            &ldquo;Ser una red de iglesias unidas por el evangelio de Jesucristo, que transforma familias, ciudades y naciones.&rdquo;
          </blockquote>
        </div>

        {/* Pillars */}
        <h3 className="font-bold text-navy text-xl text-center mb-8">Pilares de nuestra visión</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="relative p-8 rounded-2xl border border-gray-100 bg-white hover:border-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-5xl font-bold text-gold/20 absolute top-4 right-6">{pillar.number}</span>
              <h4 className="font-bold text-navy text-xl mb-3">{pillar.title}</h4>
              <p className="text-gray-600 leading-relaxed text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Future */}
        <div className="mt-16 bg-navy text-white rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold mb-4">El futuro es brillante</h3>
          <p className="text-white/70 max-w-2xl mx-auto leading-relaxed">
            Creemos que lo mejor de ICCI está por venir. Con Dios como fundamento y una comunidad comprometida,
            nuestros mejores días están frente a nosotros. ¡Únete a esta visión!
          </p>
          <Link
            href="/campus"
            className="mt-6 inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Ver nuestros campus
          </Link>
        </div>
      </div>
    </div>
  );
}
