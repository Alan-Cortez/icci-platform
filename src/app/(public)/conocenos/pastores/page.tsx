import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pastores – ICCI",
  description: "Conoce al equipo pastoral de Iglesias Comunidad De Cristo Internacional.",
};

const pastores = [
  {
    name: "Pastor General",
    title: "Pastor General – ICCI",
    campus: "Allende, Coahuila (Sede Principal)",
    description:
      "Con una visión clara y un corazón para servir, lidera la red de campus ICCI con sabiduría y dedicación. Su llamado es guiar a cada familia hacia un encuentro genuino con Dios.",
    initials: "PG",
  },
  {
    name: "Pastor de Campus Sabinas",
    title: "Pastor de Campus",
    campus: "Sabinas, Coahuila",
    description:
      "Comprometido con la comunidad de Sabinas, lidera con amor y pasión por ver vidas transformadas por el evangelio.",
    initials: "PS",
  },
  {
    name: "Pastor de Campus Múzquiz",
    title: "Pastor de Campus",
    campus: "Múzquiz, Coahuila",
    description:
      "Siervo de Dios con un corazón para la comunidad de Múzquiz, extendiendo el reino de Dios con excelencia y amor.",
    initials: "PM",
  },
  {
    name: "Pastor de Campus Barroterán",
    title: "Pastor de Campus",
    campus: "Barroterán, Coahuila",
    description:
      "Fiel servidor de la comunidad de Barroterán, comprometido con el crecimiento espiritual de cada familia.",
    initials: "PB",
  },
  {
    name: "Pastor de Campus Anáhuac",
    title: "Pastor de Campus",
    campus: "Anáhuac, Nuevo León",
    description:
      "Apasionado por llevar el evangelio a Anáhuac, trabaja incansablemente por ver a su comunidad crecer en fe.",
    initials: "PA",
  },
  {
    name: "Pastor de Campus Durango",
    title: "Pastor de Campus",
    campus: "Durango, Durango",
    description:
      "Con visión y propósito, lidera el campus de Durango, sembrando semillas de fe y esperanza en cada servicio.",
    initials: "PD",
  },
];

export default function PastoresPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/conocenos"
          className="inline-flex items-center gap-1 text-gold text-sm font-medium mb-8 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a Conócenos
        </Link>

        <SectionHeading
          subtitle="Nuestro equipo pastoral"
          title="Pastores ICCI"
          description="Siervos de Dios comprometidos con guiar a cada familia en su camino de fe."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastores.map((pastor, i) => (
            <Card key={i} className="p-6 flex flex-col">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center mb-5 mx-auto">
                <span className="text-gold font-bold text-xl">{pastor.initials}</span>
              </div>
              <div className="text-center flex-1">
                <h3 className="font-bold text-navy text-lg">{pastor.name}</h3>
                <p className="text-gold text-sm font-medium mt-1">{pastor.title}</p>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mt-2">
                  <MapPin className="w-3 h-3" />
                  {pastor.campus}
                </div>
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">{pastor.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center p-10 rounded-2xl bg-navy text-white">
          <h3 className="text-2xl font-bold mb-3">¿Necesitas hablar con un pastor?</h3>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Nuestro equipo pastoral está disponible para orar contigo, orientarte y acompañarte en tu camino de fe.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
