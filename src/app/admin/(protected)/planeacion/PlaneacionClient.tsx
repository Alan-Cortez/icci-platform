"use client";

import { useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
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
  Calendar as CalendarIcon,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  List,
  LayoutGrid,
  Eye,
} from "lucide-react";
import {
  createPlanningEvent,
  updatePlanningEvent,
  deletePlanningEvent,
} from "@/actions/planning";
import { cn } from "@/lib/utils";
import type { PlanningEvent, Ministry } from "@/db/schema";

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEKDAYS_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const MINISTRY_COLORS = [
  "bg-blue-50 text-blue-800 border-blue-200",
  "bg-purple-50 text-purple-800 border-purple-200",
  "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bg-amber-50 text-amber-800 border-amber-200",
  "bg-rose-50 text-rose-800 border-rose-200",
  "bg-cyan-50 text-cyan-800 border-cyan-200",
  "bg-indigo-50 text-indigo-800 border-indigo-200",
  "bg-orange-50 text-orange-800 border-orange-200",
  "bg-teal-50 text-teal-800 border-teal-200",
  "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
];

function toDateKeyUTC(d: Date | number): string {
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function PlaneacionClient({
  initialEvents,
  ministriesList,
  userRole,
  accessibleMinistryIds,
}: {
  initialEvents: PlanningEvent[];
  ministriesList: Ministry[];
  userRole: string;
  accessibleMinistryIds: string[] | null;
}) {
  const isLeader = userRole === "leader";
  const now = new Date();

  const [eventsList, setEventsList] = useState<PlanningEvent[]>(initialEvents);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-11
  const [listAllMonths, setListAllMonths] = useState<boolean>(false);
  const [selectedMinistry, setSelectedMinistry] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "all" | "past">("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlanningEvent | null>(null);
  const [readOnlyEvent, setReadOnlyEvent] = useState<PlanningEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: now.toISOString().split("T")[0],
    timeStr: "",
    ministryId: "",
    responsible: "",
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });

  const editableMinistries = useMemo(() => {
    if (accessibleMinistryIds === null) return ministriesList;
    return ministriesList.filter((m) => accessibleMinistryIds.includes(m.id));
  }, [ministriesList, accessibleMinistryIds]);

  const ministryMap = useMemo(() => {
    return new Map(ministriesList.map((m) => [m.id, m.name]));
  }, [ministriesList]);

  const ministryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    ministriesList.forEach((m, idx) => {
      map.set(m.id, MINISTRY_COLORS[idx % MINISTRY_COLORS.length]);
    });
    return map;
  }, [ministriesList]);

  function getMinistryBadgeClass(ministryId: string | null): string {
    if (!ministryId) return "bg-gray-100 text-gray-700 border-gray-200";
    return ministryColorMap.get(ministryId) || "bg-navy/5 text-navy border-navy/15";
  }

  function canEditEvent(ev: PlanningEvent): boolean {
    if (accessibleMinistryIds === null) return true;
    return Boolean(ev.ministryId && accessibleMinistryIds.includes(ev.ministryId));
  }

  const todayTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Events filtered by ministry & search (used by Calendar for the selected month)
  const calendarMonthEvents = useMemo(() => {
    const map = new Map<string, PlanningEvent[]>();

    for (const ev of eventsList) {
      if (selectedMinistry !== "all" && ev.ministryId !== selectedMinistry) continue;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const minName = ev.ministryId ? (ministryMap.get(ev.ministryId) || "").toLowerCase() : "";
        if (
          !ev.title.toLowerCase().includes(q) &&
          !(ev.description || "").toLowerCase().includes(q) &&
          !(ev.responsible || "").toLowerCase().includes(q) &&
          !minName.includes(q)
        ) {
          continue;
        }
      }

      const d = new Date(ev.date);
      if (d.getUTCFullYear() !== selectedYear || d.getUTCMonth() !== selectedMonth) continue;

      const key = toDateKeyUTC(d);
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }

    return map;
  }, [eventsList, selectedMinistry, search, selectedYear, selectedMonth, ministryMap]);

  // Conflict counts per day across ALL ministries (ignoring active ministry filter so clashes are never hidden)
  const allScheduledCountsByDay = useMemo(() => {
    const map = new Map<string, PlanningEvent[]>();
    for (const ev of eventsList) {
      if (ev.status === "cancelled") continue;
      const key = toDateKeyUTC(ev.date);
      const list = map.get(key) || [];
      list.push(ev);
      map.set(key, list);
    }
    return map;
  }, [eventsList]);

  // Events filtered for List View
  const filteredListEvents = useMemo(() => {
    return eventsList
      .filter((ev) => {
        if (selectedMinistry !== "all" && ev.ministryId !== selectedMinistry) return false;

        if (!listAllMonths) {
          const d = new Date(ev.date);
          if (d.getUTCFullYear() !== selectedYear || d.getUTCMonth() !== selectedMonth) {
            return false;
          }
        }

        const evDate = new Date(ev.date).getTime();
        if (timeFilter === "upcoming" && evDate < todayTimestamp) return false;
        if (timeFilter === "past" && evDate >= todayTimestamp) return false;

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const minName = ev.ministryId ? (ministryMap.get(ev.ministryId) || "").toLowerCase() : "";
          if (
            !ev.title.toLowerCase().includes(q) &&
            !(ev.description || "").toLowerCase().includes(q) &&
            !(ev.responsible || "").toLowerCase().includes(q) &&
            !minName.includes(q)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [
    eventsList,
    selectedMinistry,
    listAllMonths,
    selectedYear,
    selectedMonth,
    timeFilter,
    todayTimestamp,
    search,
    ministryMap,
  ]);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayWeekday = new Date(Date.UTC(selectedYear, selectedMonth, 1)).getUTCDay(); // 0=Sun..6=Sat
    const daysInMonth = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0)).getUTCDate();

    const cells: Array<{ day: number | null; dateKey: string | null }> = [];
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({ day: null, dateKey: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const mStr = String(selectedMonth + 1).padStart(2, "0");
      const dStr = String(day).padStart(2, "0");
      cells.push({ day, dateKey: `${selectedYear}-${mStr}-${dStr}` });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, dateKey: null });
    }
    return cells;
  }, [selectedYear, selectedMonth]);

  // Same-day conflicts inside Modal
  const modalSameDayEvents = useMemo(() => {
    if (!formData.date) return [];
    const sameDay = allScheduledCountsByDay.get(formData.date) || [];
    return sameDay.filter((ev) => !editingEvent || ev.id !== editingEvent.id);
  }, [formData.date, allScheduledCountsByDay, editingEvent]);

  const yearOptions = useMemo(() => {
    const set = new Set<number>([now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]);
    eventsList.forEach((ev) => set.add(new Date(ev.date).getUTCFullYear()));
    return Array.from(set).sort();
  }, [eventsList, now]);

  function handlePrevMonth() {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  function handleGoToday() {
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
    setListAllMonths(false);
  }

  function openCreateModal(prefillDate?: string) {
    if (isLeader && editableMinistries.length === 0) {
      alert("Aún no tienes un ministerio asignado para crear actividades.");
      return;
    }

    const defaultDate =
      prefillDate ||
      `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(
        Math.min(now.getDate(), 28)
      ).padStart(2, "0")}`;

    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: defaultDate,
      timeStr: "",
      ministryId: editableMinistries[0]?.id || "",
      responsible: "",
      status: "scheduled",
    });
    setIsModalOpen(true);
  }

  function handleEventClick(ev: PlanningEvent) {
    if (canEditEvent(ev)) {
      openEditModal(ev);
    } else {
      setReadOnlyEvent(ev);
    }
  }

  function openEditModal(ev: PlanningEvent) {
    setEditingEvent(ev);
    const dateStr = toDateKeyUTC(ev.date);

    setFormData({
      title: ev.title,
      description: ev.description || "",
      date: dateStr,
      timeStr: ev.timeStr || "",
      ministryId: ev.ministryId || editableMinistries[0]?.id || "",
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
          setEventsList((prev) => [res.event!, ...prev]);
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
        setIsModalOpen(false);
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setIsUpdating(null);
    }
  }

  // Count events in current month for quick summary
  const totalInCurrentMonth = useMemo(() => {
    let count = 0;
    calendarMonthEvents.forEach((arr) => {
      count += arr.length;
    });
    return count;
  }, [calendarMonthEvents]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <CalendarRange className="w-7 h-7 text-gold" /> Calendario de Planeación
          </h1>
          <p className="text-gray-500 text-sm">
            {isLeader
              ? "Consulta las fechas de todos los ministerios para evitar choques y agenda las actividades de tu ministerio."
              : "Calendario general por mes y por ministerio para coordinar actividades sin empalmes."}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Toggle */}
          <div className="inline-flex bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "calendar" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Calendario
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "list" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <List className="w-3.5 h-3.5" /> Lista
            </button>
          </div>

          <Button
            onClick={() => openCreateModal()}
            className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Nueva Actividad
          </Button>
        </div>
      </div>

      {/* Barra de Controles: Mes, Año, Ministerio y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Selector de Mes y Año */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-navy cursor-pointer"
              title="Mes anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <select
              value={listAllMonths && viewMode === "list" ? "all" : selectedMonth}
              onChange={(e) => {
                if (e.target.value === "all") {
                  setListAllMonths(true);
                } else {
                  setListAllMonths(false);
                  setSelectedMonth(parseInt(e.target.value, 10));
                }
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {viewMode === "list" && <option value="all">Todos los meses</option>}
              {MONTHS_ES.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-navy bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-navy cursor-pointer"
              title="Mes siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleGoToday}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-navy cursor-pointer"
            >
              Hoy
            </button>

            {viewMode === "calendar" && (
              <span className="text-xs font-semibold text-gray-500 ml-1">
                {totalInCurrentMonth} evento(s) en {MONTHS_ES[selectedMonth]}
              </span>
            )}
          </div>

          {/* Filtro por Ministerio y Búsqueda */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {isLeader && accessibleMinistryIds && accessibleMinistryIds.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedMinistry(
                    selectedMinistry === accessibleMinistryIds[0]
                      ? "all"
                      : accessibleMinistryIds[0]
                  )
                }
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer whitespace-nowrap",
                  selectedMinistry === accessibleMinistryIds[0]
                    ? "bg-gold text-navy border-gold"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                )}
              >
                {selectedMinistry === accessibleMinistryIds[0]
                  ? "Viendo: Solo Mi Ministerio"
                  : "Filtrar: Solo Mi Ministerio"}
              </button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Layers className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                value={selectedMinistry}
                onChange={(e) => setSelectedMinistry(e.target.value)}
                className="w-full sm:w-56 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              >
                <option value="all">Todos los Ministerios</option>
                {ministriesList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar evento..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── VISTA CALENDARIO MENSUAL ─────────────────────────────────────── */}
      {viewMode === "calendar" && (
        <Card className="overflow-hidden border border-gray-200/80 shadow-xs bg-white">
          {/* Cabecera Días de la Semana */}
          <div className="grid grid-cols-7 bg-navy text-white text-center border-b border-navy">
            {WEEKDAYS_SHORT.map((dayName) => (
              <div key={dayName} className="py-3 text-xs font-bold uppercase tracking-wider">
                {dayName}
              </div>
            ))}
          </div>

          {/* Celdas del Mes */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
            {calendarDays.map((cell, idx) => {
              if (!cell.day || !cell.dateKey) {
                return <div key={`empty-${idx}`} className="min-h-[110px] sm:min-h-[130px] bg-gray-50/50" />;
              }

              const dayEvents = calendarMonthEvents.get(cell.dateKey) || [];
              const totalEventsAnyMinistry = (allScheduledCountsByDay.get(cell.dateKey) || []).length;
              const hasMultipleMinistriesClash = totalEventsAnyMinistry > 1;
              const isToday = cell.dateKey === todayKey;

              return (
                <div
                  key={cell.dateKey}
                  className={cn(
                    "min-h-[115px] sm:min-h-[135px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors group",
                    isToday ? "bg-gold/5" : "bg-white hover:bg-gray-50/40"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center",
                          isToday ? "bg-navy text-gold" : "text-gray-700"
                        )}
                      >
                        {cell.day}
                      </span>

                      <div className="flex items-center gap-1">
                        {hasMultipleMinistriesClash && (
                          <span
                            className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200"
                            title={`${totalEventsAnyMinistry} actividades programadas este día`}
                          >
                            <AlertTriangle className="w-2.5 h-2.5" /> {totalEventsAnyMinistry}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => openCreateModal(cell.dateKey!)}
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md hover:bg-gold/20 text-navy transition-opacity cursor-pointer"
                          title={`Agendar el ${cell.day} de ${MONTHS_ES[selectedMonth]}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Lista de eventos del día */}
                    <div className="space-y-1">
                      {dayEvents.map((ev) => {
                        const minName = ev.ministryId
                          ? ministryMap.get(ev.ministryId) || "General"
                          : "General";
                        const editable = canEditEvent(ev);
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() => handleEventClick(ev)}
                            className={cn(
                              "w-full text-left px-1.5 py-1 rounded-lg border text-[10px] leading-tight transition-all cursor-pointer block",
                              getMinistryBadgeClass(ev.ministryId),
                              ev.status === "cancelled" && "opacity-50 line-through",
                              editable ? "hover:ring-1 hover:ring-navy/40" : "opacity-85 hover:opacity-100"
                            )}
                            title={`${ev.title} (${minName})${ev.timeStr ? ` - ${ev.timeStr}` : ""}`}
                          >
                            <span className="font-bold block truncate">{ev.title}</span>
                            <span className="text-[9px] opacity-80 block truncate">
                              {minName}
                              {ev.timeStr ? ` • ${ev.timeStr}` : ""}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── VISTA LISTA ─────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {/* Tabs de Próximas / Todas / Pasadas */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: `Todas (${filteredListEvents.length})` },
              { key: "upcoming", label: "Próximas" },
              { key: "past", label: "Históricas / Pasadas" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTimeFilter(tab.key as any)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                  timeFilter === tab.key
                    ? "bg-navy text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
                  {filteredListEvents.map((ev) => {
                    const dateObj = new Date(ev.date);
                    const isUpcoming = dateObj.getTime() >= todayTimestamp;
                    const minName = ev.ministryId
                      ? ministryMap.get(ev.ministryId) || ev.ministryId
                      : "General";
                    const editable = canEditEvent(ev);
                    const dayKey = toDateKeyUTC(ev.date);
                    const hasClash = (allScheduledCountsByDay.get(dayKey) || []).length > 1;

                    return (
                      <tr key={ev.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 font-medium text-navy whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <CalendarIcon
                              className={cn(
                                "w-4 h-4 shrink-0",
                                isUpcoming ? "text-gold" : "text-gray-400"
                              )}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-navy">
                                  {dateObj.toLocaleDateString("es-MX", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}
                                </p>
                                {hasClash && (
                                  <span
                                    className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold"
                                    title="Múltiples eventos en esta fecha"
                                  >
                                    Múltiple
                                  </span>
                                )}
                              </div>
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
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border",
                              getMinistryBadgeClass(ev.ministryId)
                            )}
                          >
                            <Layers className="w-3 h-3" />
                            {minName}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{ev.responsible || "Liderazgo"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {ev.status === "scheduled" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                              <Clock className="w-3 h-3" /> Programada
                            </span>
                          )}
                          {ev.status === "completed" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                              <CheckCircle2 className="w-3 h-3" /> Realizada
                            </span>
                          )}
                          {ev.status === "cancelled" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200/70">
                              <AlertTriangle className="w-3 h-3" /> Cancelada
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {editable ? (
                              <>
                                <button
                                  onClick={() => openEditModal(ev)}
                                  className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-xl transition-colors"
                                  title="Editar actividad"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(ev.id)}
                                  disabled={isUpdating === ev.id}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                  title="Eliminar actividad"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setReadOnlyEvent(ev)}
                                className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl transition-colors"
                                title="Ver detalle"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredListEvents.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <CalendarRange className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-navy">
                    No se encontraron actividades para estos filtros.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Modal Crear / Editar Actividad de Planeación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
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
                  Registra actividades ministeriales y verifica que no choquen con otras fechas
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Título / Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Reunión de liderazgo, Congreso, Ayuno"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Hora (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.timeStr}
                    onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                    placeholder="Ej. 7:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              {/* Aviso de posible choque de fechas con otros ministerios */}
              {modalSameDayEvents.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1.5">
                  <p className="text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    Aviso: Ya hay {modalSameDayEvents.length} actividad(es) agendada(s) en esta fecha:
                  </p>
                  <ul className="space-y-1 pl-5 list-disc text-[11px]">
                    {modalSameDayEvents.map((ev) => (
                      <li key={ev.id}>
                        <span className="font-bold">{ev.title}</span>{" "}
                        ({ev.ministryId ? ministryMap.get(ev.ministryId) || "General" : "General"})
                        {ev.timeStr ? ` — ${ev.timeStr}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Ministerio Responsable
                  </label>
                  <select
                    value={formData.ministryId}
                    disabled={isLeader && editableMinistries.length <= 1}
                    onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white disabled:bg-gray-100"
                  >
                    {!isLeader && <option value="">Sin ministerio (General)</option>}
                    {editableMinistries.map((m) => (
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
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="scheduled">Programada</option>
                    <option value="completed">Realizada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Hermano(a) Responsable (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  placeholder="Ej. Liderazgo, Pastores, Nombre del encargado"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Notas / Detalles de Planeación
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles logísticos, encargos, notas internas..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div>
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingEvent.id)}
                      disabled={isUpdating !== null}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
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
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Solo Lectura (cuando un Líder consulta evento de otro ministerio) */}
      {readOnlyEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setReadOnlyEvent(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border mb-2",
                  getMinistryBadgeClass(readOnlyEvent.ministryId)
                )}
              >
                <Layers className="w-3 h-3" />
                {readOnlyEvent.ministryId
                  ? ministryMap.get(readOnlyEvent.ministryId) || "General"
                  : "General"}
              </span>
              <h3 className="text-xl font-black text-navy">{readOnlyEvent.title}</h3>
            </div>

            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gold shrink-0" />
                <span className="font-semibold text-navy">
                  {new Date(readOnlyEvent.date).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
              </p>
              {readOnlyEvent.timeStr && (
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>{readOnlyEvent.timeStr}</span>
                </p>
              )}
              {readOnlyEvent.responsible && (
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gold shrink-0" />
                  <span>Responsable: {readOnlyEvent.responsible}</span>
                </p>
              )}
              {readOnlyEvent.description && (
                <p className="text-xs text-gray-600 pt-2 border-t border-gray-200 whitespace-pre-line">
                  {readOnlyEvent.description}
                </p>
              )}
            </div>

            <p className="text-[11px] text-gray-400">
              Esta actividad pertenece a otro ministerio y se muestra en el calendario para coordinar fechas sin empalmes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
