"use client";

import { useCallback, useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

const INITIAL_VISIBLE = 8;

export function CampusGallery({ photos, campusName }: { photos: Photo[]; campusName: string }) {
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const visible = showAll ? photos : photos.slice(0, INITIAL_VISIBLE);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  if (photos.length === 0) return null;

  const current = active !== null ? photos[active] : null;

  return (
    <section className="py-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="label-eyebrow mb-3">Momentos en {campusName}</p>
          <div className="divider-gold mb-4 mx-auto block" />
          <h2 className="font-display text-display text-navy">Fotos de Nuestros Cultos</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto font-light">
            Revive lo que Dios hace cada semana en nuestra familia.
          </p>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
          {visible.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActive(i)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-gray-100 break-inside-avoid cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Ver foto: ${photo.title}`}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-medium text-left line-clamp-2">
                  {photo.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {photos.length > INITIAL_VISIBLE && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-navy-light transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-gold" />
              Ver todas las fotos ({photos.length})
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <figure className="max-w-5xl max-h-full flex flex-col items-center">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl"
            />
            <figcaption className="mt-3 text-center text-white/80 text-sm">
              {current.title}
              <span className="text-white/40 ml-2">
                {(active ?? 0) + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
