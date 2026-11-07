"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  X,
  Loader2,
  Sparkles,
  Camera,
  Search,
} from "lucide-react";
import { updateCampus, createCampus, deleteCampus } from "@/actions/campuses";
import { cn } from "@/lib/utils";
import type { Campus, CampusSchedule } from "@/db/schema";

interface ScheduleItem {
  id?: string;
  title: string;
  days: string;
  time: string;
}

export function CampusClient({
  initialCampuses,
  initialSchedules,
}: {
  initialCampuses: Campus[];
  initialSchedules: CampusSchedule[];
}) {
  const [campusesList, setCampusesList] = useState<Campus[]>(initialCampuses);
  const [schedulesList, setSchedulesList] = useState<CampusSchedule[]>(initialSchedules);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    state: "Coahuila",
    isMain: false,
    pastor: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    image: "",
    pastorImage: "",
  });
  const [editingSchedules, setEditingSchedules] = useState<ScheduleItem[]>([]);

  const states = ["all", "Coahuila", "Nuevo León", "Durango"];

  function openCreateModal() {
    setEditingCampus(null);
    setFormData({
      name: "",
      state: "Coahuila",
      isMain: false,
      pastor: "",
      address: "",
      phone: "+52 862 101 3598",
      email: "",
      description: "",
      image: "",
      pastorImage: "",
    });
    setEditingSchedules([
      { title: "Servicio general", days: "Domingo", time: "10:00 AM" },
      { title: "Culto de oración", days: "Jueves", time: "7:00 PM" },
    ]);
    setIsModalOpen(true);
  }

  function openEditModal(c: Campus) {
    setEditingCampus(c);
    setFormData({
      name: c.name,
      state: c.state,
      isMain: Boolean(c.isMain),
      pastor: c.pastor,
      address: c.address,
      phone: c.phone,
      email: c.email || "",
      description: c.description,
      image: c.image || "",
      pastorImage: c.pastorImage || "",
    });

    const currentSchedules = schedulesList
      .filter((s) => s.campusId === c.id)
      .map((s) => ({
        id: s.id,
        title: s.title,
        days: s.days,
        time: s.time,
      }));

    setEditingSchedules(
      currentSchedules.length > 0
        ? currentSchedules
        : [{ title: "Servicio general", days: "Domingo", time: "10:00 AM" }]
    );
    setIsModalOpen(true);
  }

  function addScheduleRow() {
    setEditingSchedules((prev) => [
      ...prev,
      { title: "", days: "", time: "" },
    ]);
  }

  function removeScheduleRow(index: number) {
    setEditingSchedules((prev) => prev.filter((_, i) => i !== index));
  }

  function updateScheduleRow(index: number, field: keyof ScheduleItem, value: string) {
    setEditingSchedules((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  async function handleSaveCampus(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Por favor ingresa el nombre del campus.");
      return;
    }

    try {
      if (editingCampus) {
        setIsUpdating(editingCampus.id);
        const res = await updateCampus(
          editingCampus.id,
          {
            name: formData.name.trim(),
            state: formData.state.trim(),
            isMain: formData.isMain,
            pastor: formData.pastor.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            description: formData.description.trim(),
            image: formData.image.trim() || null,
            pastorImage: formData.pastorImage.trim() || null,
          },
          editingSchedules
        );

        if (res.success) {
          setCampusesList((prev) =>
            prev.map((item) =>
              item.id === editingCampus.id
                ? {
                    ...item,
                    name: formData.name.trim(),
                    state: formData.state.trim(),
                    isMain: formData.isMain,
                    pastor: formData.pastor.trim(),
                    address: formData.address.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim() || null,
                    description: formData.description.trim(),
                    image: formData.image.trim() || null,
                    pastorImage: formData.pastorImage.trim() || null,
                  }
                : formData.isMain
                ? { ...item, isMain: false }
                : item
            )
          );

          // Update local schedules list
          setSchedulesList((prev) => [
            ...prev.filter((s) => s.campusId !== editingCampus.id),
            ...editingSchedules
              .filter((s) => s.title.trim())
              .map((s, idx) => ({
                id: s.id || `sch-${editingCampus.id}-${Date.now()}-${idx}`,
                campusId: editingCampus.id,
                title: s.title,
                days: s.days,
                time: s.time,
                sortOrder: idx,
              })),
          ]);

          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar campus.");
        }
      } else {
        setIsUpdating("new");
        const res = await createCampus(
          {
            name: formData.name.trim(),
            state: formData.state.trim(),
            isMain: formData.isMain,
            pastor: formData.pastor.trim(),
            address: formData.address.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || undefined,
            description: formData.description.trim(),
            image: formData.image.trim() || undefined,
            pastorImage: formData.pastorImage.trim() || undefined,
          },
          editingSchedules
        );

        if (res.success && res.campus) {
          setCampusesList((prev) => [...prev, res.campus]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al crear campus.");
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
    if (!confirm("¿Seguro que deseas eliminar este campus?")) return;
    setIsUpdating(id);
    try {
      const res = await deleteCampus(id);
      if (res.success) {
        setCampusesList((prev) => prev.filter((c) => c.id !== id));
        setSchedulesList((prev) => prev.filter((s) => s.campusId !== id));
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setIsUpdating(null);
    }
  }

  const filtered = campusesList.filter((c) => {
    const matchesState = selectedState === "all" || c.state === selectedState;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.pastor.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q);
    return matchesState && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-gold" /> Gestión de Campus
          </h1>
          <p className="text-gray-500 text-sm">
            Edición independiente de sedes, pastores, direcciones, horarios de cultos y fotos de cada campus.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Nuevo Campus
        </Button>
      </div>

      {/* Filtros por Estado y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                selectedState === st
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {st === "all" ? "Todos los Estados" : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar campus o pastor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      {/* Grid de Campus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((campus) => {
          const schedules = schedulesList.filter((s) => s.campusId === campus.id);

          return (
            <div
              key={campus.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Imagen del Campus */}
                <div className="relative h-48 bg-navy/90 overflow-hidden">
                  {campus.image ? (
                    <img
                      src={campus.image}
                      alt={campus.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 p-4">
                      <Camera className="w-10 h-10 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Sin foto de fachada</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Badges superiores */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-xs border border-white/20">
                      {campus.state}
                    </span>
                    {campus.isMain && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gold text-navy shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Sede Central
                      </span>
                    )}
                  </div>

                  {/* Título en la imagen */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">
                      Campus {campus.name}
                    </h3>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    {campus.pastorImage ? (
                      <img
                        src={campus.pastorImage}
                        alt={campus.pastor}
                        className="w-12 h-12 rounded-full object-cover object-top border-2 border-gold shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-navy/5 text-navy font-bold flex items-center justify-center border border-navy/10 shrink-0 text-xs">
                        {campus.pastor.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                        Pastor(es)
                      </span>
                      <p className="text-sm font-bold text-navy">{campus.pastor}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                      Dirección
                    </span>
                    <p className="text-xs text-gray-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{campus.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {campus.phone}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {campus.description}
                  </p>

                  {/* Horarios */}
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Horarios de Cultos ({schedules.length})
                    </span>
                    {schedules.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {schedules.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded-xl border border-gray-100"
                          >
                            <span className="font-semibold text-navy truncate mr-2">
                              {s.title} ({s.days})
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono shrink-0">
                              {s.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Sin horarios registrados</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones inferiores */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(campus)}
                  className="font-bold flex items-center gap-1.5 text-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar Campus
                </Button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/campus/${campus.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-navy rounded-xl hover:bg-gray-100 transition-colors"
                    title="Ver página pública del campus"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {!campus.isMain && (
                    <button
                      onClick={() => handleDelete(campus.id)}
                      disabled={isUpdating === campus.id}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      title="Eliminar campus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Editar / Crear Campus */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  {editingCampus ? `Editar Campus ${editingCampus.name}` : "Registrar Nuevo Campus"}
                </h3>
                <p className="text-xs text-gray-500">
                  Actualiza la información, fotos y cultos específicos de este campus
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveCampus} className="space-y-5">
              {/* Información básica */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Nombre del Campus *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Allende, Sabinas, Durango"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="Coahuila">Coahuila</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Durango">Durango</option>
                  </select>
                </div>
              </div>

              {/* Sede Central toggle */}
              <label className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 cursor-pointer hover:bg-gray-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isMain}
                  onChange={(e) => setFormData({ ...formData, isMain: e.target.checked })}
                  className="w-4 h-4 text-gold rounded focus:ring-gold"
                />
                <div>
                  <p className="text-xs font-bold text-navy">Marcar como Sede Central</p>
                  <p className="text-[11px] text-gray-500">
                    Aparecerá como el campus principal de la iglesia en el mapa y la web.
                  </p>
                </div>
              </label>

              {/* Pastores y Dirección */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Pastor(es) Responsables *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pastor}
                    onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                    placeholder="Ej. Apóstol Óscar y Pastora Raquel Sosa"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+52 862 101 3598"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Dirección Completa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, Número, Colonia, Ciudad, Estado"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              {/* Fotos del Campus y Pastor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                {/* Foto 1: Fachada / Banner */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Foto 1: Banner / Fachada / Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... (enlace a foto de portada)"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  />
                  {formData.image ? (
                    <div className="relative h-24 rounded-xl overflow-hidden border border-gray-200">
                      <img src={formData.image} alt="Vista previa portada" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1.5 text-[9px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                        Portada
                      </span>
                    </div>
                  ) : (
                    <div className="h-24 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                      Sin vista previa de portada
                    </div>
                  )}
                </div>

                {/* Foto 2: Pastor / Pastora */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Foto 2: Foto del Pastor / Pastora
                  </label>
                  <input
                    type="text"
                    value={formData.pastorImage}
                    onChange={(e) => setFormData({ ...formData, pastorImage: e.target.value })}
                    placeholder="https://... (enlace a foto del pastor/a)"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  />
                  {formData.pastorImage ? (
                    <div className="h-24 rounded-xl border border-gray-200 bg-navy/5 flex items-center justify-center p-2">
                      <img
                        src={formData.pastorImage}
                        alt="Vista previa pastor"
                        className="w-20 h-20 rounded-full object-cover object-top border-2 border-gold shadow-xs"
                      />
                    </div>
                  ) : (
                    <div className="h-24 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                      Sin vista previa de pastor/a
                    </div>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Descripción del Campus
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve reseña o bienvenida a este campus..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              {/* Editor de Horarios de Cultos */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold" /> Horarios de Cultos y Servicios
                  </label>
                  <button
                    type="button"
                    onClick={addScheduleRow}
                    className="text-xs font-bold text-gold hover:text-gold-dark flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Horario
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editingSchedules.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_120px_32px] gap-2 items-center bg-gray-50 p-2.5 rounded-xl border border-gray-200/70"
                    >
                      <input
                        type="text"
                        placeholder="Título (ej. Servicio general)"
                        value={row.title}
                        onChange={(e) => updateScheduleRow(index, "title", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                      <input
                        type="text"
                        placeholder="Días (ej. Domingo, Miércoles)"
                        value={row.days}
                        onChange={(e) => updateScheduleRow(index, "days", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                      <input
                        type="text"
                        placeholder="Hora (ej. 10:00 AM)"
                        value={row.time}
                        onChange={(e) => updateScheduleRow(index, "time", e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                      <button
                        type="button"
                        onClick={() => removeScheduleRow(index)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 flex items-center justify-center"
                        title="Quitar"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {editingSchedules.length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-2">
                      Sin horarios. Haz clic en "Agregar Horario".
                    </p>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-gray-100">
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
                  className="bg-gold hover:bg-gold-dark text-navy font-bold px-6"
                >
                  {isUpdating !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                    </>
                  ) : (
                    "Guardar Campus"
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
