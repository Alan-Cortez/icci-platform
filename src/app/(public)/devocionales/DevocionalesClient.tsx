import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Devocionales – ICCI",
  description: "Reflexiones diarias de Iglesias Comunidad De Cristo Internacional.",
};

// Dynamic data from props

export function DevocionalesClient({ initialDevotionals }: { initialDevotionals: any[] }) {
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
          {initialDevotionals.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No hay devocionales publicados.</div>
          ) : (
            initialDevotionals.map((d, i) => (
            <Card key={d.id} className={`p-8 ${i === 0 ? "border-gold/30 shadow-md" : ""}`}>
              {i === 0 && (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 mb-4">
                  Devocional de hoy
                </span>
              )}
              <p className="text-gold text-sm font-medium">{new Date(d.date).toLocaleDateString()}</p>
              <h3 className="text-xl font-bold text-navy mt-1 mb-4">{d.title}</h3>
              {(d.verse || d.verseText) && (
                <blockquote className="border-l-4 border-gold pl-5 py-2 bg-gold/5 rounded-r-xl mb-4">
                  {d.verseText && <p className="text-gray-700 italic leading-relaxed">{d.verseText}</p>}
                  {d.verse && <footer className="text-gold text-sm font-semibold mt-2">— {d.verse}</footer>}
                </blockquote>
              )}
              <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{d.content}</p>
              <p className="text-xs text-gray-400">— {d.author}</p>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
