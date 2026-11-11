"use client";

import { useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import {
  BookMarked,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  LayoutGrid,
  List,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  User,
  X,
  Eye,
} from "lucide-react";
import {
  createPreachingSchedule,
  updatePreachingSchedule,
  deletePreachingSchedule,
} from "@/actions/preachings";
import { cn } from "@/lib/utils";
import type { PreachingSchedule } from "@/db/schema";

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

function toDateKeyUTC(d: Date | number): string {
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function PredicacionesClient({
  initialItems,
  campusesList,
  preachersSuggestions,
  canManage,
  defaultCampusId,
}: {
  initialItems: PreachingSchedule[];
  campusesList: { id: string; name: string }[];
  preachersSuggestions: { id: string; name: string | null; email: string | null; role: string }[];
  canManage: boolean;
  defaultCampusId: string;
}) {
  const now = new Date();
  const [items, setItems] = useState<PreachingSchedule[]>(initialItems);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [selectedCampus, setSelectedCampus] = useState<string>(defaultCampusId || "all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PreachingSchedule | null>(null);
  const [formData, setFormData] = useState({
    campusId: defaultCampusId || campusesList[0]?.id || "",
    date: now.toISOString().split("T")[0],
    serviceName: "Culto Dominical",
    timeStr: "10:00 AM",
    preacherName: "",
    preacherUserId: "",
    topic: "",
    notes: "",
  });

  const campusMap = useMemo(
    () => new Map(campusesList.map((c) => [c.id, c.name])),
    [campusesList]
  );

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const d = new Date(item.date);
        if (d.getUTCFullYear() !== selectedYear || d.getUTCMonth() !== selectedMonth) {
          return false;
        }
        if (selectedCampus !== "all" && item.campusId !== selectedCampus) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          if (
            !item.preacherName.toLowerCase().includes(q) &&
            !item.serviceName.toLowerCase().includes(q) &&
            !(item.topic || "").toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [items, selectedYear, selectedMonth, selectedCampus, search]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, PreachingSchedule[]>();
    for (const item of filteredItems) {
      const key = toDateKeyUTC(item.date);
      const list = map.get(key) || [];
      list.push(item);
      map.set(key, list);
    }
    return map;
  }, [filteredItems]);

  const calendarDays = useMemo(() => {
    const firstDayWeekday = new Date(Date.UTC(selectedYear, selectedMonth, 1)).getUTCDay();
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

  const yearOptions = useMemo(() => {
    const set = new Set<number>([now.getFullYear(), now.getFullYear() + 1]);
    items.forEach((it) => set.add(new Date(it.date).getUTCFullYear()));
    return Array.from(set).sort();
  }, [items, now]);

  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

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

  function openCreateModal(prefillDate?: string) {
    if (!canManage) return;
    const defaultDate =
      prefillDate ||
      `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(
        Math.min(now.getDate(), 28)
      ).padStart(2, "0")}`;
    setEditingItem(null);
    setFormData({
      campusId: selectedCampus !== "all" ? selectedCampus : defaultCampusId || campusesList[0]?.id || "",
      date: defaultDate,
      serviceName: "Culto Dominical",
      timeStr: "10:00 AM",
      preacherName: "",
      preacherUserId: "",
      topic: "",
      notes: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(item: PreachingSchedule) {
    if (!canManage) return;
    setEditingItem(item);
    setFormData({
      campusId: item.campusId || "",
      date: toDateKeyUTC(item.date),
      serviceName: item.serviceName,
      timeStr: item.timeStr || "",
      preacherName: item.preacherName,
      preacherUserId: item.preacherUserId || "",
      topic: item.topic || "",
      notes: item.notes || "",
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!canManage) return;
    if (!formData.preacherName.trim() || !formData.serviceName.trim()) {
      alert("Ingresa el servicio y el nombre del predicador.");
      return;
    }

    const timestamp = new Date(`${formData.date}T12:00:00Z`).getTime();

    try {
      if (editingItem) {
        setBusyId(editingItem.id);
        const res = await updatePreachingSchedule(editingItem.id, {
          campusId: formData.campusId || null,
          date: timestamp,
          serviceName: formData.serviceName.trim(),
          timeStr: formData.timeStr.trim() || null,
          preacherName: formData.preacherName.trim(),
          preacherUserId: formData.preacherUserId || null,
          topic: formData.topic.trim() || null,
          notes: formData.notes.trim() || null,
        });

        if (res.success) {
          setItems((prev) =>
            prev.map((it) =>
              it.id === editingItem.id
                ? {
                    ...it,
                    campusId: formData.campusId || null,
                    date: new Date(timestamp),
                    serviceName: formData.serviceName.trim(),
                    timeStr: formData.timeStr.trim() || null,
                    preacherName: formData.preacherName.trim(),
                    preacherUserId: formData.preacherUserId || null,
                    topic: formData.topic.trim() || null,
                    notes: formData.notes.trim() || null,
                  }
                : it
            )
          );
          setIsModalOpen(false);
        } else {
          alert(res.error || "No se pudo actualizar.");
        }
      } else {
        setBusyId("new");
        const res = await createPreachingSchedule({
          campusId: formData.campusId || null,
          date: timestamp,
          serviceName: formData.serviceName.trim(),
          timeStr: formData.timeStr.trim() || undefined,
          preacherName: formData.preacherName.trim(),
          preacherUserId: formData.preacherUserId || null,
          topic: formData.topic.trim() || undefined,
          notes: formData.notes.trim() || undefined,
        });

        if (res.success && res.item) {
          setItems((prev) => [...prev, res.item!]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "No se pudo guardar.");
        }
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!canManage) return;
    if (!confirm("¿Eliminar esta asignación de predicación?")) return;
    setBusyId(id);
    try {
      const res = await deletePreachingSchedule(id);
      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        setIsModalOpen(false);
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <BookMarked className="w-7 h-7 text-gold" /> Rol de Predicaciones del Mes
          </h1>
          <p className="text-gray-500 text-sm">
            {canManage
              ? "Asigna a qué pastor o predicador le corresponde ministrar en cada culto y campus del mes."
              : "Consulta a qué pastor le corresponde cada predicación del mes."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!canManage && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
              <Eye className="w-3.5 h-3.5 text-gray-500" /> Solo lectura
            </span>
          )}

          <div className="inline-flex bg-white p-1 rounded-xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "list" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <List className="w-3.5 h-3.5" /> Lista
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                viewMode === "calendar" ? "bg-navy text-white" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Calendario
            </button>
          </div>

          {canManage && (
            <Button
              onClick={() => openCreateModal()}
              className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Programar Predicación
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-navy cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-navy bg-white"
          >
            {MONTHS_ES.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-bold text-navy bg-white"
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
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-gray-500 ml-1">
            {filteredItems.length} predicación(es)
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full sm:w-52 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white"
            >
              <option value="all">Todos los Campus</option>
              {campusesList.map((c) => (
                <option key={c.id} value={c.id}>
                  Campus {c.name}
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
              placeholder="Buscar pastor o tema..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card className="overflow-hidden border border-gray-200/80 shadow-xs bg-white">
          <div className="grid grid-cols-7 bg-navy text-white text-center">
            {WEEKDAYS_SHORT.map((d) => (
              <div key={d} className="py-3 text-xs font-bold uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
            {calendarDays.map((cell, idx) => {
              if (!cell.day || !cell.dateKey) {
                return <div key={`empty-${idx}`} className="min-h-[110px] bg-gray-50/50" />;
              }
              const dayItems = itemsByDay.get(cell.dateKey) || [];
              const isToday = cell.dateKey === todayKey;

              return (
                <div
                  key={cell.dateKey}
                  className={cn(
                    "min-h-[115px] p-2 flex flex-col justify-between group",
                    isToday ? "bg-gold/5" : "bg-white hover:bg-gray-50/40"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center",
                          isToday ? "bg-navy text-gold" : "text-gray-700"
                        )}
                      >
                        {cell.day}
                      </span>
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => openCreateModal(cell.dateKey!)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-gold/20 text-navy transition-opacity cursor-pointer"
                          title="Programar predicación"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayItems.map((it) => (
                        <div
                          key={it.id}
                          onClick={() => canManage && openEditModal(it)}
                          className={cn(
                            "p-1.5 rounded-lg border text-[10px] bg-purple-50 text-purple-900 border-purple-200",
                            canManage ? "cursor-pointer hover:ring-1 hover:ring-navy/40" : ""
                          )}
                        >
                          <p className="font-bold truncate">{it.preacherName}</p>
                          <p className="text-[9px] opacity-80 truncate">
                            {it.serviceName}
                            {it.campusId ? ` • ${campusMap.get(it.campusId) || it.campusId}` : ""}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <Card className="overflow-hidden border border-gray-200/80 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                  <th className="px-6 py-4 font-semibold">Culto / Servicio</th>
                  <th className="px-6 py-4 font-semibold">Predicador Asignado</th>
                  <th className="px-6 py-4 font-semibold">Campus</th>
                  <th className="px-6 py-4 font-semibold">Tema / Notas</th>
                  {canManage && <th className="px-6 py-4 font-semibold text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gold shrink-0" />
                        <div>
                          <p className="font-bold text-navy capitalize">
                            {new Date(item.date).toLocaleDateString("es-MX", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              timeZone: "UTC",
                            })}
                          </p>
                          {item.timeStr && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {item.timeStr}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-navy">{item.serviceName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                        <User className="w-3.5 h-3.5 text-purple-600" /> {item.preacherName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-600">
                      {item.campusId ? `Campus ${campusMap.get(item.campusId) || item.campusId}` : "General"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {item.topic && <p className="font-bold text-navy">{item.topic}</p>}
                      {item.notes && <p className="text-gray-500">{item.notes}</p>}
                      {!item.topic && !item.notes && <span className="text-gray-400">—</span>}
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-xl"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={busyId === item.id}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <BookMarked className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-navy">
                  No hay predicaciones registradas para {MONTHS_ES[selectedMonth]} {selectedYear}.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Modal Programar / Editar Predicación */}
      {isModalOpen && canManage && (
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
                <BookMarked className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  {editingItem ? "Editar Predicación" : "Programar Predicación"}
                </h3>
                <p className="text-xs text-gray-500">
                  Asigna fecha, culto, campus y pastor predicador
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Hora
                  </label>
                  <input
                    type="text"
                    value={formData.timeStr}
                    onChange={(e) => setFormData({ ...formData, timeStr: e.target.value })}
                    placeholder="Ej. 10:00 AM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Servicio / Culto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="Ej. Culto Dominical, Jueves"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Campus
                  </label>
                  <select
                    value={formData.campusId}
                    onChange={(e) => setFormData({ ...formData, campusId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    <option value="">General / Todos</option>
                    {campusesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        Campus {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {preachersSuggestions.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Seleccionar Pastor Registrado (Opcional)
                  </label>
                  <select
                    value={formData.preacherUserId}
                    onChange={(e) => {
                      const uid = e.target.value;
                      const chosen = preachersSuggestions.find((p) => p.id === uid);
                      setFormData((prev) => ({
                        ...prev,
                        preacherUserId: uid,
                        preacherName: chosen?.name || prev.preacherName,
                      }));
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
                  >
                    <option value="">-- Elegir o escribir manualmente abajo --</option>
                    {preachersSuggestions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name || p.email} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Nombre del Predicador *
                </label>
                <input
                  type="text"
                  required
                  value={formData.preacherName}
                  onChange={(e) => setFormData({ ...formData, preacherName: e.target.value })}
                  placeholder="Ej. Apóstol Óscar Sosa, Pastor Juan Pérez"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Tema o Serie (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ej. Fe Inquebrantable"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Notas / Indicaciones (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Indicaciones adicionales..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                <div>
                  {editingItem && (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingItem.id)}
                      disabled={busyId !== null}
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
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <Button
                    type="submit"
                    disabled={busyId !== null}
                    className="bg-gold hover:bg-gold-dark text-navy font-bold px-5"
                  >
                    {busyId !== null ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
