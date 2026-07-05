import type { Metadata } from "next";
import Link from "next/link";
import { Users, Clock, ChevronRight } from "lucide-react";
import { Card, SectionHeading, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ministerios – ICCI",
  description: "Ministerios de Iglesias Comunidad De Cristo Internacional.",
};

const ministeriosPrincipales = [
  {
    id: "varones",
    name: "Varones",
    emoji: "⚔️",
    description:
      "Hombres de fe que se fortalecen mutuamente para vivir con integridad, servir a sus familias y ser pilares de su comunidad. Un espacio de camaradería, crecimiento espiritual y propósito.",
    schedule: "Sábado · 7:00 PM",
    verse: '"El hombre de bien deja herencia a sus nietos." — Proverbios 13:22',
    color: "bg-blue-50 border-blue-100",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "femenil",
    name: "Femenil",
    emoji: "🌸",
    description:
      "Mujeres que descubren su identidad en Cristo, fortalecen su fe y se apoyan mutuamente en cada etapa de la vida. Un lugar de amistad genuina, sanidad y propósito divino.",
    schedule: "Miércoles · 7:00 PM",
    verse: '"Mujer virtuosa, ¿quién la hallará? Su estima sobrepasa largamente a la de las piedras preciosas." — Proverbios 31:10',
    color: "bg-pink-50 border-pink-100",
    badgeColor: "bg-pink-100 text-pink-700",
  },
  {
    id: "jovenes",
    name: "Jóvenes",
    emoji: "🔥",
    description:
      "Una generación apasionada que adora sin vergüenza y vive su fe con autenticidad. Para jóvenes de 11 años en adelante que quieren conocer a Dios y vivir con propósito.",
    schedule: "Sábado · 7:00 PM",
    verse: '"Acuérdate de tu Creador en los días de tu juventud." — Eclesiastés 12:1',
    color: "bg-orange-50 border-orange-100",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "ninos",
    name: "Niños",
    emoji: "🌟",
    description:
      "Los más pequeños de la familia ICCI aprenden sobre el amor de Dios de una manera divertida, creativa y significativa. Formando los cimientos de una fe sólida desde la infancia.",
    schedule: "Domingo · 10:00 AM",
    verse: '"Jesús dijo: Dejad a los niños venir a mí." — Mateo 19:14',
    color: "bg-yellow-50 border-yellow-100",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
];

const ministeriosFuturos = [
  { name: "Matrimonios", emoji: "💍", desc: "Fortaleciendo los hogares" },
  { name: "Evangelismo", emoji: "📢", desc: "Llevando el evangelio" },
  { name: "EBDV", emoji: "📖", desc: "Escuela Bíblica" },
  { name: "Danza", emoji: "🎶", desc: "Expresión artística" },
  { name: "Alabanza", emoji: "🎵", desc: "Adoración y música" },
  { name: "Ujieres", emoji: "🤝", desc: "Servicio y hospitalidad" },
];

export default function MinisteriosPage() {
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
          {ministeriosPrincipales.map((m) => (
            <Card key={m.id} className={`p-8 border ${m.color}`}>
              <div className="text-5xl mb-5">{m.emoji}</div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-navy">{m.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.badgeColor}`}>
                  {m.schedule}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-5">{m.description}</p>
              <blockquote className="border-l-4 border-gold pl-4 text-sm text-gray-500 italic">
                {m.verse}
              </blockquote>
            </Card>
          ))}
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
