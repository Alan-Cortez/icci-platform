"use client";

import { useState } from "react";
import { SectionHeading, Badge } from "@/components/ui";

type Category = "Todos" | "Campus" | "Eventos" | "Ministerios";

// Dynamic data from props

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

export function GaleriaClient({ initialPhotos }: { initialPhotos: any[] }) {
  const [active, setActive] = useState<Category>("Todos");
  const [lightbox, setLightbox] = useState<any | null>(null);

  const filtered = active === "Todos" ? initialPhotos : initialPhotos.filter((p) => p.category === active);

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
              onClick={() => setLightbox(photo)}
              className={`group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer ${bgPalette[i % bgPalette.length]}`}
              style={{ minHeight: i % 3 === 0 ? "250px" : "150px" }}
            >
              <img src={photo.imageUrl} alt={photo.title} className="absolute inset-0 w-full h-full object-cover" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-all duration-300 flex items-end p-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1 w-full">
                  <span className="text-white text-xs font-medium bg-navy/60 rounded-lg px-2 py-1 w-fit">
                    {photo.category}
                  </span>
                  <p className="text-white font-bold text-sm leading-tight drop-shadow-md">{photo.title}</p>
                </div>
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
                const photo = lightbox;
                return (
                  <>
                    <div className={`w-full h-64 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative`}>
                      <img src={photo.imageUrl} alt={photo.title} className="absolute inset-0 w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-navy">{photo.title}</h3>
                    {photo.description && <p className="text-sm text-gray-600 mt-2">{photo.description}</p>}
                    <Badge variant="navy" className="mt-4">{photo.category}</Badge>
                    <button
                      onClick={() => setLightbox(null)}
                      className="mt-6 block w-full text-sm font-semibold text-gray-500 hover:text-navy"
                    >
                      Cerrar
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
