import type { Metadata } from "next";
import Link from "next/link";
import { Users, Clock, ChevronRight } from "lucide-react";
import { Card, SectionHeading, Badge } from "@/components/ui";
import { db } from "@/db";
import { ministries } from "@/db/schema";

export const metadata: Metadata = {
  title: "Ministerios – ICCI",
  description: "Ministerios de Iglesias Comunidad De Cristo Internacional.",
};
export const revalidate = 0;

// The dynamic ministries are fetched from the database

const ministeriosFuturos = [
  { name: "Matrimonios", emoji: "💍", desc: "Fortaleciendo los hogares" },
  { name: "Evangelismo", emoji: "📢", desc: "Llevando el evangelio" },
  { name: "EBDV", emoji: "📖", desc: "Escuela Bíblica" },
  { name: "Danza", emoji: "🎶", desc: "Expresión artística" },
  { name: "Alabanza", emoji: "🎵", desc: "Adoración y música" },
  { name: "Ujieres", emoji: "🤝", desc: "Servicio y hospitalidad" },
];

export default async function MinisteriosPage() {
  const allMinistries = await db.select().from(ministries);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Crece con nosotros"
          title="Ministerios ICCI"
          description="Cada ministerio es un espacio diseñado para que encuentres tu lugar en la familia de Dios."
        />

        {/* Ministerios principales */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {allMinistries.map((m) => (
            <Card key={m.id} className="p-8 border bg-gray-50 border-gray-100 flex flex-col hover:border-gold/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-navy">{m.name}</h2>
                {m.schedule && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-navy/5 text-navy border border-navy/10">
                    {m.schedule}
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed mb-5 flex-1">{m.description}</p>
              {m.leader && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-navy">Líder / Encargado</p>
                  <p className="text-sm text-gray-500">{m.leader}</p>
                </div>
              )}
            </Card>
          ))}
          {allMinistries.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">
              Pronto anunciaremos nuestros ministerios activos.
            </div>
          )}
        </div>

        {/* Próximos ministerios */}
        <div className="bg-gray-50 rounded-3xl p-10">
          <div className="text-center mb-8">
            <Badge variant="gold">Próximamente</Badge>
            <h3 className="text-2xl font-bold text-navy mt-3">Más ministerios en camino</h3>
            <p className="text-gray-600 mt-2">Estamos formando nuevos ministerios para servir mejor a toda la familia.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ministeriosFuturos.map((m) => (
              <div key={m.name} className="text-center p-4 bg-white rounded-2xl border border-gray-100">
                <div className="text-3xl mb-2">{m.emoji}</div>
                <p className="font-semibold text-navy text-sm">{m.name}</p>
                <p className="text-gray-400 text-xs mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-navy mb-3">¿Quieres servir en un ministerio?</h3>
          <p className="text-gray-600 mb-6">Cada persona tiene un don. Descubre cómo puedes aportar a la familia ICCI.</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-full hover:bg-gold-light transition-colors"
          >
            Quiero servir
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
