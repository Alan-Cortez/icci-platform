"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { createTestimony } from "@/actions/testimonies";
import { CommentSection } from "@/components/layout/CommentSection";
import { Card, Button } from "@/components/ui";
import { Heart, MessageCircle, Send, Loader2, Quote, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimoniosClientProps {
  initialTestimonies: any[];
}

export function TestimoniosClient({ initialTestimonies }: TestimoniosClientProps) {
  const { data: session } = useSession();
  const [testimonies, setTestimonies] = useState(initialTestimonies);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createTestimony(content);
      setSuccess(true);
      setContent("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      alert(err.message || "Error al enviar testimonio");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleComments(id: string) {
    setOpenComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      {/* ── 1. Navy Hero Header ── */}
      <div className="bg-navy relative overflow-hidden py-16 shrink-0 select-none">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <span className="text-[12rem] sm:text-[18rem] md:text-[24rem] font-black text-white leading-none tracking-tighter">
            ICCI
          </span>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.08),transparent_50%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold mb-3 animate-pulse">
            Poderosos testimonios de fe
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white font-black leading-none uppercase tracking-tight mb-4">
            Nuestras <span className="text-gold">Historias</span>
          </h1>
          <p className="text-white/60 text-xs sm:text-sm font-light max-w-md mx-auto leading-relaxed">
            Historias reales de fe, restauración y el obrar de Dios en las vidas de nuestra familia espiritual.
          </p>
        </div>
      </div>

      {/* ── 2. Grid Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Center Column: Testimonies List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-gold fill-gold" /> Historias Compartidas
            </h2>
            
            {testimonies.length === 0 ? (
              <Card className="p-12 text-center text-gray-400 bg-white border border-gray-100 rounded-3xl">
                <Quote className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                <p className="text-gray-500 italic">
                  Aún no se han publicado testimonios. ¡Sé el primero en compartir tu historia en la columna lateral!
                </p>
              </Card>
            ) : (
              testimonies.map((t) => (
                <Card 
                  key={t.id} 
                  className="p-6 bg-white border border-gray-100 rounded-3xl hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                >
                  {/* Decorative quote mark */}
                  <Quote className="absolute right-6 top-6 w-16 h-16 text-gray-100/70 -z-0 pointer-events-none group-hover:text-gold/5 transition-colors duration-300" />
                  
                  <div className="relative z-10">
                    {/* Author profile info */}
                    <div className="flex items-center gap-3 mb-4">
                      {t.user.image ? (
                        <img 
                          src={t.user.image} 
                          alt={t.user.name} 
                          className="w-10 h-10 rounded-full border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy">
                          {t.user.name?.[0] || "U"}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-navy">{t.user.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(t.createdAt).toLocaleDateString("es-MX", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Testimony content */}
                    <p className="text-gray-600 font-serif leading-relaxed italic text-[15px] whitespace-pre-line mb-6 pl-4 border-l-2 border-gold/40">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-50 pt-4 flex justify-between items-center">
                      <button 
                        onClick={() => toggleComments(t.id)}
                        className={cn(
                          "flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer",
                          openComments[t.id]
                            ? "bg-navy text-white"
                            : "bg-gray-50 text-navy hover:bg-gray-100"
                        )}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {openComments[t.id] ? "Ocultar Comentarios" : "Ver Comentarios / Comentar"}
                      </button>
                      <span className="text-[10px] text-gray-400 font-medium">Comunidad ICCI</span>
                    </div>

                    {/* Expandable comments panel */}
                    {openComments[t.id] && (
                      <div className="animate-in slide-in-from-top-3 duration-200">
                        <CommentSection testimonyId={t.id} />
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Right Column: Share form / Call to action */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-navy mb-4">Cuéntanos Tu Historia</h2>
            
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">¡Testimonio recibido!</p>
                  <p className="text-xs text-green-600 mt-1 leading-relaxed">
                    Tu historia se ha enviado al pastor para moderación y estará visible públicamente una vez sea aprobada. ¡Muchas gracias por compartir el obrar de Dios!
                  </p>
                </div>
              </div>
            )}

            {session?.user ? (
              <Card className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2">
                      Tu Testimonio o Historia de Fe
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Comparte cómo Dios ha obrado en tu vida, una respuesta a la oración, o una bendición especial..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 text-navy bg-gray-50 focus:bg-white transition-all text-sm resize-none"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting || !content.trim()} 
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Compartir Testimonio
                  </Button>
                  <p className="text-[10px] text-gray-400 text-center leading-relaxed mt-2 font-medium">
                    * Todo testimonio es moderado por el pastor de la iglesia antes de ser publicado en el muro principal.
                  </p>
                </form>
              </Card>
            ) : (
              <Card className="p-6 bg-white border border-gray-100 rounded-3xl text-center flex flex-col items-center justify-center gap-4 shadow-sm">
                <Heart className="w-12 h-12 text-gold animate-pulse" />
                <h3 className="font-bold text-navy text-base">Inicia sesión para compartir</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs font-light">
                  Para poder publicar tu testimonio de fe y comentar las reflexiones de la comunidad, inicia sesión de forma segura con tu cuenta de Google.
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy-light text-white text-sm font-semibold py-3 px-5 rounded-full hover:shadow-md transition-all cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Iniciar sesión con Google
                </button>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
