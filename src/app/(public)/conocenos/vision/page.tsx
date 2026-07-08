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
    number: "A",
    title: "Alcanzar",
    description:
      "Llevar el mensaje de salvación a cada persona, compartiendo el amor y la gracia de Jesucristo en nuestra comunidad y más allá.",
  },
  {
    number: "R",
    title: "Restaurar",
    description:
      "Ser un lugar de sanidad donde las personas y familias encuentren la restauración integral que solo Dios puede dar a través de Su Espíritu.",
  },
  {
    number: "D",
    title: "Discipular",
    description:
      "Formar seguidores de Cristo maduros y arraigados en la Palabra, equipándolos para vivir una vida con propósito y principios bíblicos.",
  },
  {
    number: "E",
    title: "Enviar",
    description:
      "Comisionar líderes y servidores empoderados para que impacten su entorno, planten nuevas obras y cumplan el propósito de Dios en el mundo.",
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
          title="Nuestra Visión ARDE"
          description="Nuestra visión es encender el fuego del evangelio a través de cuatro pilares fundamentales."
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
            &ldquo;Hacer arder el corazón de nuestra ciudad con el amor de Cristo, para Alcanzar, Restaurar, Discipular y Enviar a cada persona a su propósito.&rdquo;
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
