"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import {
  Trash2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Loader2,
  Search,
  CheckCheck,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import {
  deletePrayerRequest,
  updatePrayerStatus,
  markAllPrayersAsPrayed,
} from "@/actions/prayers";
import { cn } from "@/lib/utils";

export function PrayerListClient({ initialPrayers }: { initialPrayers: any[] }) {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "prayed">("all");
  const [search, setSearch] = useState("");

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "prayed" : "pending";
    setLoadingId(id);
    try {
      await updatePrayerStatus(id, newStatus as "pending" | "prayed");
      setPrayers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleMarkAllPrayed() {
    if (!confirm("¿Marcar todas las peticiones pendientes como oradas?")) return;
    setMarkingAll(true);
    try {
      await markAllPrayersAsPrayed();
      setPrayers((prev) => prev.map((p) => ({ ...p, status: "prayed" })));
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar esta petición?")) {
      setLoadingId(id);
      try {
        await deletePrayerRequest(id);
        setPrayers((prev) => prev.filter((p) => p.id !== id));
      } finally {
        setLoadingId(null);
      }
    }
  }

  const pendingCount = prayers.filter((p) => p.status === "pending").length;
  const prayedCount = prayers.filter((p) => p.status === "prayed").length;

  const filtered = prayers.filter((p) => {
    const matchesStatus = filter === "all" || p.status === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.name || "").toLowerCase().includes(q) ||
      (p.request || "").toLowerCase().includes(q) ||
      (p.phone || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <MessageCircle className="w-7 h-7 text-gold" /> Solicitudes de Oración
          </h1>
          <p className="text-gray-500 text-sm">
            Administra las peticiones, testimonios y agradecimientos de la congregación.
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            onClick={handleMarkAllPrayed}
            disabled={markingAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Marcar todas como oradas ({pendingCount})
          </button>
        )}
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todas", count: prayers.length },
            { key: "pending", label: "Pendientes", count: pendingCount },
            { key: "prayed", label: "Oradas", count: prayedCount },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                filter === tab.key
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  filter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o petición..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {filtered.map((prayer) => {
          const cleanPhone = prayer.phone ? prayer.phone.replace(/\D/g, "") : "";
          return (
            <Card
              key={prayer.id}
              className={cn(
                "p-6 transition-all border border-gray-200/80 flex flex-col justify-between",
                prayer.status === "prayed" ? "bg-gray-50/70 opacity-85" : "bg-white"
              )}
            >
              <div>
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-navy text-lg">{prayer.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(prayer.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {prayer.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {prayer.phone}
                        </span>
                      )}
                      {prayer.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {prayer.email}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(prayer.id, prayer.status)}
                      disabled={loadingId === prayer.id}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer",
                        prayer.status === "pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      )}
                    >
                      {loadingId === prayer.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : prayer.status === "pending" ? (
                        "Marcar como Orada"
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" /> Orada
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(prayer.id)}
                      disabled={loadingId === prayer.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar petición"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {prayer.request}
                </div>
              </div>

              {cleanPhone && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end">
                  <a
                    href={`https://wa.me/${cleanPhone.length === 10 ? "52" + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                      `Hola ${prayer.name}, te saludamos de ICCI. Queremos que sepas que estamos orando por tu petición.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Enviar mensaje por WhatsApp
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="lg:col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-200/80">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">No se encontraron peticiones</h3>
            <p className="text-gray-500 text-sm">
              No hay solicitudes de oración que coincidan con el filtro seleccionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
