"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Layers,
  Plus,
  Search,
  UserCheck,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  X,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import { createMinistry, updateMinistry, deleteMinistry } from "@/actions/ministries";
import { cn } from "@/lib/utils";
import type { Ministry, User } from "@/db/schema";

export function MinisteriosClient({
  initialMinistries,
  usersList,
}: {
  initialMinistries: Ministry[];
  usersList: User[];
}) {
  const [ministriesList, setMinistriesList] = useState<Ministry[]>(initialMinistries);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "general",
    description: "",
    schedule: "",
    leader: "",
    leaderId: "",
  });

  const categories = [
    { key: "all", label: "Todos" },
    { key: "varones", label: "Varones" },
    { key: "femenil", label: "Femenil" },
    { key: "jovenes", label: "Jóvenes" },
    { key: "ninos", label: "Niños" },
    { key: "general", label: "Generales" },
  ];

  function openCreateModal() {
    setEditingMinistry(null);
    setFormData({
      name: "",
      category: "general",
      description: "",
      schedule: "",
      leader: "",
      leaderId: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(m: Ministry) {
    setEditingMinistry(m);
    setFormData({
      name: m.name,
      category: m.category,
      description: m.description,
      schedule: m.schedule || "",
      leader: m.leader || "",
      leaderId: m.leaderId || "",
    });
    setIsModalOpen(true);
  }

  async function handleSaveMinistry(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Por favor ingresa el nombre del ministerio.");
      return;
    }

    try {
      if (editingMinistry) {
        setIsUpdating(editingMinistry.id);
        const res = await updateMinistry(editingMinistry.id, {
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          schedule: formData.schedule.trim() || null,
          leader: formData.leader.trim() || null,
          leaderId: formData.leaderId || null,
        });

        if (res.success) {
          setMinistriesList((prev) =>
            prev.map((item) =>
              item.id === editingMinistry.id
                ? {
                    ...item,
                    name: formData.name.trim(),
                    category: formData.category,
                    description: formData.description.trim(),
                    schedule: formData.schedule.trim() || null,
                    leader: formData.leader.trim() || null,
                    leaderId: formData.leaderId || null,
                  }
                : item
            )
          );
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar ministerio.");
        }
      } else {
        setIsUpdating("new");
        const res = await createMinistry({
          name: formData.name.trim(),
          category: formData.category,
          description: formData.description.trim(),
          schedule: formData.schedule.trim() || undefined,
          leader: formData.leader.trim() || undefined,
          leaderId: formData.leaderId || undefined,
        });

        if (res.success && res.ministry) {
          setMinistriesList((prev) => [...prev, res.ministry]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al registrar ministerio.");
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
    if (!confirm("¿Seguro que deseas eliminar este ministerio?")) return;
    setIsUpdating(id);
    try {
      const res = await deleteMinistry(id);
      if (res.success) {
        setMinistriesList((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setIsUpdating(null);
    }
  }

  const userMap = new Map(usersList.map((u) => [u.id, u.name || u.email]));

  const filtered = ministriesList.filter((m) => {
    const matchesCat =
      categoryFilter === "all" ||
      m.category.toLowerCase() === categoryFilter.toLowerCase();
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.leader || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-gold" /> Gestión de Ministerios y Pastores
          </h1>
          <p className="text-gray-500 text-sm">
            Estructura ministerial de Comunidad de Cristo Internacional y asignación de líderes responsables.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Nuevo Ministerio
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                categoryFilter === cat.key
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ministerio o líder..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      {/* Grid de Ministerios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((min) => {
          const leaderDisplayName =
            min.leader || (min.leaderId ? userMap.get(min.leaderId) : null);

          return (
            <div
              key={min.id}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow group relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 text-navy font-bold flex items-center justify-center border border-navy/10 group-hover:bg-gold/15 group-hover:text-navy transition-colors">
                    <Layers className="w-6 h-6 text-gold" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                    {min.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-navy mb-1.5">{min.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                  {min.description}
                </p>

                {/* Líder asignado */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-3 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Líder / Pastor Asignado
                  </span>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-xs font-bold text-navy truncate">
                      {leaderDisplayName || "Por asignar"}
                    </span>
                  </div>
                </div>

                {/* Horario de reunión */}
                {min.schedule && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 px-1 mb-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{min.schedule}</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(min)}
                  className="text-xs font-bold flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar / Asignar
                </Button>

                <button
                  onClick={() => handleDelete(min.id)}
                  disabled={isUpdating === min.id}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                  title="Eliminar ministerio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-200/80">
          <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-navy">No se encontraron ministerios.</p>
        </div>
      )}

      {/* Modal Crear / Editar Ministerio */}
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
                <Layers className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  {editingMinistry ? "Editar Ministerio" : "Crear Nuevo Ministerio"}
                </h3>
                <p className="text-xs text-gray-500">
                  Define el nombre, descripción y líder responsable del ministerio
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMinistry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Nombre del Ministerio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Alabanza, Jóvenes, Protemplo"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="general">General</option>
                  <option value="varones">Varones</option>
                  <option value="femenil">Femenil</option>
                  <option value="jovenes">Jóvenes</option>
                  <option value="ninos">Niños / Herederos al Reino</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Propósito ministerial y actividades..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Horario de Reunión
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="Ej. Sábados 6:30 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Nombre del Líder (Texto)
                  </label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                    placeholder="Ej. Pastora Raquel Sosa"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Vincular a Cuenta de Usuario Registrada (Opcional)
                </label>
                <select
                  value={formData.leaderId}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    const chosenUser = usersList.find((u) => u.id === chosenId);
                    setFormData({
                      ...formData,
                      leaderId: chosenId,
                      leader: chosenUser?.name || formData.leader,
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="">Sin vincular a usuario</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email} ({u.role})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Permite que el líder acceda al panel de su ministerio al iniciar sesión.
                </p>
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
                    "Guardar Ministerio"
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
