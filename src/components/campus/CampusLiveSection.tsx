"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Radio,
  Play,
  ExternalLink,
  Calendar,
  Heart,
  Video,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import type { YoutubeLiveStatus, YoutubeStreamItem } from "@/lib/youtube";

interface CampusLiveSectionProps {
  initialStatus: YoutubeLiveStatus;
}

export function CampusLiveSection({ initialStatus }: CampusLiveSectionProps) {
  const [status, setStatus] = useState<YoutubeLiveStatus>(initialStatus);

  // Active selected video for preview (defaults to latest broadcast)
  const defaultVideo: YoutubeStreamItem = status.latestVideo ||
    status.recentStreams?.[0] || {
      videoId: "FGd6mF5Qm-A",
      title: "Cielos abiertos",
      subtitle: "Última reunión transmitida",
      url: "https://www.youtube.com/watch?v=FGd6mF5Qm-A",
    };

  const [selectedVideo, setSelectedVideo] = useState<YoutubeStreamItem>(defaultVideo);

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
            if (data.latestVideo && (!selectedVideo || selectedVideo.videoId === defaultVideo.videoId)) {
              setSelectedVideo(data.latestVideo);
            }
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
  }, [defaultVideo.videoId, selectedVideo]);

  const isLive = status.isLive;
  const liveVideoId = status.videoId;
  const channelUrl = status.channelUrl || "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu";
  const watchLiveUrl = liveVideoId
    ? `https://www.youtube.com/watch?v=${liveVideoId}`
    : status.liveUrl || "https://www.youtube.com/@icctv-101/live";

  const streams = status.recentStreams && status.recentStreams.length > 0
    ? status.recentStreams
    : [defaultVideo];

  return (
    <section id="transmision" className="mt-20 scroll-mt-24 relative">
      {/* Anchor invisible para compatibilidad con enlaces anteriores */}
      <span id="campus-online" className="absolute -top-24 pointer-events-none" />

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
                    Transmisión <span className="text-gold">en Vivo</span>
                  </h3>
                  <p className="text-white/70 text-sm mt-3 leading-relaxed">
                    Acompáñanos en la alabanza, la Palabra y el tiempo de oración comunitaria. ¡Sé parte de lo que Dios está haciendo hoy!
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={watchLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md hover:shadow-xl"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Abrir en YouTube (Chat en vivo)
                    <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </a>

                  <div>
                    <Link
                      href="/oracion"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 rounded-full transition-colors border border-white/10"
                    >
                      <Heart className="w-3.5 h-3.5 text-gold" />
                      Pedir oración
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ═════════════════════════════════════════════════════════════════
           ESTADO: FUERA DE LÍNEA (Muestra el último en vivo de cada reunión)
           ═════════════════════════════════════════════════════════════════ */
        <div className="rounded-3xl bg-white border border-gray-100 shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              
              {/* Información de Transmisiones */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-navy/5 text-navy border border-navy/10 mb-4">
                    <Video className="w-3.5 h-3.5 text-gold" />
                    Transmisión en YouTube · ICCTV
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-navy font-bold leading-tight">
                    ¿No puedes acompañarnos <span className="text-gold">de manera presencial?</span>
                  </h3>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-3">
                    Nuestras reuniones se transmiten en vivo cada <strong className="text-navy font-semibold">Jueves a las 7:00 PM</strong> y <strong className="text-navy font-semibold">Domingos a las 10:00 AM</strong> a través de nuestro canal de YouTube. Podrás sintonizar cada culto en tiempo real o revivir el último en vivo aquí mismo.
                  </p>
                </div>

                {/* Tarjetas de horarios de transmisión: JUEVES 7PM Y DOMINGO 10AM */}
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Tarjeta Jueves */}
                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-off-white border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm">Reunión de Jueves</p>
                        <p className="text-xs text-gray-500 font-medium">Jueves · 7:00 PM</p>
                      </div>
                    </div>

                    {/* Tarjeta Domingo */}
                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-off-white border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm">Servicio Dominical</p>
                        <p className="text-xs text-gray-500 font-medium">Domingos · 10:00 AM</p>
                      </div>
                    </div>
                  </div>

                  {/* Estado actual de la transmisión */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-off-white border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">Estado de Transmisión</p>
                      <p className="text-xs text-gray-500">
                        Fuera de línea en este momento · Próxima emisión: Jueves 7:00 PM o Domingo 10:00 AM
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

              {/* Vista previa: ÚLTIMO EN VIVO TRANSMITIDO */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-navy text-white shadow-lg">
                  {/* Barra superior de la vista */}
                  <div className="px-5 py-3.5 bg-navy-light flex items-center justify-between border-b border-white/10">
                    <span className="text-xs font-bold tracking-wider text-gold uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Última reunión en vivo
                    </span>
                    <span className="text-[11px] text-white/50">Canal oficial ICCTV</span>
                  </div>

                  {/* Reproductor de YouTube con el último en vivo dinámico */}
                  <div className="aspect-video w-full bg-black relative">
                    <iframe
                      key={selectedVideo.videoId}
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=0&rel=0`}
                      title={selectedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Información del video actual */}
                  <div className="p-4 sm:p-5 bg-navy border-b border-white/5">
                    <p className="font-bold text-white text-base leading-snug">
                      {selectedVideo.title}
                    </p>
                    {selectedVideo.subtitle && (
                      <p className="text-white/60 text-xs mt-1 font-light">
                        {selectedVideo.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Selector interactivo de transmisiones recientes si hay más de una */}
                  {streams.length > 1 && (
                    <div className="p-4 bg-navy-light/60">
                      <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">
                        Otras reuniones transmitidas recientemente:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {streams.slice(0, 4).map((s) => {
                          const isSelected = s.videoId === selectedVideo.videoId;
                          return (
                            <button
                              key={s.videoId}
                              onClick={() => setSelectedVideo(s)}
                              className={`text-xs px-3 py-1.5 rounded-lg text-left transition-all cursor-pointer font-medium truncate max-w-full ${
                                isSelected
                                  ? "bg-gold text-navy font-bold shadow-sm"
                                  : "bg-white/5 hover:bg-white/15 text-white/80 border border-white/10"
                              }`}
                              title={s.title}
                            >
                              ▶ {s.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
