"use client";

import { useState } from "react";
import { Play, Search, ExternalLink } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { CAMPUSES } from "@/lib/constants";

// Dynamic data passed as props

export function PredicacionesClient({ initialSermons }: { initialSermons: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("Todos");
  const [selectedSerie, setSelectedSerie] = useState("Todas");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const campuses = ["Todos", ...CAMPUSES.map((c) => c.name)];

  const filtered = initialSermons.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.speaker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCampus = true; // Campus no longer part of sermon model right now, or maybe it is? We don't have it in the db.
    return matchSearch && matchCampus;
  });

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="La Palabra de Dios"
          title="Predicaciones"
          description="Escucha y comparte los mensajes de vida de nuestros pastores."
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar predicación o pastor..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No se encontraron predicaciones.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sermon) => (
              <Card key={sermon.id} hover className="overflow-hidden">
                {/* Thumbnail / Player */}
                <div className="aspect-video bg-navy relative overflow-hidden">
                  {playingId === sermon.id ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${sermon.youtubeId}?autoplay=1`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingId(sermon.id)}
                      className="w-full h-full flex items-center justify-center group"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${sermon.youtubeId}/hqdefault.jpg`}
                        alt={sermon.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                      />
                      <div className="relative w-14 h-14 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-6 h-6 text-navy ml-1" />
                      </div>
                    </button>
                  )}
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-navy text-lg leading-snug">{sermon.title}</h3>
                  {sermon.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{sermon.description}</p>}
                  <p className="text-xs text-gray-400 mt-2 font-semibold">
                    {sermon.speaker} · {new Date(sermon.date).toLocaleDateString()}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold text-xs font-medium mt-3 hover:underline"
                  >
                    Ver en YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
