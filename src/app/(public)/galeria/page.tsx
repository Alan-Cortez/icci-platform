"use client";

import { useState } from "react";
import { SectionHeading, Badge } from "@/components/ui";

type Category = "Todos" | "Campus" | "Eventos" | "Ministerios";

const photos = [
  { id: 1, category: "Campus", label: "Allende, Coahuila" },
  { id: 2, category: "Eventos", label: "Conferencia 2025" },
  { id: 3, category: "Ministerios", label: "Jóvenes" },
  { id: 4, category: "Campus", label: "Sabinas" },
  { id: 5, category: "Eventos", label: "Avivamiento" },
  { id: 6, category: "Ministerios", label: "Femenil" },
  { id: 7, category: "Campus", label: "Múzquiz" },
  { id: 8, category: "Eventos", label: "Bautismos 2025" },
  { id: 9, category: "Ministerios", label: "Varones" },
  { id: 10, category: "Campus", label: "Barroterán" },
  { id: 11, category: "Eventos", label: "Retiro de Jóvenes" },
  { id: 12, category: "Ministerios", label: "Niños" },
];

// Pastel tones that match navy/gold palette
const bgPalette = [
  "bg-navy/10",
  "bg-gold/10",
  "bg-navy/20",
  "bg-gold/20",
  "bg-slate-100",
  "bg-amber-50",
  "bg-blue-50",
  "bg-yellow-50",
  "bg-indigo-50",
  "bg-navy/15",
  "bg-gold/15",
  "bg-slate-200",
];

const categories: Category[] = ["Todos", "Campus", "Eventos", "Ministerios"];

export default function GaleriaPage() {
  const [active, setActive] = useState<Category>("Todos");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "Todos" ? photos : photos.filter((p) => p.category === active);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Nuestra comunidad"
          title="Galería"
          description="Momentos especiales que capturan la vida y el amor de nuestra familia de fe."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-navy text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              onClick={() => setLightbox(photo.id)}
              className={`group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer ${bgPalette[i % bgPalette.length]}`}
              style={{ minHeight: i % 3 === 0 ? "200px" : "150px" }}
            >
              <div className="w-full h-full flex items-center justify-center p-4" style={{ minHeight: i % 3 === 0 ? "200px" : "150px" }}>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-2">
                    <span className="text-navy/50 font-bold text-xs">#{photo.id}</span>
                  </div>
                  <p className="text-navy/60 text-xs font-medium">{photo.label}</p>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-end p-3">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium bg-navy/60 rounded-lg px-2 py-1">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const photo = photos.find((p) => p.id === lightbox)!;
                return (
                  <>
                    <div className={`w-full h-48 rounded-xl ${bgPalette[lightbox % bgPalette.length]} flex items-center justify-center mb-4`}>
                      <p className="text-navy/50 font-bold">Foto #{photo.id}</p>
                    </div>
                    <h3 className="font-bold text-navy">{photo.label}</h3>
                    <Badge variant="navy" className="mt-2">{photo.category}</Badge>
                    <button
                      onClick={() => setLightbox(null)}
                      className="mt-4 block w-full text-sm text-gray-500 hover:text-navy"
                    >
                      Cerrar
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-10">
          Las imágenes reales se publicarán desde el panel administrativo.
        </p>
      </div>
    </div>
  );
}
