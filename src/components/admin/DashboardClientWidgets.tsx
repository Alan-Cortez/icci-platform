"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  BookOpen,
  CheckCircle2,
  Check,
  X,
  MessageCircle,
  Heart,
  Clock,
  Phone,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { EventForm } from "@/app/admin/(protected)/eventos/EventForm";
import { DevocionalForm } from "@/app/admin/(protected)/devocionales/DevocionalForm";
import { updatePrayerStatus } from "@/actions/prayers";
import { updateTestimonyStatus } from "@/actions/testimonies";

export function DashboardHeaderActions() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDevotionalModal, setShowDevotionalModal] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setShowEventModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white hover:bg-navy-light text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-gold" />
          Nuevo Evento
        </button>
        <button
          onClick={() => setShowDevotionalModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy hover:bg-gold-light text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          Publicar Devocional
        </button>
      </div>

      {showEventModal && (
        <EventForm onCancel={() => setShowEventModal(false)} />
      )}
      {showDevotionalModal && (
        <DevocionalForm onCancel={() => setShowDevotionalModal(false)} />
      )}
    </>
  );
}

interface QuickModerationProps {
  initialPendingPrayers: any[];
  initialPendingTestimonies: any[];
}

export function DashboardQuickModeration({
  initialPendingPrayers,
  initialPendingTestimonies,
}: QuickModerationProps) {
  const router = useRouter();
  const [prayers, setPrayers] = useState(initialPendingPrayers);
  const [testimonies, setTestimonies] = useState(initialPendingTestimonies);
  const [loadingPrayerId, setLoadingPrayerId] = useState<string | null>(null);
  const [loadingTestimonyId, setLoadingTestimonyId] = useState<string | null>(null);

  async function handleMarkPrayed(id: string) {
    setLoadingPrayerId(id);
    try {
      await updatePrayerStatus(id, "prayed");
      setPrayers((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } finally {
      setLoadingPrayerId(null);
    }
  }

  async function handleModerateTestimony(id: string, status: "approved" | "rejected") {
    setLoadingTestimonyId(id);
    try {
      await updateTestimonyStatus(id, status);
      setTestimonies((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } finally {
      setLoadingTestimonyId(null);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      {/* ── Peticiones de Oración Pendientes ──────────────────────────── */}
      <Card className="p-6 border border-gray-200/80 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-navy text-base">Oraciones por Atender</h2>
                {prayers.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-amber-100 text-amber-800">
                    {prayers.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Marca peticiones como oradas con un clic</p>
            </div>
          </div>
          <Link
            href="/admin/oracion"
            className="text-xs font-semibold text-navy hover:text-gold flex items-center gap-1 transition-colors"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {prayers.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-navy">¡Todo al día!</p>
            <p className="text-xs text-gray-500 mt-0.5">
              No hay solicitudes de oración pendientes en este momento.
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {prayers.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 hover:border-amber-300/80 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <p className="font-bold text-navy text-sm">{p.name}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {p.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {p.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkPrayed(p.id)}
                    disabled={loadingPrayerId === p.id}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loadingPrayerId === p.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Marcar Orada
                  </button>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 bg-white p-2.5 rounded-lg border border-gray-100">
                  {p.request}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Testimonios Pendientes de Moderación ──────────────────────── */}
      <Card className="p-6 border border-gray-200/80 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-200/60 flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-navy text-base">Moderación de Testimonios</h2>
                {testimonies.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-pink-100 text-pink-800">
                    {testimonies.length}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Aprueba o rechaza testimonios antes de publicarlos</p>
            </div>
          </div>
          <Link
            href="/admin/testimonios"
            className="text-xs font-semibold text-navy hover:text-gold flex items-center gap-1 transition-colors"
          >
            Ver todos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {testimonies.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <Sparkles className="w-8 h-8 text-gold mb-2" />
            <p className="text-sm font-semibold text-navy">Sin testimonios pendientes</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Todos los testimonios enviados han sido revisados.
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {testimonies.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 hover:border-pink-300/80 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-bold text-navy text-sm">
                      {t.userName || "Miembro de ICCI"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleModerateTestimony(t.id, "approved")}
                      disabled={loadingTestimonyId === t.id}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                      title="Aprobar testimonio"
                    >
                      {loadingTestimonyId === t.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleModerateTestimony(t.id, "rejected")}
                      disabled={loadingTestimonyId === t.id}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                      title="Rechazar testimonio"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic line-clamp-2 bg-white p-2.5 rounded-lg border border-gray-100">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
