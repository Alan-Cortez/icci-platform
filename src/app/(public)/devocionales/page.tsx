import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Devocionales – ICCI",
  description: "Reflexiones diarias de Iglesias Comunidad De Cristo Internacional.",
};

const devotionals = [
  {
    id: "d1",
    title: "Confía en el Señor",
    verse: "Proverbios 3:5-6",
    verseText: "Confía en el Señor de todo corazón, y no en tu propia inteligencia. Reconócelo en todos tus caminos, y él allanará tus sendas.",
    reflection:
      "En momentos de incertidumbre, recordemos que Dios tiene un plan perfecto para nuestras vidas. Cuando soltamos el control y confiamos en Él, encontramos una paz que sobrepasa todo entendimiento. Hoy, entrega tus preocupaciones al Señor y confía en que Él guía cada paso.",
    author: "Equipo Pastoral ICCI",
    date: "Hoy",
  },
  {
    id: "d2",
    title: "Fortaleza en la debilidad",
    verse: "2 Corintios 12:9",
    verseText: "Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad.",
    reflection:
      "Muchas veces creemos que Dios solo puede usarnos cuando somos fuertes. Pero la Palabra nos revela algo poderoso: es precisamente en nuestra debilidad donde Su gracia brilla con mayor intensidad. No temas admitir que necesitas a Dios; esa es la posición perfecta para recibir Su poder.",
    author: "Equipo Pastoral ICCI",
    date: "Ayer",
  },
  {
    id: "d3",
    title: "El gozo del Señor",
    verse: "Nehemías 8:10",
    verseText: "No os entristezcáis, porque el gozo del Señor es vuestra fortaleza.",
    reflection:
      "El gozo bíblico no depende de las circunstancias externas. Es una fortaleza interior que proviene de nuestra relación con Dios. Cuando el mundo nos roba la alegría, podemos volver a la fuente: la presencia del Señor. Hoy, elige el gozo que Él ofrece.",
    author: "Equipo Pastoral ICCI",
    date: "Hace 2 días",
  },
  {
    id: "d4",
    title: "Renovación diaria",
    verse: "Lamentaciones 3:22-23",
    verseText: "Las misericordias del Señor jamás terminan, pues nunca fallan sus bondades. Son nuevas cada mañana; ¡grande es tu fidelidad!",
    reflection:
      "Cada nuevo día es una oportunidad de comenzar de nuevo. Las misericordias de Dios son renovadas cada mañana, lo que significa que no importa lo que pasó ayer — hoy es un nuevo comienzo. Recibe con gratitud este nuevo día como un regalo de la fidelidad de Dios.",
    author: "Equipo Pastoral ICCI",
    date: "Hace 3 días",
  },
];

export default function DevocionalesPage() {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-gold" />
          </div>
        </div>
        <SectionHeading
          subtitle="Alimento espiritual diario"
          title="Devocionales"
          description="Reflexiones para fortalecer tu caminar con Dios, disponibles cada día."
        />

        <div className="space-y-8">
          {devotionals.map((d, i) => (
            <Card key={d.id} className={`p-8 ${i === 0 ? "border-gold/30 shadow-md" : ""}`}>
              {i === 0 && (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 mb-4">
                  Devocional de hoy
                </span>
              )}
              <p className="text-gold text-sm font-medium">{d.date}</p>
              <h3 className="text-xl font-bold text-navy mt-1 mb-4">{d.title}</h3>
              <blockquote className="border-l-4 border-gold pl-5 py-2 bg-gold/5 rounded-r-xl mb-4">
                <p className="text-gray-700 italic leading-relaxed">{d.verseText}</p>
                <footer className="text-gold text-sm font-semibold mt-2">— {d.verse}</footer>
              </blockquote>
              <p className="text-gray-600 leading-relaxed mb-4">{d.reflection}</p>
              <p className="text-xs text-gray-400">— {d.author}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
