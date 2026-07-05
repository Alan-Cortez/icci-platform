"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const beliefs = [
  {
    title: "La Biblia",
    text: "Creemos que la Biblia es la Palabra inspirada e infalible de Dios, la autoridad suprema para la fe y la práctica cristiana. Toda escritura es inspirada por Dios y útil para enseñar, para redargüir, para corregir, para instruir en justicia (2 Timoteo 3:16).",
  },
  {
    title: "La Trinidad",
    text: "Creemos en un solo Dios eterno que se manifiesta en tres personas coiguales: Padre, Hijo y Espíritu Santo. Cada persona de la Trinidad es distinta pero de la misma esencia divina.",
  },
  {
    title: "Jesucristo",
    text: "Creemos en la plena deidad y plena humanidad de Jesucristo, en su nacimiento virginal, su vida sin pecado, sus milagros, su muerte expiatoria, su resurrección corporal, su ascensión al cielo y su segunda venida gloriosa.",
  },
  {
    title: "La Salvación",
    text: "Creemos que la salvación es un don de la gracia de Dios, recibido por medio de la fe en Jesucristo. Somos salvos no por obras, sino por gracia mediante la fe (Efesios 2:8-9). Todo aquel que crea en Él tendrá vida eterna.",
  },
  {
    title: "El Espíritu Santo",
    text: "Creemos en el Espíritu Santo, que habita en cada creyente, guía a toda verdad, da poder para el servicio y produce el fruto del Espíritu. Creemos también en los dones del Espíritu para la edificación del Cuerpo de Cristo.",
  },
  {
    title: "La Iglesia",
    text: "Creemos que la Iglesia es el cuerpo de Cristo, compuesta por todos los creyentes en Jesucristo. La iglesia local es expresión visible de ese cuerpo, llamada a adorar, discipular, evangelizar y servir.",
  },
  {
    title: "Los Sacramentos",
    text: "Creemos en el bautismo en agua como señal pública de la fe en Cristo y en la Santa Cena como memorial de la muerte y resurrección del Señor Jesús, practicados según el mandamiento de Cristo.",
  },
  {
    title: "La Segunda Venida",
    text: "Creemos en el regreso literal y personal de Jesucristo. Su venida traerá la resurrección de los muertos, el juicio final y el establecimiento eterno del Reino de Dios.",
  },
];

function AccordionItem({ title, text, open, onToggle }: { title: string; text: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <h3 className="font-bold text-navy text-lg">{title}</h3>
        <ChevronDown
          className={cn("w-5 h-5 text-gold shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{text}</p>
      </div>
    </div>
  );
}

export default function QueCeemosPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1 text-gold text-sm font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        <SectionHeading
          subtitle="Declaración de fe"
          title="Qué Creemos"
          description="Los fundamentos de nuestra fe cristiana, basada en la Palabra de Dios."
        />

        <div className="space-y-3">
          {beliefs.map((b, i) => (
            <AccordionItem
              key={i}
              title={b.title}
              text={b.text}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 text-center p-8 bg-gold/10 rounded-2xl border border-gold/20">
          <p className="text-navy font-semibold mb-2">¿Tienes preguntas sobre nuestra fe?</p>
          <p className="text-gray-600 text-sm mb-4">
            Con gusto te acompañamos a resolver cualquier duda. Nuestro equipo pastoral está disponible.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-5 py-2.5 rounded-full hover:bg-navy-light transition-colors text-sm"
          >
            Hablar con un pastor
          </Link>
        </div>
      </div>
    </div>
  );
}
