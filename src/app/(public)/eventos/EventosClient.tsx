"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, X, ChevronRight } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORIES = ["Jóvenes", "Niños", "Femenil", "Varones", "Danza", "General"];
const MONTHS_ES = ["Todos los meses", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

function formatDate(ts: number | Date | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function getMonthLabel(ts: number | Date | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-MX", { month: "long", timeZone: "UTC" });
}

interface EventData {
  id: string;
  title: string;
  category: string;
  description: string;
  startDate: number | null;
  timeStr: string;
  location: string;
  campusId?: string | null;
  capacity?: number | null;
  featured?: boolean;
  image?: string | null;
  price?: string | null;
}

// Using dynamic data from DB instead of hardcoded array

export function EventosClient({ initialEvents }: { initialEvents: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [activeMonth, setActiveMonth] = useState("Todos los meses");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const eventCategories = Array.from(
    new Set(initialEvents.map((e) => e.category).filter(Boolean))
  );
  const categories = [
    "Todo",
    ...(eventCategories.length > 0 ? eventCategories : DEFAULT_CATEGORIES),
  ];

  // Filter events
  const filteredEvents = initialEvents.filter((evt) => {
    const matchCategory = activeCategory === "Todo" || evt.category === activeCategory;
    const eventMonth = getMonthLabel(evt.startDate);
    const matchMonth = activeMonth === "Todos los meses" || eventMonth.toLowerCase() === activeMonth.toLowerCase();
    return matchCategory && matchMonth;
  });

  const featuredEvent = initialEvents.find((e) => e.featured);

  return (
    <div className="bg-off-white min-h-screen relative">
      {/* ── 1. Hero — NAVY (Identical to Conocenos) ── */}
      <section className="relative flex items-center justify-center py-28 md:py-36 overflow-hidden bg-navy text-white mb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <span className="absolute text-[28vw] font-black text-white/[0.04] -bottom-6 -left-4 tracking-tighter leading-none">
            ICCI
          </span>
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="text-gold tracking-[0.3em] uppercase text-xs font-semibold mb-4">
            Iglesias Comunidad De Cristo Internacional
          </p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight sm:leading-none tracking-tight break-words">
            Eventos
          </h1>
          <p className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Conferencias, retiros y actividades especiales en todos nuestros campus.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── 1. Filtros ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-white p-2 rounded-2xl md:rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full">
          
          {/* Categories */}
          <div className="flex items-center gap-1 min-w-max px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer",
                  activeCategory === cat
                    ? "bg-navy text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-navy"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Month Filter Dropdown (Simple select) */}
          <div className="px-4 border-l border-gray-200">
            <select 
              className="bg-transparent text-navy font-semibold text-sm outline-none cursor-pointer py-2 pr-4"
              value={activeMonth}
              onChange={(e) => setActiveMonth(e.target.value)}
            >
              {MONTHS_ES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── 2. Evento Destacado (Si no hay filtros activos) ── */}
        {featuredEvent && activeCategory === "Todo" && activeMonth === "Todos los meses" && (
          <div className="mb-16">
            <Card className="overflow-hidden p-0 grid md:grid-cols-5 bg-white border border-gray-100 shadow-lg cursor-pointer" onClick={() => setSelectedEvent(featuredEvent)}>
              <div className="md:col-span-2 relative h-72 md:h-auto min-h-[260px] bg-navy flex items-center justify-center overflow-hidden">
                {featuredEvent.image ? (
                  <>
                    <img 
                      src={featuredEvent.image} 
                      alt="" 
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-navy/20" />
                    <img 
                      src={featuredEvent.image} 
                      alt={featuredEvent.title} 
                      className="relative z-10 max-w-full max-h-[340px] md:max-h-full w-auto h-auto object-contain p-4 drop-shadow-xl"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <Calendar className="w-20 h-20 text-gold/60 drop-shadow-lg" />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full">Destacado</span>
                  <Badge variant="navy">{featuredEvent.campusId ?? "General"}</Badge>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-navy mb-4">{featuredEvent.title}</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredEvent.description}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500 font-medium mb-8">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-navy" /> {formatDate(featuredEvent.startDate)}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-navy" /> {featuredEvent.timeStr}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-navy" /> {featuredEvent.location}</span>
                  {featuredEvent.capacity && (
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-navy" /> Cupo: {featuredEvent.capacity}</span>
                  )}
                </div>

                <div>
                  <Button onClick={(e) => { e.stopPropagation(); setSelectedEvent(featuredEvent); }}>Ver detalles</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── 3. Grid de Eventos ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <Card 
              key={evt.id} 
              className="flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedEvent(evt)}
            >
              {/* Imagen adaptable a formatos verticales y horizontales */}
              <div className="relative h-64 overflow-hidden bg-navy flex items-center justify-center">
                {evt.image ? (
                  <>
                    <img 
                      src={evt.image} 
                      alt="" 
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-45 scale-110 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-navy/25" />
                    <img 
                      src={evt.image} 
                      alt={evt.title} 
                      className="relative z-10 max-w-full max-h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gold/40" />
                  </div>
                )}
                <div className="absolute top-3 left-3 z-20">
                  <Badge variant="gold" className="shadow-lg backdrop-blur-md bg-gold/95 font-bold text-xs">{evt.category}</Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="text-xl font-bold text-navy line-clamp-2 mb-2 group-hover:text-gold transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">{evt.description}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 text-gold shrink-0" /> 
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-gold shrink-0" /> 
                    <span className="truncate">{formatDate(evt.startDate)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No se encontraron eventos</h3>
            <p className="text-gray-500">Intenta cambiar los filtros de búsqueda.</p>
            <Button variant="outline" className="mt-6" onClick={() => { setActiveCategory("Todo"); setActiveMonth("Todos los meses"); }}>
              Ver todos los eventos
            </Button>
          </div>
        )}
      </div>

      {/* ── 4. Modal de Detalles de Evento (Adaptable a imágenes verticales/horizontales y pantallas móviles/desktop) ── */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-navy/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh] border border-white/20 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Botón Cerrar (accesible y visible en cualquier fondo) */}
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 bg-white/90 hover:bg-white text-navy rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Columna Izquierda: Imagen Completa Adaptativa (Mantiene proporción intacta sin recortes) */}
            <div className="w-full md:w-1/2 lg:w-5/12 relative bg-navy flex items-center justify-center overflow-hidden shrink-0 min-h-[260px] max-h-[45vh] md:max-h-[92vh] p-4 sm:p-6">
              {selectedEvent.image ? (
                <>
                  {/* Fondo ambiental difuminado con los colores del flyer */}
                  <img 
                    src={selectedEvent.image} 
                    alt="" 
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-navy/35" />
                  
                  {/* Poster/Flyer íntegro en primer plano (NUNCA recortado, visible en formato vertical u horizontal) */}
                  <img 
                    src={selectedEvent.image} 
                    alt={selectedEvent.title} 
                    className="relative z-10 max-w-full max-h-[40vh] md:max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl transition-all"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/50 py-16">
                  <Calendar className="w-16 h-16 text-gold/60 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gold/70">ICCI Eventos</span>
                </div>
              )}
            </div>

            {/* Columna Derecha: Información y detalles (Scroll independiente) */}
            <div className="p-6 sm:p-8 md:p-10 w-full md:w-1/2 lg:w-7/12 overflow-y-auto flex flex-col justify-between max-h-[92vh]">
              <div>
                {/* Categoría y Campus */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="gold" className="text-xs font-bold uppercase tracking-wider">{selectedEvent.category}</Badge>
                  {selectedEvent.campusId && (
                    <Badge variant="navy" className="text-xs font-semibold">{selectedEvent.campusId}</Badge>
                  )}
                  {selectedEvent.featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
                      Destacado
                    </span>
                  )}
                </div>

                {/* Título del evento */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-navy leading-tight tracking-tight mb-5">
                  {selectedEvent.title}
                </h2>

                {/* Cuadro de Detalles estructurados */}
                <div className="bg-off-white rounded-2xl p-4 sm:p-5 border border-gray-100 mb-6 space-y-3">
                  <h4 className="font-bold text-navy text-xs uppercase tracking-wider flex items-center gap-2 text-gold">
                    <Clock className="w-4 h-4" /> Detalles del evento
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[11px] text-gray-400 uppercase font-medium">Fecha</span>
                        <span className="font-semibold text-navy">{formatDate(selectedEvent.startDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[11px] text-gray-400 uppercase font-medium">Horario</span>
                        <span className="font-semibold text-navy">{selectedEvent.timeStr || "Por confirmar"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[11px] text-gray-400 uppercase font-medium">Ubicación</span>
                        <span className="font-semibold text-navy">{selectedEvent.location || "Campus Allende"}</span>
                      </div>
                    </div>

                    {selectedEvent.capacity && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-gold shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[11px] text-gray-400 uppercase font-medium">Cupo</span>
                          <span className="font-semibold text-navy">{selectedEvent.capacity} personas</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acerca del evento (Descripción completa) */}
                <div className="mb-6">
                  <h4 className="font-bold text-navy text-xs uppercase tracking-wider mb-2 text-gray-500">
                    Acerca del evento
                  </h4>
                  <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                    {selectedEvent.description}
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="pt-4 border-t border-gray-100 mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full text-navy font-bold py-3 rounded-full hover:bg-gray-100 cursor-pointer" 
                  onClick={() => setSelectedEvent(null)}
                >
                  Cerrar
                </Button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
