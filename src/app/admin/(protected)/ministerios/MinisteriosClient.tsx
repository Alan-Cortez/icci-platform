"use client";

import { useState, useMemo } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Layers,
  Plus,
  Search,
  UserCheck,
  Clock,
  Edit3,
  Trash2,
  X,
  Loader2,
  Mail,
  Phone,
  Users,
  UserPlus,
  Crown,
  ShieldCheck,
} from "lucide-react";
import {
  createMinistry,
  updateMinistry,
  deleteMinistry,
  addMemberToMinistry,
  updateMinistryMemberRole,
  removeMemberFromMinistry,
} from "@/actions/ministries";
import { cn } from "@/lib/utils";
import type { Ministry } from "@/db/schema";

interface SimpleUser {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

interface SimpleMember {
  id: number;
  name: string;
  paternalSurname: string | null;
  maternalSurname: string | null;
  phone: string | null;
  campusId: string | null;
}

export interface MinistryAssignment {
  id: string;
  ministryId: string;
  memberId: number;
  role: "pastor" | "lider" | "servidor";
  email: string | null;
  phone: string | null;
  memberName: string;
  memberPhone: string | null;
}

export function MinisteriosClient({
  initialMinistries,
  usersList,
  membersList,
  initialAssignments,
  userRole,
  isLeaderView = false,
}: {
  initialMinistries: Ministry[];
  usersList: SimpleUser[];
  membersList: SimpleMember[];
  initialAssignments: MinistryAssignment[];
  userRole: string;
  isLeaderView?: boolean;
}) {
  const [ministriesList, setMinistriesList] = useState<Ministry[]>(initialMinistries);
  const [assignments, setAssignments] = useState<MinistryAssignment[]>(initialAssignments);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Edit / Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "general",
    description: "",
    schedule: "",
    leader: "",
    leaderId: "",
    leaderEmail: "",
    leaderPhone: "",
    pastor: "",
    pastorEmail: "",
    pastorPhone: "",
  });

  // Team / Members Modal State
  const [teamMinistry, setTeamMinistry] = useState<Ministry | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMemberRole, setSelectedMemberRole] = useState<"pastor" | "lider" | "servidor">("servidor");
  const [selectedMemberEmail, setSelectedMemberEmail] = useState("");
  const [selectedMemberPhone, setSelectedMemberPhone] = useState("");
  const [teamBusy, setTeamBusy] = useState(false);

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
      leaderEmail: "",
      leaderPhone: "",
      pastor: "",
      pastorEmail: "",
      pastorPhone: "",
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
      leaderEmail: m.leaderEmail || "",
      leaderPhone: m.leaderPhone || "",
      pastor: m.pastor || "",
      pastorEmail: m.pastorEmail || "",
      pastorPhone: m.pastorPhone || "",
    });
    setIsModalOpen(true);
  }

  function openTeamModal(m: Ministry) {
    setTeamMinistry(m);
    setMemberSearch("");
    setSelectedMemberId("");
    setSelectedMemberRole("servidor");
    setSelectedMemberEmail("");
    setSelectedMemberPhone("");
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
        const payload = isLeaderView
          ? {
              description: formData.description.trim(),
              schedule: formData.schedule.trim() || null,
            }
          : {
              name: formData.name.trim(),
              category: formData.category,
              description: formData.description.trim(),
              schedule: formData.schedule.trim() || null,
              leader: formData.leader.trim() || null,
              leaderId: formData.leaderId || null,
              leaderEmail: formData.leaderEmail.trim() || null,
              leaderPhone: formData.leaderPhone.trim() || null,
              pastor: formData.pastor.trim() || null,
              pastorEmail: formData.pastorEmail.trim() || null,
              pastorPhone: formData.pastorPhone.trim() || null,
            };

        const res = await updateMinistry(editingMinistry.id, payload);

        if (res.success) {
          setMinistriesList((prev) =>
            prev.map((item) =>
              item.id === editingMinistry.id
                ? {
                    ...item,
                    ...payload,
                    leaderId: (res as any).resolvedLeaderId ?? payload.leaderId ?? item.leaderId,
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
          leaderEmail: formData.leaderEmail.trim() || undefined,
          leaderPhone: formData.leaderPhone.trim() || undefined,
          pastor: formData.pastor.trim() || undefined,
          pastorEmail: formData.pastorEmail.trim() || undefined,
          pastorPhone: formData.pastorPhone.trim() || undefined,
        });

        if (res.success && res.ministry) {
          setMinistriesList((prev) => [...prev, res.ministry!]);
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

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();
    if (!teamMinistry || !selectedMemberId) return;
    const memberIdNum = parseInt(selectedMemberId, 10);
    if (isNaN(memberIdNum)) return;

    setTeamBusy(true);
    try {
      const res = await addMemberToMinistry({
        ministryId: teamMinistry.id,
        memberId: memberIdNum,
        role: selectedMemberRole,
        email: selectedMemberEmail || undefined,
        phone: selectedMemberPhone || undefined,
      });

      if (res.success && res.assignment) {
        setAssignments((prev) => {
          const exists = prev.some((a) => a.id === res.assignment!.id);
          if (exists) {
            return prev.map((a) => (a.id === res.assignment!.id ? res.assignment! : a));
          }
          return [...prev, res.assignment!];
        });
        setSelectedMemberId("");
        setSelectedMemberEmail("");
        setSelectedMemberPhone("");
        setSelectedMemberRole("servidor");
      } else {
        alert(res.error || "No se pudo agregar al hermano.");
      }
    } finally {
      setTeamBusy(false);
    }
  }

  async function handleChangeMemberRole(
    assignmentId: string,
    newRole: "pastor" | "lider" | "servidor"
  ) {
    setTeamBusy(true);
    try {
      const res = await updateMinistryMemberRole(assignmentId, newRole);
      if (res.success) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? { ...a, role: newRole } : a))
        );
      } else {
        alert(res.error || "No se pudo cambiar el rol.");
      }
    } finally {
      setTeamBusy(false);
    }
  }

  async function handleRemoveMember(assignmentId: string) {
    if (!confirm("¿Quitar a este miembro del equipo del ministerio?")) return;
    setTeamBusy(true);
    try {
      const res = await removeMemberFromMinistry(assignmentId);
      if (res.success) {
        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      } else {
        alert(res.error || "No se pudo quitar al miembro.");
      }
    } finally {
      setTeamBusy(false);
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
      (m.leader || "").toLowerCase().includes(q) ||
      (m.pastor || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const filteredMembersPicker = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    return membersList.filter((m) => {
      const fullName = [m.name, m.paternalSurname, m.maternalSurname]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return !q || fullName.includes(q) || (m.phone || "").toLowerCase().includes(q);
    });
  }, [membersList, memberSearch]);

  const currentTeamList = useMemo(() => {
    if (!teamMinistry) return [];
    const rolePriority = { pastor: 0, lider: 1, servidor: 2 };
    return assignments
      .filter((a) => a.ministryId === teamMinistry.id)
      .sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);
  }, [assignments, teamMinistry]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-gold" />{" "}
            {isLeaderView ? "Mi Ministerio" : "Gestión de Ministerios y Liderazgo"}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLeaderView
              ? "Administra los detalles, horario y el equipo de hermanos que sirven en tu ministerio."
              : "Asigna pastores, líderes con correo y contacto, y registra los miembros que sirven en cada ministerio."}
          </p>
        </div>
        {!isLeaderView && (
          <Button
            onClick={openCreateModal}
            className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Nuevo Ministerio
          </Button>
        )}
      </div>

      {/* Filtros y Búsqueda (solo para vista completa) */}
      {!isLeaderView && (
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
              placeholder="Buscar ministerio, pastor o líder..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>
        </div>
      )}

      {/* Grid de Ministerios */}
      <div
        className={cn(
          "grid gap-5",
          isLeaderView && filtered.length === 1
            ? "grid-cols-1 max-w-2xl"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {filtered.map((min) => {
          const leaderDisplayName =
            min.leader || (min.leaderId ? userMap.get(min.leaderId) : null);
          const minAssignments = assignments.filter((a) => a.ministryId === min.id);

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
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                      {min.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-navy/5 text-navy flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold" /> {minAssignments.length}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-navy mb-1.5">{min.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                  {min.description}
                </p>

                {/* Pastores Encargados */}
                {min.pastor && (
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 mb-2.5 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      Pastor(es) Encargados
                    </span>
                    <div className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                      <span className="text-xs font-bold text-navy truncate">{min.pastor}</span>
                    </div>
                    {(min.pastorEmail || min.pastorPhone) && (
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600 pl-5">
                        {min.pastorEmail && (
                          <span className="flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" /> {min.pastorEmail}
                          </span>
                        )}
                        {min.pastorPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400 shrink-0" /> {min.pastorPhone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Líder asignado */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-3 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Líder Responsable
                  </span>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-xs font-bold text-navy truncate">
                      {leaderDisplayName || "Por asignar"}
                    </span>
                  </div>
                  {(min.leaderEmail || min.leaderPhone) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 pl-6">
                      {min.leaderEmail && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" /> {min.leaderEmail}
                        </span>
                      )}
                      {min.leaderPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" /> {min.leaderPhone}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Horario de reunión */}
                {min.schedule && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 px-1 mb-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{min.schedule}</span>
                  </div>
                )}

                {/* Preview de miembros sirviendo */}
                {minAssignments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                      Equipo Sirviendo ({minAssignments.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {minAssignments.slice(0, 4).map((a) => (
                        <span
                          key={a.id}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-gray-100 text-navy font-medium truncate max-w-[140px]"
                        >
                          {a.memberName}
                        </span>
                      ))}
                      {minAssignments.length > 4 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-lg bg-gold/15 text-navy font-bold">
                          +{minAssignments.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(min)}
                    className="text-xs font-bold flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />{" "}
                    {isLeaderView ? "Editar Info" : "Editar / Asignar"}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => openTeamModal(min)}
                    className="text-xs font-bold flex items-center gap-1.5 bg-navy text-white hover:bg-navy/90"
                  >
                    <Users className="w-3.5 h-3.5 text-gold" /> Equipo ({minAssignments.length})
                  </Button>
                </div>

                {!isLeaderView && userRole === "superadmin" && (
                  <button
                    onClick={() => handleDelete(min.id)}
                    disabled={isUpdating === min.id}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    title="Eliminar ministerio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-200/80">
          <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="font-semibold text-navy">
            {isLeaderView
              ? "Aún no tienes un ministerio asignado."
              : "No se encontraron ministerios."}
          </p>
        </div>
      )}

      {/* Modal Crear / Editar Ministerio y Asignar Pastores y Líder */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
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
                  {editingMinistry
                    ? isLeaderView
                      ? `Editar ${editingMinistry.name}`
                      : "Editar Ministerio y Liderazgo"
                    : "Crear Nuevo Ministerio"}
                </h3>
                <p className="text-xs text-gray-500">
                  {isLeaderView
                    ? "Actualiza la descripción y el horario de reunión de tu ministerio"
                    : "Asigna pastores encargados, líder responsable, correo de acceso y contactos"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMinistry} className="space-y-4">
              {!isLeaderView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Nombre del Ministerio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Danza, Jóvenes, Varones"
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
                </div>
              )}

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
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Propósito ministerial y actividades..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              {!isLeaderView && (
                <>
                  {/* Sección Pastores Encargados */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-navy flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-gold-dark" /> Pastor(es) Encargados del Ministerio
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Nombre del Pastor / Pastores (Opcional)
                        </label>
                        <input
                          type="text"
                          value={formData.pastor}
                          onChange={(e) => setFormData({ ...formData, pastor: e.target.value })}
                          placeholder="Ej. Pastores / Apóstol Óscar y Pastora Raquel"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Correo Electrónico (Acceso Pastor)
                        </label>
                        <input
                          type="email"
                          value={formData.pastorEmail}
                          onChange={(e) => setFormData({ ...formData, pastorEmail: e.target.value })}
                          placeholder="pastor@correo.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Teléfono / Contacto
                        </label>
                        <input
                          type="text"
                          value={formData.pastorPhone}
                          onChange={(e) => setFormData({ ...formData, pastorPhone: e.target.value })}
                          placeholder="862 000 0000"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sección Líder Responsable */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
                    <p className="text-xs font-black uppercase tracking-wider text-navy flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-gold" /> Líder Responsable y Acceso al Panel
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Elegir desde Miembros Registrados
                        </label>
                        <select
                          value=""
                          onChange={(e) => {
                            const memId = parseInt(e.target.value, 10);
                            const m = membersList.find((item) => item.id === memId);
                            if (m) {
                              const fullName = [m.name, m.paternalSurname, m.maternalSurname]
                                .filter(Boolean)
                                .join(" ");
                              setFormData((prev) => ({
                                ...prev,
                                leader: fullName,
                                leaderPhone: m.phone || prev.leaderPhone,
                              }));
                            }
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="">-- Seleccionar hermano de la iglesia --</option>
                          {membersList.map((m) => (
                            <option key={m.id} value={m.id}>
                              {[m.name, m.paternalSurname, m.maternalSurname].filter(Boolean).join(" ")}
                              {m.phone ? ` (${m.phone})` : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Vincular a Cuenta Google Registrada
                        </label>
                        <select
                          value={formData.leaderId}
                          onChange={(e) => {
                            const chosenId = e.target.value;
                            const chosenUser = usersList.find((u) => u.id === chosenId);
                            setFormData((prev) => ({
                              ...prev,
                              leaderId: chosenId,
                              leader: chosenUser?.name || prev.leader,
                              leaderEmail: chosenUser?.email || prev.leaderEmail,
                              leaderPhone: chosenUser?.phone || prev.leaderPhone,
                            }));
                          }}
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="">-- Sin vincular cuenta --</option>
                          {usersList.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name || u.email} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Nombre Completo del Líder
                        </label>
                        <input
                          type="text"
                          value={formData.leader}
                          onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                          placeholder="Nombre del hermano o hermana líder"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Correo Electrónico (Acceso automático con Google)
                        </label>
                        <input
                          type="email"
                          value={formData.leaderEmail}
                          onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                          placeholder="lider@gmail.com"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">
                          Teléfono / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={formData.leaderPhone}
                          onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
                          placeholder="862 000 0000"
                          className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Al guardar el correo electrónico del líder, cuando inicie sesión con Google entrará con rol de Líder viendo únicamente su ministerio y el calendario de planeación.
                    </p>
                  </div>
                </>
              )}

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

      {/* Modal Equipo / Miembros que sirven en el Ministerio */}
      {teamMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setTeamMinistry(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  Equipo de {teamMinistry.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Asigna pastores, líderes y miembros de la congregación que sirven en este ministerio
                </p>
              </div>
            </div>

            {/* Formulario para agregar hermano al ministerio */}
            <form
              onSubmit={handleAddMember}
              className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3 mb-6"
            >
              <p className="text-xs font-black uppercase tracking-wider text-navy flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-gold" /> Agregar Miembro Registrado al Ministerio
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Filtrar por Nombre o Teléfono
                  </label>
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Buscar hermano registrado..."
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Seleccionar Hermano *
                  </label>
                  <select
                    required
                    value={selectedMemberId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedMemberId(val);
                      const m = membersList.find((item) => String(item.id) === val);
                      if (m && m.phone) {
                        setSelectedMemberPhone(m.phone);
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="">-- Elegir miembro ({filteredMembersPicker.length}) --</option>
                    {filteredMembersPicker.map((m) => (
                      <option key={m.id} value={m.id}>
                        {[m.name, m.paternalSurname, m.maternalSurname].filter(Boolean).join(" ")}
                        {m.phone ? ` • ${m.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Rol en el Ministerio
                  </label>
                  <select
                    value={selectedMemberRole}
                    onChange={(e) =>
                      setSelectedMemberRole(e.target.value as "pastor" | "lider" | "servidor")
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="servidor">Miembro / Servidor</option>
                    <option value="lider">Líder</option>
                    <option value="pastor">Pastor(a)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Correo (Opcional)
                  </label>
                  <input
                    type="email"
                    value={selectedMemberEmail}
                    onChange={(e) => setSelectedMemberEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Teléfono (Opcional)
                  </label>
                  <input
                    type="text"
                    value={selectedMemberPhone}
                    onChange={(e) => setSelectedMemberPhone(e.target.value)}
                    placeholder="Teléfono de contacto"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={teamBusy || !selectedMemberId}
                  className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs flex items-center gap-1.5"
                >
                  {teamBusy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Agregar al Equipo
                </Button>
              </div>
            </form>

            {/* Lista de Miembros Asignados */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Miembros Asignados ({currentTeamList.length})
                </h4>
              </div>

              {currentTeamList.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-gray-200 rounded-2xl text-gray-400 text-xs">
                  Aún no hay miembros agregados al equipo de este ministerio. Selecciona un hermano arriba para agregarlo.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {currentTeamList.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50/70 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-navy truncate">
                            {a.memberName}
                          </span>
                          <Badge
                            variant={
                              a.role === "pastor"
                                ? "gold"
                                : a.role === "lider"
                                ? "navy"
                                : "default"
                            }
                          >
                            {a.role === "pastor"
                              ? "Pastor(a)"
                              : a.role === "lider"
                              ? "Líder"
                              : "Servidor"}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 mt-0.5">
                          {(a.phone || a.memberPhone) && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" /> {a.phone || a.memberPhone}
                            </span>
                          )}
                          {a.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" /> {a.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={a.role}
                          disabled={teamBusy}
                          onChange={(e) =>
                            handleChangeMemberRole(
                              a.id,
                              e.target.value as "pastor" | "lider" | "servidor"
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-navy font-semibold"
                        >
                          <option value="servidor">Servidor</option>
                          <option value="lider">Líder</option>
                          <option value="pastor">Pastor(a)</option>
                        </select>

                        <button
                          onClick={() => handleRemoveMember(a.id)}
                          disabled={teamBusy}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Quitar del ministerio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
