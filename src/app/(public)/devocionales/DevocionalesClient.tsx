"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { BookOpen, Quote as QuoteIcon, Trophy, BookOpenCheck, X } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Todo", "Devocionales", "Retos de lectura", "Pensamientos"];

// Simple and robust Markdown to HTML renderer for devocionales
function renderMarkdown(text: string) {
  if (!text) return "";
  
  // Escape basic HTML to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Blockquotes: > quote text
  html = html.replace(/(?:^|\n)&gt;\s*(.*)/g, '\n<blockquote class="border-l-4 border-gold pl-5 py-2 my-4 bg-gold/5 italic text-gray-700 rounded-r-xl font-serif">$1</blockquote>');
  
  // Headings: ### heading
  html = html.replace(/(?:^|\n)###\s*(.*)/g, '\n<h4 class="text-base font-black text-navy mt-6 mb-3 uppercase tracking-tight">$1</h4>');
  
  // Bold: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-navy">$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  
  // Bullet lists: - item
  html = html.replace(/(?:^|\n)-\s*(.*)/g, '\n<li class="list-disc ml-5 my-1.5 text-gray-600 leading-relaxed">$1</li>');
  
  // Split into paragraphs by double newlines
  const paragraphs = html.split(/\n\n+/);
  return paragraphs.map((p) => {
    let content = p.trim();
    if (!content) return "";
    
    if (content.startsWith("<blockquote") || content.startsWith("<h4") || content.startsWith("<li")) {
      return content;
    }
    
    // Wrap lists in ul
    if (content.startsWith("<li")) {
      return `<ul class="space-y-1 my-4">${content}</ul>`;
    }
    
    return `<p class="mb-4 text-gray-600 leading-relaxed">${content.replace(/\n/g, '<br />')}</p>`;
  }).join("");
}

export function DevocionalesClient({ initialDevotionals }: { initialDevotionals: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Todo");
  const [selectedDevotional, setSelectedDevotional] = useState<any>(null);

  const filteredDevotionals = initialDevotionals.filter((d) => {
    if (activeCategory === "Todo") return true;
    if (activeCategory === "Devocionales") return d.type === "classic" || !d.type;
    if (activeCategory === "Retos de lectura") return d.type === "challenge";
    if (activeCategory === "Pensamientos") return d.type === "quote";
    return true;
  });

  return (
    <div className="bg-[#fbfbfa] min-h-screen">
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
          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight">
            Devocionales
          </h1>
          <p className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            Reflexiones, lecturas bíblicas y frases diarias de nuestros pastores para fortalecer tu caminar con Dios.
          </p>
        </div>
      </section>

      {/* ── 2. Main content container (max-w-7xl like events) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── Filtros de Categorías (Similar a Eventos) ── */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-100 overflow-x-auto max-w-full scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-navy text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-navy"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── 3. Publicaciones Grid (Similar a Eventos) ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDevotionals.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
              No hay publicaciones en esta categoría.
            </div>
          ) : (
            filteredDevotionals.map((d, i) => {
              const dateStr = new Date(d.date).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // --- TYPE 1: QUOTE / PENSIAMIENTO (Grid Card) ---
              if (d.type === "quote") {
                return (
                  <Card 
                    key={d.id} 
                    className="group cursor-pointer overflow-hidden p-0 flex flex-col justify-between hover:shadow-xl hover:border-gold/30 border border-gray-100 rounded-3xl transition-all duration-500 bg-white min-h-[300px]"
                    onClick={() => setSelectedDevotional(d)}
                  >
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden">
                      {/* Background decoration */}
                      <div className="absolute right-6 top-2 text-navy/[0.03] font-serif text-[8rem] leading-none pointer-events-none select-none font-bold">
                        “
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-navy/5 text-navy border border-navy/10">
                            Pensamiento
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                        </div>
                        
                        <div 
                          className="font-serif text-base sm:text-lg text-navy italic leading-relaxed line-clamp-5 mb-4"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(d.content) }}
                        />
                      </div>
                      
                      {/* Author Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-50 shrink-0 relative z-10">
                        {d.image ? (
                          <img 
                            src={d.image} 
                            alt={d.author} 
                            className="w-10 h-10 rounded-full object-cover border border-gold shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center border border-gold shadow-sm">
                            <span className="text-gold font-bold text-xs">
                              {d.author.split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-xs font-bold text-navy leading-none mb-1">{d.author}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Pastor</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }

              // --- TYPE 2: CHALLENGE / RETO DE LECTURA (Grid Card) ---
              if (d.type === "challenge") {
                return (
                  <Card 
                    key={d.id} 
                    className="group cursor-pointer overflow-hidden p-0 flex flex-col justify-between hover:shadow-xl hover:border-gold/30 border border-gray-100 rounded-3xl transition-all duration-500 bg-white min-h-[300px]"
                    onClick={() => setSelectedDevotional(d)}
                  >
                    <div className="flex-1 flex flex-col justify-between border-t-4 border-t-gold">
                      {d.image ? (
                        <div className="relative aspect-video overflow-hidden bg-navy shrink-0">
                          <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      ) : (
                        <div className="bg-gold/[0.03] p-6 flex justify-center items-center shrink-0 border-b border-gray-50">
                          <Trophy className="w-12 h-12 text-gold opacity-80" />
                        </div>
                      )}
                      
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/20">
                              Reto de Lectura
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-black text-navy uppercase tracking-tight mb-2 line-clamp-2">
                            {d.title}
                          </h3>
                          
                          <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                            {d.content.replace(/[#*`>_-]/g, "").trim()}
                          </p>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-medium shrink-0">
                          <span>Por: {d.author}</span>
                          <span className="text-gold font-bold">Ver Reto →</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }

              // --- TYPE 3: CLASSIC / DEVOCIONAL (Grid Card) ---
              return (
                <Card 
                  key={d.id} 
                  className="group cursor-pointer overflow-hidden p-0 flex flex-col justify-between hover:shadow-xl hover:border-gold/30 border border-gray-100 rounded-3xl transition-all duration-500 bg-white min-h-[300px]"
                  onClick={() => setSelectedDevotional(d)}
                >
                  <div className="flex-1 flex flex-col justify-between">
                    {d.image ? (
                      <div className="relative aspect-video overflow-hidden bg-navy shrink-0">
                        <img src={d.image} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : (
                      <div className="bg-navy/[0.02] p-6 flex justify-center items-center shrink-0 border-b border-gray-50">
                        <BookOpen className="w-12 h-12 text-gold opacity-60" />
                      </div>
                    )}
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                            Devocional
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{dateStr}</span>
                        </div>
                        
                        <h3 className="text-base sm:text-lg font-black text-navy uppercase tracking-tight mb-2 line-clamp-2">
                          {d.title}
                        </h3>
                        
                        {d.verse && (
                          <p className="text-xs text-gold-dark italic font-serif truncate mb-3">📖 {d.verse}</p>
                        )}
                        
                        <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                          {d.content.replace(/[#*`>_-]/g, "").trim()}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-medium shrink-0">
                        <span>Por: {d.author}</span>
                        <span className="text-gold font-bold">Leer más →</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* ── 4. Modal de Detalles de Devocional (Similar a Eventos) ── */}
      {selectedDevotional && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelectedDevotional(null)}
        >
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-200 max-h-[90vh]">
            
            <button 
              onClick={() => setSelectedDevotional(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-navy transition-colors md:text-gray-400 md:bg-transparent md:hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Left Header Banner */}
            <div className={cn(
              "w-full md:w-2/5 h-48 md:h-auto relative flex flex-col justify-end p-6 shrink-0",
              selectedDevotional.type === "quote" ? "bg-navy" : selectedDevotional.type === "challenge" ? "bg-gradient-to-br from-gold-dark via-gold to-gold-light" : "bg-navy-light"
            )}>
              {selectedDevotional.image && (
                <img 
                  src={selectedDevotional.image} 
                  alt={selectedDevotional.title || "Publicación"} 
                  className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-overlay"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-t md:from-black/90 md:to-black/30" />
              
              <div className="relative z-10 text-white">
                <span className={cn(
                  "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border",
                  selectedDevotional.type === "quote" 
                    ? "bg-navy/20 text-white border-white/20" 
                    : selectedDevotional.type === "challenge" 
                      ? "bg-gold-dark/30 text-white border-white/20" 
                      : "bg-green-50/10 text-white border-white/20"
                )}>
                  {selectedDevotional.type === "quote" && "Pensamiento"}
                  {selectedDevotional.type === "challenge" && "Reto de Lectura"}
                  {(selectedDevotional.type === "classic" || !selectedDevotional.type) && "Devocional"}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tight">
                  {selectedDevotional.type === "quote" ? "Pensamiento del Día" : selectedDevotional.title}
                </h2>
                
                <p className="text-white/60 text-xs mt-2 font-medium">
                  {new Date(selectedDevotional.date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>

            {/* Modal Right Content */}
            <div className="p-8 md:p-12 w-full md:w-3/5 overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              {selectedDevotional.type === "classic" && (selectedDevotional.verse || selectedDevotional.verseText) && (
                <blockquote className="border-l-4 border-gold pl-5 py-3 bg-gold/[0.03] rounded-r-2xl mb-6 font-serif">
                  {selectedDevotional.verseText && <p className="text-navy/85 italic leading-relaxed text-[15px]">&ldquo;{selectedDevotional.verseText}&rdquo;</p>}
                  {selectedDevotional.verse && <footer className="text-gold-dark text-xs font-bold mt-2 uppercase tracking-wider">— {selectedDevotional.verse}</footer>}
                </blockquote>
              )}

              <div 
                className="prose max-w-none text-gray-700 leading-relaxed text-[15px] space-y-4"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedDevotional.content) }}
              />

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Publicado por: <strong>{selectedDevotional.author}</strong></span>
                <span>Comunidad ICCI</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
