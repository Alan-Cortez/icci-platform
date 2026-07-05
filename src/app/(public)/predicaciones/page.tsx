"use client";

import { useState } from "react";
import { Play, Search, ExternalLink } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { CAMPUSES } from "@/lib/constants";

const sermons = [
  {
    id: "s1",
    title: "Fe que mueve montañas",
    series: "Serie de Fe",
    pastor: "Pastor General",
    campus: "Allende",
    date: "Junio 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: true,
  },
  {
    id: "s2",
    title: "El poder de la oración",
    series: "Fundamentos Bíblicos",
    pastor: "Pastor General",
    campus: "Allende",
    date: "Mayo 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: false,
  },
  {
    id: "s3",
    title: "Gracia que transforma",
    series: "Serie de Fe",
    pastor: "Pastor de Campus",
    campus: "Sabinas",
    date: "Mayo 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: false,
  },
  {
    id: "s4",
    title: "Identidad en Cristo",
    series: "Quiénes Somos",
    pastor: "Pastor General",
    campus: "Allende",
    date: "Abril 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: false,
  },
  {
    id: "s5",
    title: "Propósito divino",
    series: "Quiénes Somos",
    pastor: "Pastor de Campus",
    campus: "Múzquiz",
    date: "Abril 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: false,
  },
  {
    id: "s6",
    title: "El amor de Dios",
    series: "Fundamentos Bíblicos",
    pastor: "Pastor General",
    campus: "Allende",
    date: "Marzo 2026",
    youtubeId: "dQw4w9WgXcQ",
    featured: false,
  },
];

const series = ["Todas", "Serie de Fe", "Fundamentos Bíblicos", "Quiénes Somos"];

export default function PredicacionesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("Todos");
  const [selectedSerie, setSelectedSerie] = useState("Todas");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const campuses = ["Todos", ...CAMPUSES.map((c) => c.name)];

  const filtered = sermons.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pastor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCampus = selectedCampus === "Todos" || s.campus === selectedCampus;
    const matchSerie = selectedSerie === "Todas" || s.series === selectedSerie;
    return matchSearch && matchCampus && matchSerie;
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
              placeholder="Buscar predicación..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
          <select
            value={selectedCampus}
            onChange={(e) => setSelectedCampus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-sm"
          >
            {campuses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={selectedSerie}
            onChange={(e) => setSelectedSerie(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white text-sm"
          >
            {series.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
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
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {sermon.featured && <Badge variant="gold">Destacada</Badge>}
                    <Badge variant="navy">{sermon.campus}</Badge>
                  </div>
                  <h3 className="font-bold text-navy text-lg leading-snug">{sermon.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{sermon.series}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {sermon.pastor} · {sermon.date}
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
