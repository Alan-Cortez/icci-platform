"use client";

import type { Metadata } from "next";
import { BookOpen, Quote as QuoteIcon, Trophy, BookOpenCheck } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui";

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
  html = html.replace(/(?:^|\n)###\s*(.*)/g, '\n<h4 class="text-lg font-black text-navy mt-6 mb-3 uppercase tracking-tight">$1</h4>');
  
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
  return (
    <div className="py-16 bg-off-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center shadow-sm">
            <BookOpenCheck className="w-8 h-8 text-gold" />
          </div>
        </div>
        
        <SectionHeading
          subtitle="Alimento espiritual diario"
          title="Devocionales y Pensamientos"
          description="Reflexiones, lecturas bíblicas y frases diarias de nuestros pastores para fortalecer tu caminar con Dios."
        />

        <div className="space-y-12 mt-10">
          {initialDevotionals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-400">
              No hay publicaciones disponibles en este momento.
            </div>
          ) : (
            initialDevotionals.map((d, i) => {
              const dateStr = new Date(d.date).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // --- TYPE 1: QUOTE / PENSIAMIENTO ---
              if (d.type === "quote") {
                return (
                  <Card key={d.id} className="p-8 md:p-10 border-t-4 border-t-navy relative overflow-hidden shadow-md bg-white rounded-3xl">
                    {/* Background decoration */}
                    <div className="absolute right-6 top-6 text-navy/[0.03] font-serif text-[12rem] leading-none pointer-events-none select-none font-bold">
                      “
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy/5 text-navy border border-navy/10">
                          Pensamiento
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold">{dateStr}</span>
                      </div>
                      
                      <div 
                        className="font-serif text-xl sm:text-2xl text-navy italic leading-relaxed text-center py-4 px-2"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(d.content) }}
                      />
                      
                      {/* Author Info */}
                      <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                        {d.image ? (
                          <img 
                            src={d.image} 
                            alt={d.author} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center border-2 border-gold shadow-sm">
                            <span className="text-gold font-bold text-sm">
                              {d.author.split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                        <div className="text-left">
                          <p className="text-sm font-bold text-navy leading-none mb-1">{d.author}</p>
                          <p className="text-xs text-gray-400">Pastor ICCI</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }

              // --- TYPE 2: CHALLENGE / RETO DE LECTURA ---
              if (d.type === "challenge") {
                return (
                  <Card key={d.id} className="p-8 md:p-10 border-t-4 border-t-gold bg-white shadow-md rounded-3xl relative overflow-hidden">
                    {/* Background Trophy icon watermark */}
                    <div className="absolute right-6 top-6 text-gold/[0.04] pointer-events-none select-none">
                      <Trophy className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold-dark border border-gold/20">
                          Reto de Lectura
                        </span>
                        <span className="text-[11px] text-gray-400 font-semibold">{dateStr}</span>
                      </div>
                      
                      <h3 className="text-2xl sm:text-3xl font-black text-navy uppercase tracking-tight mb-2">
                        {d.title}
                      </h3>
                      <div className="divider-gold mb-6" />

                      {d.image && (
                        <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 aspect-video max-h-[300px]">
                          <img src={d.image} alt={d.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      <div 
                        className="prose max-w-none text-navy"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(d.content) }}
                      />
                      
                      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
                        <span>Liderado por: {d.author}</span>
                        <span>Lectura diaria</span>
                      </div>
                    </div>
                  </Card>
                );
              }

              // --- TYPE 3: CLASSIC / DEVOCIONAL CLÁSICO ---
              return (
                <Card key={d.id} className={`p-8 md:p-10 bg-white rounded-3xl shadow-sm border border-gray-100 ${i === 0 ? "ring-2 ring-gold/20 shadow-md" : ""}`}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                      Devocional
                    </span>
                    <span className="text-[11px] text-gray-400 font-semibold">{dateStr}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-navy tracking-tight mb-2 uppercase">{d.title}</h3>
                  <p className="text-xs text-gray-500 font-medium mb-6">Por {d.author}</p>
                  
                  {d.image && (
                    <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 aspect-video max-h-[300px]">
                      <img src={d.image} alt={d.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {(d.verse || d.verseText) && (
                    <blockquote className="border-l-4 border-gold pl-5 py-3 bg-gold/[0.03] rounded-r-2xl mb-6 font-serif">
                      {d.verseText && <p className="text-navy/80 italic leading-relaxed text-[15px]">&ldquo;{d.verseText}&rdquo;</p>}
                      {d.verse && <footer className="text-gold-dark text-xs font-bold mt-2 uppercase tracking-wider">— {d.verse}</footer>}
                    </blockquote>
                  )}

                  <div 
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(d.content) }}
                  />
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
