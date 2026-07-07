"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, X, ChevronRight, Ticket } from "lucide-react";
import { Badge, Button, Card, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

// --- DUMMY DATA ---
const CATEGORIES = ["Todo", "Jóvenes", "Niños", "Femenil", "Varones", "General"];
const MONTHS = ["Todos los meses", "Julio", "Agosto", "Septiembre", "Octubre"];

interface EventData {
  id: string;
  title: string;
  category: string;
  month: string;
  description: string;
  dateStr: string;
  timeStr: string;
  location: string;
  campus: string;
  capacity?: number;
  featured?: boolean;
  image: string;
  price?: string;
}

// Using dynamic data from DB instead of hardcoded array

export function EventosClient({ initialEvents }: { initialEvents: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [activeMonth, setActiveMonth] = useState("Todos los meses");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Filter events
  const filteredEvents = initialEvents.filter((evt) => {
    const matchCategory = activeCategory === "Todo" || evt.category === activeCategory;
    const matchMonth = activeMonth === "Todos los meses" || evt.month === activeMonth;
    return matchCategory && matchMonth;
  });

  const featuredEvent = initialEvents.find((e) => e.featured);

  return (
    <div className="py-8 sm:py-16 bg-off-white min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          subtitle="Actividades"
          title="EVENTOS"
          description="Conferencias, retiros y actividades especiales en todos nuestros campus."
          centered={true}
        />

        {/* ── 1. Filtros ── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-2 rounded-full shadow-sm border border-gray-100 overflow-x-auto">
          
          {/* Categories */}
          <div className="flex items-center gap-1 min-w-max px-2">
            {CATEGORIES.map((cat) => (
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
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── 2. Evento Destacado (Si no hay filtros activos) ── */}
        {featuredEvent && activeCategory === "Todo" && activeMonth === "Todos los meses" && (
          <div className="mb-16">
            <Card className="overflow-hidden p-0 grid md:grid-cols-5 bg-white border border-gray-100 shadow-lg cursor-pointer" onClick={() => setSelectedEvent(featuredEvent)}>
              <div className="md:col-span-2 relative h-64 md:h-auto bg-navy">
                <img 
                  src={featuredEvent.image} 
                  alt={featuredEvent.title} 
                  className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent md:hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Calendar className="w-20 h-20 text-gold/60 drop-shadow-lg" />
                </div>
              </div>
              
              <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full">Destacado</span>
                  <Badge variant="navy">{featuredEvent.campus}</Badge>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-navy mb-4">{featuredEvent.title}</h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{featuredEvent.description}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500 font-medium mb-8">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-navy" /> {featuredEvent.dateStr}</span>
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
              <div className="relative h-56 overflow-hidden bg-navy">
                <img 
                  src={evt.image} 
                  alt={evt.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="gold" className="shadow-lg backdrop-blur-md bg-gold/90">{evt.category}</Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4">
                   <h3 className="text-xl font-bold text-white line-clamp-2">{evt.title}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">{evt.description}</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 text-gold shrink-0" /> 
                    <span className="truncate">{evt.location} ({evt.campus})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Calendar className="w-4 h-4 text-gold shrink-0" /> 
                    <span className="truncate">{evt.dateStr}</span>
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

      {/* ── 4. Modal de Detalles de Evento ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200 max-h-[90vh]">
            
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-navy transition-colors md:text-gray-400 md:bg-transparent md:hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Left Image */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-navy flex-shrink-0">
               <img 
                  src={selectedEvent.image} 
                  alt={selectedEvent.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <Badge variant="gold" className="mb-3">{selectedEvent.category}</Badge>
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedEvent.title}</h2>
                </div>
            </div>

            {/* Modal Right Content */}
            <div className="p-8 md:p-12 w-full md:w-3/5 overflow-y-auto">
               
               <div className="grid sm:grid-cols-2 gap-8 mb-10">
                 {/* Col 1 */}
                 <div>
                   <h4 className="font-bold text-navy text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                     <Ticket className="w-5 h-5 text-gold" /> Localidades
                   </h4>
                   <div className="flex justify-between items-center text-gray-700 py-1">
                     <span>Entrada</span>
                     <span className="font-bold">{selectedEvent.price}</span>
                   </div>
                   <p className="text-xs text-gray-500 mt-4 italic">
                     * Información sujeta a disponibilidad. Si requiere registro previo, por favor contacte al campus.
                   </p>
                 </div>

                 {/* Col 2 */}
                 <div>
                   <h4 className="font-bold text-navy text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                     <Clock className="w-5 h-5 text-gold" /> Detalles del evento
                   </h4>
                   <div className="space-y-4 text-sm text-gray-700">
                     <div className="flex gap-3">
                       <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                       <span className="font-medium">{selectedEvent.dateStr}</span>
                     </div>
                     <div className="flex gap-3">
                       <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                       <span className="font-medium">{selectedEvent.timeStr}</span>
                     </div>
                     <div className="flex gap-3">
                       <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                       <span className="font-medium">{selectedEvent.location}, {selectedEvent.campus}</span>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="bg-off-white p-6 rounded-2xl mb-10 border border-gray-100">
                 <h4 className="font-bold text-navy mb-2">Acerca del evento</h4>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   {selectedEvent.description}
                 </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                 <Button className="w-full flex-1">Registrarme ahora</Button>
                 <Button variant="outline" className="w-full flex-1" onClick={() => setSelectedEvent(null)}>Cerrar ventana</Button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
