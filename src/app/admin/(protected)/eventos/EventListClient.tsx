"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Loader2,
  Search,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { EventForm } from "./EventForm";
import {
  deleteEvent,
  toggleEventFeatured,
  toggleEventPublished,
} from "@/actions/events";
import { cn } from "@/lib/utils";

function formatDate(ts: number | Date | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getMonthLabel(ts: number | Date | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleDateString("es-MX", { month: "long", timeZone: "UTC" });
}

const CATEGORIES = ["Todos", "Jóvenes", "Niños", "Varones", "Femenil", "General"];

export function EventListClient({ initialEvents }: { initialEvents: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  function handleEdit(event: any) {
    setEditingEvent(event);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      setBusyId(id);
      await deleteEvent(id);
      setBusyId(null);
      router.refresh();
    }
  }

  async function handleToggleFeatured(event: any) {
    setBusyId(event.id);
    await toggleEventFeatured(event.id, !event.featured);
    setBusyId(null);
    router.refresh();
  }

  async function handleTogglePublished(event: any) {
    setBusyId(event.id);
    await toggleEventPublished(event.id, !event.isPublished);
    setBusyId(null);
    router.refresh();
  }

  const filtered = initialEvents.filter((ev) => {
    const matchesCat = categoryFilter === "Todos" || ev.category === categoryFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (ev.title || "").toLowerCase().includes(q) ||
      (ev.location || "").toLowerCase().includes(q) ||
      (ev.description || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-gold" /> Gestión de Eventos
          </h1>
          <p className="text-gray-500 text-sm">
            Crea, edita, destaca u oculta los próximos eventos de la iglesia.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nuevo Evento
        </Button>
      </div>

      {/* Barra de filtros y búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                categoryFilter === cat
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar evento o lugar..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((event) => (
          <Card
            key={event.id}
            className={cn(
              "overflow-hidden flex flex-col group border border-gray-200/80 transition-all",
              !event.isPublished && "opacity-75 bg-gray-50"
            )}
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Calendar className="w-12 h-12" />
                </div>
              )}

              <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                {!event.isPublished && (
                  <span className="bg-gray-900/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    Oculto
                  </span>
                )}
                {event.featured && (
                  <span className="bg-gold text-navy text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                    <Star className="w-3 h-3 fill-navy" /> Destacado
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">
                  {event.category}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {getMonthLabel(event.startDate)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{event.title}</h3>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  {formatDate(event.startDate)} • {event.timeStr}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  {event.location}
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(event)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-navy bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button
                  onClick={() => handleToggleFeatured(event)}
                  disabled={busyId === event.id}
                  title={event.featured ? "Quitar destacado" : "Destacar evento"}
                  className={cn(
                    "p-2 rounded-xl border transition-colors cursor-pointer",
                    event.featured
                      ? "bg-gold/15 border-gold/40 text-gold-dark"
                      : "bg-white border-gray-200 text-gray-400 hover:text-gold"
                  )}
                >
                  <Star className={cn("w-4 h-4", event.featured && "fill-gold")} />
                </button>
                <button
                  onClick={() => handleTogglePublished(event)}
                  disabled={busyId === event.id}
                  title={event.isPublished ? "Ocultar del sitio público" : "Publicar en el sitio"}
                  className={cn(
                    "p-2 rounded-xl border transition-colors cursor-pointer",
                    event.isPublished
                      ? "bg-white border-gray-200 text-gray-500 hover:text-navy"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  )}
                >
                  {event.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={busyId === event.id}
                  title="Eliminar evento"
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {busyId === event.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-200/80">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">No se encontraron eventos</h3>
            <p className="text-gray-500 text-sm">
              Crea un nuevo evento o cambia los filtros de búsqueda.
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}
