"use client";

import { useState, useMemo } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  CalendarRange,
  Clock,
  Plus,
  Search,
  Layers,
  User,
  CheckCircle2,
  Edit3,
  Trash2,
  X,
  Loader2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  createPlanningEvent,
  updatePlanningEvent,
  deletePlanningEvent,
} from "@/actions/planning";
import { cn } from "@/lib/utils";
import type { PlanningEvent, Ministry } from "@/db/schema";

export function PlaneacionClient({
  initialEvents,
  ministriesList,
}: {
  initialEvents: PlanningEvent[];
  ministriesList: Ministry[];
}) {
  const [eventsList, setEventsList] = useState<PlanningEvent[]>(initialEvents);
  const [search, setSearch] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "all" | "past">("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlanningEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    timeStr: "",
    ministryId: "",
    responsible: "",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });

  const ministryMap = useMemo(() => {
    return new Map(ministriesList.map((m) => [m.id, m.name]));
  }, [ministriesList]);

  const now = new Date();
  const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const filteredEvents = useMemo(() => {
    return eventsList
      .filter((ev) => {
        // Ministry filter
        if (selectedMinistry !== "all") {
          if (ev.ministryId !== selectedMinistry) return false;
        }

        // Time filter
        const evDate = new Date(ev.date).getTime();
        if (timeFilter === "upcoming" && evDate < todayTimestamp) return false;
        if (timeFilter === "past" && evDate >= todayTimestamp) return false;

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const title = ev.title.toLowerCase();
          const desc = (ev.description || "").toLowerCase();
          const resp = (ev.responsible || "").toLowerCase();
          const minName = ev.ministryId ? (ministryMap.get(ev.ministryId) || "").toLowerCase() : "";
          if (!title.includes(q) && !desc.includes(q) && !resp.includes(q) && !minName.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [eventsList, selectedMinistry, timeFilter, search, todayTimestamp, ministryMap]);

  function openCreateModal() {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      timeStr: "",
      ministryId: ministriesList[0]?.id || "",
      responsible: "",
      status: "scheduled",
    });
    setIsModalOpen(true);
  }

  function openEditModal(ev: PlanningEvent) {
    setEditingEvent(ev);
    const dateObj = new Date(ev.date);
    const dateStr = !isNaN(dateObj.getTime())
      ? dateObj.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setFormData({
      title: ev.title,
      description: ev.description || "",
      date: dateStr,
      timeStr: ev.timeStr || "",
      ministryId: ev.ministryId || "",
      responsible: ev.responsible || "",
      status: ev.status,
    });
    setIsModalOpen(true);
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Por favor ingresa el título de la actividad.");
      return;
    }

    const timestamp = new Date(`${formData.date}T12:00:00Z`).getTime();

    try {
      if (editingEvent) {
        setIsUpdating(editingEvent.id);
        const res = await updatePlanningEvent(editingEvent.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          date: new Date(timestamp),
          timeStr: formData.timeStr.trim() || null,
          ministryId: formData.ministryId || null,
          responsible: formData.responsible.trim() || null,
          status: formData.status,
        });

        if (res.success) {
          setEventsList((prev) =>
            prev.map((item) =>
              item.id === editingEvent.id
                ? {
                    ...item,
                    title: formData.title.trim(),
                    description: formData.description.trim() || null,
                    date: new Date(timestamp),
                    timeStr: formData.timeStr.trim() || null,
                    ministryId: formData.ministryId || null,
                    responsible: formData.responsible.trim() || null,
                    status: formData.status,
                  }
                : item
            )
          );
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar.");
        }
      } else {
        setIsUpdating("new");
        const res = await createPlanningEvent({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          date: timestamp,
          timeStr: formData.timeStr.trim() || undefined,
          ministryId: formData.ministryId || undefined,
          responsible: formData.responsible.trim() || undefined,
          status: formData.status,
        });

        if (res.success && res.event) {
          setEventsList((prev) => [res.event, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al crear actividad.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta actividad de planeación?")) return;
    setIsUpdating(id);
    try {
      const res = await deletePlanningEvent(id);
      if (res.success) {
        setEventsList((prev) => prev.filter((ev) => ev.id !== id));
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <CalendarRange className="w-7 h-7 text-gold" /> Planeación y Agenda Interna
          </h1>
          <p className="text-gray-500 text-sm">
            Control de actividades ministeriales, reuniones de liderazgo y planeación interna de la iglesia.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Nueva Actividad
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        {/* Filtro de tiempo */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: `Todas (${eventsList.length})` },
            {
              key: "upcoming",
              label: `Próximas (${eventsList.filter((e) => new Date(e.date).getTime() >= todayTimestamp).length})`,
            },
            {
              key: "past",
              label: `Históricas / Pasadas (${eventsList.filter((e) => new Date(e.date).getTime() < todayTimestamp).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTimeFilter(tab.key as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                timeFilter === tab.key
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Buscador y selector de ministerio */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar actividad o responsable..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Layers className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedMinistry}
              onChange={(e) => setSelectedMinistry(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
            >
              <option value="all">Todos los Ministerios</option>
              {ministriesList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Actividades de Planeación */}
      <Card className="overflow-hidden border border-gray-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Actividad / Título</th>
                <th className="px-6 py-4 font-semibold">Ministerio</th>
                <th className="px-6 py-4 font-semibold">Responsable</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.map((ev) => {
                const dateObj = new Date(ev.date);
                const isUpcoming = dateObj.getTime() >= todayTimestamp;
                const minName = ev.ministryId ? ministryMap.get(ev.ministryId) || ev.ministryId : "General";

                return (
                  <tr key={ev.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-medium text-navy whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isUpcoming ? "text-gold" : "text-gray-400"
                          )}
                        />
                        <div>
                          <p className="font-bold text-navy">
                            {dateObj.toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          {ev.timeStr && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ev.timeStr}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-navy">{ev.title}</p>
                      {ev.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 whitespace-pre-line">
                          {ev.description}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-navy/5 text-navy border border-navy/10">
                        <Layers className="w-3 h-3 text-gold" />
                        {minName}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-600 whitespace-nowrap">
                      {ev.responsible ? (
                        <span className="flex items-center gap-1.5 font-medium">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {ev.responsible}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No especificado</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {ev.status === "scheduled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Programado
                        </span>
                      )}
                      {ev.status === "completed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Realizado
                        </span>
                      )}
                      {ev.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                          Cancelado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(ev)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                          title="Editar actividad"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          disabled={isUpdating === ev.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar actividad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <CalendarRange className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-navy">No se encontraron actividades de planeación.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal Crear / Editar Actividad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
                <CalendarRange className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  {editingEvent ? "Editar Actividad" : "Nueva Actividad de Planeación"}
                </h3>
                <p className="text-xs text-gray-500">
                  Agenda interna de actividades y compromisos ministeriales
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Reunión de liderazgo, Fogata, Cena fin de año"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Horario (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.timeStr}
                    onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                    placeholder="Ej. 06:30 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Ministerio Asignado
                  </label>
                  <select
                    value={formData.ministryId}
                    onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="">General / Iglesia</option>
                    {ministriesList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "scheduled" | "completed" | "cancelled",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="completed">Realizado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Responsable / Encargado
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Ej. Emmanuel Chavarría, Femenil y Jóvenes"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Notas / Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre comida, sonido, orden del día..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  disabled={isUpdating !== null}
                  className="bg-gold hover:bg-gold-dark text-navy font-bold px-5"
                >
                  {isUpdating !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                    </>
                  ) : (
                    "Guardar Actividad"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
