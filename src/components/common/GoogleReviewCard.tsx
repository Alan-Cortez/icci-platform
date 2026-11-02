"use client";

import { useState } from "react";
import { Star, ExternalLink, MessageSquare } from "lucide-react";
import { SITE } from "@/lib/constants";

interface GoogleReviewCardProps {
  className?: string;
  campusName?: string;
}

export function GoogleReviewCard({
  className = "",
  campusName = "Campus Allende",
}: GoogleReviewCardProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const reviewUrl = SITE.googleReview;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-navy via-navy to-navy-light text-white p-6 sm:p-8 border border-gold/30 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Info & Stars */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-navy">
              <Star className="w-3 h-3 fill-current" />
              Opiniones en Google
            </span>
            <span className="text-white/60 text-xs font-medium">
              {campusName}
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-bold leading-tight">
              ¿Has visitado nuestra iglesia?
            </h3>
            <p className="text-white/70 text-sm mt-1 max-w-xl font-light leading-relaxed">
              Tu experiencia ayuda a que más familias en nuestra comunidad conozcan a Jesús y encuentren un hogar espiritual.
            </p>
          </div>

          {/* Interactive Star Preview */}
          <div className="pt-1 flex items-center gap-3">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-1.5 -ml-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
              title="Calificar 5 estrellas en Google"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoveredStar !== null ? star <= hoveredStar : true;
                return (
                  <Star
                    key={star}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    className={`w-6 h-6 transition-all duration-150 ${
                      isFilled
                        ? "text-gold fill-gold scale-110 drop-shadow-sm"
                        : "text-white/30"
                    }`}
                  />
                );
              })}
            </a>
            <span className="text-xs font-bold text-gold uppercase tracking-wider hidden sm:inline-block">
              5.0 en Google
            </span>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="shrink-0 w-full md:w-auto">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-light text-navy font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-xl hover:scale-102 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Escribir opinión en Google
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>
        </div>

      </div>
    </div>
  );
}
