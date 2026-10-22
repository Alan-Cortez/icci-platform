"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Radio, Play, ExternalLink, Calendar, Heart, MessageSquare, Video } from "lucide-react";
import { Button } from "@/components/ui";
import type { YoutubeLiveStatus } from "@/lib/youtube";

interface CampusLiveSectionProps {
  initialStatus: YoutubeLiveStatus;
}

export function CampusLiveSection({ initialStatus }: CampusLiveSectionProps) {
  const [status, setStatus] = useState<YoutubeLiveStatus>(initialStatus);

  // Poll API route every 60 seconds to detect when a broadcast starts
  useEffect(() => {
    let mounted = true;

    async function checkLive() {
      try {
        const res = await fetch("/api/youtube-live", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as YoutubeLiveStatus;
          if (mounted) {
            setStatus(data);
          }
        }
      } catch {
        // Silently keep current status on fetch error
      }
    }

    const intervalId = setInterval(checkLive, 60000);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const isLive = status.isLive;
  const liveVideoId = status.videoId;
  const channelUrl = status.channelUrl || "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu";
  const watchUrl = liveVideoId
    ? `https://www.youtube.com/watch?v=${liveVideoId}`
    : status.liveUrl || "https://www.youtube.com/@icctv-101/live";

  return (
    <section id="campus-online" className="mt-20 scroll-mt-24">
      {isLive ? (
        /* ═════════════════════════════════════════════════════════════════
           ESTADO: EN VIVO ACTIVO (Confirmado en tiempo real desde YouTube)
           ═════════════════════════════════════════════════════════════════ */
        <div className="relative rounded-3xl overflow-hidden bg-navy text-white shadow-2xl border-2 border-red-500/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_50%)] pointer-events-none" />

          {/* Banner de transmisión en vivo */}
          <div className="p-6 sm:p-10 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase bg-red-600 text-white shadow-lg shadow-red-600/30">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                </span>
                AHORA EN VIVO · ICCTV
              </div>

              <span className="text-white/60 text-xs font-medium">
                Transmisión oficial de Iglesia Comunidad de Cristo Internacional
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Reproductor de video en vivo */}
              <div className="lg:col-span-8">
                <div className="aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-2xl border border-white/10 relative">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${liveVideoId || "live_stream"}?autoplay=1&rel=0`}
                    title="ICCI Transmisión en Vivo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Controles e información del servicio */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-white font-bold leading-tight">
                    Servicio en Vivo <span className="text-gold">Campus en Línea</span>
                  </h3>
                  <p className="text-white/70 text-sm mt-3 leading-relaxed">
                    Acompáñanos en la alabanza, la Palabra y el tiempo de oración comunitaria. ¡Sé parte de lo que Dios está haciendo hoy!
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-xl"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Abrir en YouTube (Chat en vivo)
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/oracion"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-full transition-colors border border-white/10"
                    >
                      <Heart className="w-3.5 h-3.5 text-gold" />
                      Pedir oración
                    </Link>
                    <Link
                      href="/donaciones"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-full transition-colors border border-white/10"
                    >
                      Dar mi ofrenda
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════
           ESTADO: FUERA DE LÍNEA (Sin badges falsos de "en vivo")
           ═════════════════════════════════════════════════════════════════ */
        <div className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              
              {/* Información del Campus en Línea */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-navy/5 text-navy border border-navy/10 mb-4">
                    <Video className="w-3.5 h-3.5 text-gold" />
                    Campus en Línea · Transmisión Digital
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-navy font-bold leading-tight">
                    ¿No puedes acompañarnos <span className="text-gold">de manera presencial?</span>
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-3">
                    Nuestras transmisiones en vivo se emiten cada <strong className="text-navy font-semibold">Domingo a las 10:00 AM</strong> y en servicios especiales. Cuando comience la transmisión, podrás verla aquí en tiempo real.
                  </p>
                </div>

                {/* Tarjetas de horarios y estado */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-off-white border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">Servicio Dominical Principal</p>
                      <p className="text-xs text-gray-500">Domingos · 10:00 AM (Hora del Centro)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-off-white border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">Estado de Transmisión</p>
                      <p className="text-xs text-gray-500">
                        Fuera de línea en este momento · Próxima emisión el domingo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    href={channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    className="font-bold"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Ir al Canal de YouTube (@icctv-101)
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
                  </Button>

                  <Button
                    href="/oracion"
                    variant="outline"
                    className="text-xs font-bold"
                  >
                    <Heart className="w-4 h-4 mr-1.5 text-gold" />
                    Solicitar Oración
                  </Button>
                </div>
              </div>

              {/* Vista previa de video / Predicación reciente */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-navy text-white shadow-lg">
                  <div className="px-5 py-3.5 bg-navy-light flex items-center justify-between border-b border-white/10">
                    <span className="text-xs font-bold tracking-wider text-gold uppercase flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-current" />
                      Predicación destacada
                    </span>
                    <span className="text-[11px] text-white/50">Canal oficial ICCTV</span>
                  </div>

                  <div className="aspect-video w-full bg-black relative">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/MuLpLancL80?autoplay=0&rel=0"
                      title="ICCI Predicación Destacada"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <div className="p-4 sm:p-5 bg-navy">
                    <p className="font-bold text-white text-sm sm:text-base">
                      La Aguja Que Desinfla Mi Ego · Pastor Oscar Sosa
                    </p>
                    <p className="text-white/60 text-xs mt-1 font-light">
                      Disfruta de este mensaje y conéctate con la Palabra de Dios mientras llega nuestra próxima transmisión en vivo.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
