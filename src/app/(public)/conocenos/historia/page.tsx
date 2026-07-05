import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Historia – ICCI",
  description: "Conoce la historia de Iglesias Comunidad De Cristo Internacional.",
};

const milestones = [
  {
    year: "Fundación",
    title: "El inicio de un sueño",
    description:
      "Iglesias Comunidad De Cristo Internacional nació en Allende, Coahuila, como una pequeña congregación con un gran sueño: llevar el evangelio a cada rincón del norte de México. Con fe y determinación, un pequeño grupo de creyentes comenzó a reunirse para adorar, crecer y servir a su comunidad.",
  },
  {
    year: "Crecimiento",
    title: "Expansión a nuevas ciudades",
    description:
      "La Palabra de Dios no tiene fronteras. Pronto nacieron nuevos campus en Sabinas, Múzquiz y Barroterán, llevando el evangelio a comunidades que necesitaban esperanza y vida. Cada campus surgió como respuesta a una necesidad real: familias buscando un hogar espiritual.",
  },
  {
    year: "Consolidación",
    title: "Red de campus en el norte",
    description:
      "Anáhuac y Durango se sumaron a la red ICCI, consolidando nuestra presencia en el norte de México. Cada campus mantiene su identidad local mientras pertenece a una familia unida por los mismos valores, la misma fe y el mismo propósito.",
  },
  {
    year: "Hoy",
    title: "Una familia de fe en crecimiento",
    description:
      "Hoy, ICCI es una comunidad vibrante de fe con 6 campus activos, cientos de familias transformadas y un equipo pastoral comprometido con la excelencia ministerial. Seguimos creciendo, sirviendo y creyendo que lo mejor está por venir.",
  },
];

export default function HistoriaPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1 text-gold text-sm font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        <SectionHeading
          subtitle="Nuestra historia"
          title="Un camino de fe"
          description="La historia de ICCI es una historia de fe, valentía y la fidelidad de Dios a lo largo del tiempo."
          centered={false}
        />

        {/* Hero quote */}
        <blockquote className="my-10 p-8 rounded-2xl bg-navy text-white text-xl italic leading-relaxed border-l-4 border-gold pl-8">
          &ldquo;Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz, y no de mal, para daros el fin que esperáis.&rdquo;
          <footer className="mt-4 text-gold text-base font-medium not-italic">— Jeremías 29:11</footer>
        </blockquote>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <div key={i} className="relative flex gap-8">
                <div className="shrink-0 w-12 h-12 rounded-full bg-gold flex items-center justify-center z-10 shadow-md">
                  <span className="text-navy font-bold text-xs text-center leading-tight px-1">{m.year.split(" ")[0]}</span>
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-1">{m.year}</p>
                  <h3 className="text-xl font-bold text-navy mb-2">{m.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gray-50 text-center">
          <h3 className="text-xl font-bold text-navy mb-2">¿Quieres ser parte de esta historia?</h3>
          <p className="text-gray-600 mb-6">
            La historia de ICCI continúa escribiéndose. Cada persona que se une a nuestra familia es un nuevo capítulo lleno de propósito.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Únete a nosotros
          </Link>
        </div>
      </div>
    </div>
  );
}
