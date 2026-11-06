"use client";

import { useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import {
  Cake,
  Search,
  Phone,
  UserPlus,
  MessageSquare,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  X,
  Loader2,
  Users,
} from "lucide-react";
import { createMember, updateMember, deleteMember } from "@/actions/members";
import { cn } from "@/lib/utils";
import type { Member, Ministry } from "@/db/schema";

const MONTH_NAMES = [
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

export function CumpleanosClient({
  initialMembers,
  ministriesList,
}: {
  initialMembers: Member[];
  ministriesList: Ministry[];
}) {
  const [membersList, setMembersList] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | "all" | "today" | "this_month">("this_month");
  const [genderFilter, setGenderFilter] = useState<"all" | "M" | "F">("all");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    birthDay: 1,
    birthMonth: 1,
    phone: "",
    gender: "Masculino",
    ministryId: "",
  });

  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1; // 1-12

  // Quick stats
  const birthdaysToday = useMemo(() => {
    return membersList.filter(
      (m) => m.birthDay === currentDay && m.birthMonth === currentMonth
    );
  }, [membersList, currentDay, currentMonth]);

  const birthdaysThisMonth = useMemo(() => {
    return membersList.filter((m) => m.birthMonth === currentMonth);
  }, [membersList, currentMonth]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return membersList
      .filter((m) => {
        // Month filter
        if (selectedMonth === "today") {
          if (m.birthDay !== currentDay || m.birthMonth !== currentMonth) return false;
        } else if (selectedMonth === "this_month") {
          if (m.birthMonth !== currentMonth) return false;
        } else if (selectedMonth !== "all") {
          if (m.birthMonth !== selectedMonth) return false;
        }

        // Gender filter
        if (genderFilter === "M") {
          const g = (m.gender || "").toLowerCase();
          if (g !== "m" && g !== "masculino") return false;
        } else if (genderFilter === "F") {
          const g = (m.gender || "").toLowerCase();
          if (g !== "f" && g !== "femenino") return false;
        }

        // Search filter
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const fullName = `${m.name} ${m.paternalSurname || ""} ${m.maternalSurname || ""}`.toLowerCase();
          const phone = (m.phone || "").toLowerCase();
          if (!fullName.includes(q) && !phone.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by birthday day within selected month
        if (a.birthMonth !== b.birthMonth) {
          return (a.birthMonth || 0) - (b.birthMonth || 0);
        }
        return (a.birthDay || 0) - (b.birthDay || 0);
      });
  }, [membersList, selectedMonth, genderFilter, search, currentDay, currentMonth]);

  function openCreateModal() {
    setEditingMember(null);
    setFormData({
      name: "",
      paternalSurname: "",
      maternalSurname: "",
      birthDay: currentDay,
      birthMonth: currentMonth,
      phone: "",
      gender: "Masculino",
      ministryId: "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(m: Member) {
    setEditingMember(m);
    setFormData({
      name: m.name,
      paternalSurname: m.paternalSurname || "",
      maternalSurname: m.maternalSurname || "",
      birthDay: m.birthDay || 1,
      birthMonth: m.birthMonth || 1,
      phone: m.phone || "",
      gender: m.gender || "Masculino",
      ministryId: m.ministryId || "",
    });
    setIsModalOpen(true);
  }

  async function handleSaveMember(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Por favor ingresa el nombre.");
      return;
    }

    try {
      if (editingMember) {
        setIsUpdating(editingMember.id);
        const res = await updateMember(editingMember.id, {
          name: formData.name.trim(),
          paternalSurname: formData.paternalSurname.trim() || null,
          maternalSurname: formData.maternalSurname.trim() || null,
          birthDay: Number(formData.birthDay),
          birthMonth: Number(formData.birthMonth),
          phone: formData.phone.trim() || null,
          gender: formData.gender,
          ministryId: formData.ministryId || null,
        });

        if (res.success) {
          setMembersList((prev) =>
            prev.map((item) =>
              item.id === editingMember.id
                ? {
                    ...item,
                    name: formData.name.trim(),
                    paternalSurname: formData.paternalSurname.trim() || null,
                    maternalSurname: formData.maternalSurname.trim() || null,
                    birthDay: Number(formData.birthDay),
                    birthMonth: Number(formData.birthMonth),
                    phone: formData.phone.trim() || null,
                    gender: formData.gender,
                    ministryId: formData.ministryId || null,
                  }
                : item
            )
          );
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar.");
        }
      } else {
        const res = await createMember({
          name: formData.name.trim(),
          paternalSurname: formData.paternalSurname.trim() || null,
          maternalSurname: formData.maternalSurname.trim() || null,
          birthDay: Number(formData.birthDay),
          birthMonth: Number(formData.birthMonth),
          phone: formData.phone.trim() || null,
          gender: formData.gender,
          ministryId: formData.ministryId || null,
          photo: null,
          campusId: null,
          isActive: true,
        });

        if (res.success && res.member) {
          setMembersList((prev) => [...prev, res.member]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al registrar.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Seguro que deseas eliminar a este miembro del registro?")) return;
    setIsUpdating(id);
    try {
      const res = await deleteMember(id);
      if (res.success) {
        setMembersList((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert(res.error || "No se pudo eliminar.");
      }
    } finally {
      setIsUpdating(null);
    }
  }

  function getWhatsAppUrl(member: Member) {
    const rawPhone = member.phone?.replace(/\D/g, "") || "";
    let clean = rawPhone;
    if (clean.length === 10) clean = `52${clean}`;
    const text = `¡Paz y gracia, ${member.name}! En nombre de Comunidad de Cristo Internacional te enviamos una muy afectuosa felicitación por tu cumpleaños. Oramos para que Dios continúe derramando de su gracia, salud y bendición sobre tu vida en este nuevo año.`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Cake className="w-7 h-7 text-gold" /> Cumpleaños y Directorio de Miembros
          </h1>
          <p className="text-gray-500 text-sm">
            Control de fechas de nacimiento, felicitaciones directas por WhatsApp y directorio congregacional.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gold hover:bg-gold-dark text-navy font-bold flex items-center gap-2 shadow-xs"
        >
          <UserPlus className="w-4 h-4" /> Registrar Miembro
        </Button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Cumpleaños Hoy */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white p-5 rounded-2xl border border-amber-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Cumpleañeros Hoy
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-950">{birthdaysToday.length}</p>
          <p className="text-xs text-amber-700 mt-1">
            {birthdaysToday.length > 0
              ? `${birthdaysToday.map((m) => m.name).slice(0, 2).join(", ")}${birthdaysToday.length > 2 ? "..." : ""}`
              : "No hay cumpleaños el día de hoy"}
          </p>
        </div>

        {/* Cumpleaños Este Mes */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Cumpleaños en {MONTH_NAMES[currentMonth - 1]}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy">{birthdaysThisMonth.length}</p>
          <p className="text-xs text-gray-500 mt-1">Miembros cumplen años este mes</p>
        </div>

        {/* Total Congregación */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Miembros Registrados
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-navy">{membersList.length}</p>
          <p className="text-xs text-gray-500 mt-1">Directorio activo de la iglesia</p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
        {/* Selector de Mes */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setSelectedMonth("today")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5",
              selectedMonth === "today"
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" /> Hoy ({birthdaysToday.length})
          </button>
          <button
            onClick={() => setSelectedMonth("this_month")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer",
              selectedMonth === "this_month"
                ? "bg-navy text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Este Mes ({birthdaysThisMonth.length})
          </button>
          <button
            onClick={() => setSelectedMonth("all")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer",
              selectedMonth === "all"
                ? "bg-navy text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            Todo el Año ({membersList.length})
          </button>
          <span className="text-gray-300 mx-1">|</span>
          {MONTH_NAMES.map((name, idx) => {
            const monthNum = idx + 1;
            const count = membersList.filter((m) => m.birthMonth === monthNum).length;
            return (
              <button
                key={monthNum}
                onClick={() => setSelectedMonth(monthNum)}
                className={cn(
                  "px-2.5 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer",
                  selectedMonth === monthNum
                    ? "bg-gold text-navy font-bold shadow-xs"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {name} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Buscador y género */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, apellido o teléfono..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="text-gray-400 font-semibold">Género:</span>
            {[
              { key: "all", label: "Todos" },
              { key: "M", label: "Varones" },
              { key: "F", label: "Mujeres" },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => setGenderFilter(g.key as any)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors",
                  genderFilter === g.key
                    ? "bg-navy text-white font-bold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Miembros y Cumpleaños */}
      <Card className="overflow-hidden border border-gray-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Miembro</th>
                <th className="px-6 py-4 font-semibold">Fecha de Cumpleaños</th>
                <th className="px-6 py-4 font-semibold">Teléfono</th>
                <th className="px-6 py-4 font-semibold">Género</th>
                <th className="px-6 py-4 font-semibold text-right">Felicitación / Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((member) => {
                const isToday =
                  member.birthDay === currentDay && member.birthMonth === currentMonth;
                const monthName = member.birthMonth
                  ? MONTH_NAMES[member.birthMonth - 1]
                  : "Por definir";

                const fullName = `${member.name} ${member.paternalSurname || ""} ${member.maternalSurname || ""}`.trim();

                return (
                  <tr
                    key={member.id}
                    className={cn(
                      "transition-colors",
                      isToday ? "bg-amber-50/60 hover:bg-amber-100/60" : "hover:bg-gray-50/60"
                    )}
                  >
                    <td className="px-6 py-4 font-medium text-navy flex items-center gap-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0",
                          isToday
                            ? "bg-amber-500 text-white ring-2 ring-amber-300"
                            : "bg-navy/5 text-navy border border-navy/10"
                        )}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-navy">{fullName}</p>
                          {isToday && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-navy uppercase tracking-wider">
                              <Sparkles className="w-3 h-3" /> Hoy
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Cake
                          className={cn(
                            "w-4 h-4",
                            isToday ? "text-amber-600" : "text-gray-400"
                          )}
                        />
                        <span className="font-bold text-navy">
                          {member.birthDay ? `${member.birthDay} de ${monthName}` : "Sin fecha"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {member.phone ? (
                        <span className="font-mono text-xs text-gray-700 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {member.phone}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Sin teléfono</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs font-medium">
                      {member.gender === "F" || member.gender === "Femenino" ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                          Mujer
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Varón
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {member.phone && (
                          <a
                            href={getWhatsAppUrl(member)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs",
                              isToday
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300 animate-pulse"
                                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                            )}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        )}

                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
                          title="Editar miembro"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={isUpdating === member.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Eliminar miembro"
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

          {filteredMembers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Cake className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-navy">No se encontraron miembros en este filtro.</p>
              <p className="text-xs text-gray-400 mt-1">
                Prueba cambiando el mes o borrando la búsqueda.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal Crear / Editar Miembro */}
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
                <Cake className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-xl font-black text-navy">
                  {editingMember ? "Editar Miembro" : "Registrar Nuevo Miembro"}
                </h3>
                <p className="text-xs text-gray-500">
                  {editingMember
                    ? "Actualiza los datos personales y de cumpleaños"
                    : "Ingresa los datos para registrarlo en el directorio de la iglesia"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Nombre(s) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Juan Carlos"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    value={formData.paternalSurname}
                    onChange={(e) =>
                      setFormData({ ...formData, paternalSurname: e.target.value })
                    }
                    placeholder="Ej. González"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    value={formData.maternalSurname}
                    onChange={(e) =>
                      setFormData({ ...formData, maternalSurname: e.target.value })
                    }
                    placeholder="Ej. Treviño"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Día de Cumpleaños
                  </label>
                  <select
                    value={formData.birthDay}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDay: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Mes
                  </label>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, birthMonth: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={i + 1} value={i + 1}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Teléfono (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10 dígitos (ej. 8621234567)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Género
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Ministerio al que asiste
                </label>
                <select
                  value={formData.ministryId}
                  onChange={(e) => setFormData({ ...formData, ministryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
                >
                  <option value="">Ninguno / General</option>
                  {ministriesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
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
                    "Guardar Miembro"
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
