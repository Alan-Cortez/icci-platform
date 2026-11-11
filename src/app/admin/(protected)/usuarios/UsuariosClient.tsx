"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import {
  Shield,
  User,
  Loader2,
  Search,
  Users,
  UserCheck,
  UserX,
  X,
  Layers,
  Crown,
  BookMarked,
  MapPin,
} from "lucide-react";
import { updateUserRole, toggleUserActive } from "@/actions/users";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/next-auth";

interface MinistryItem {
  id: string;
  name: string;
  slug: string;
}

interface CampusItem {
  id: string;
  name: string;
}

interface UserItem {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  ministryId: string | null;
  campusId: string | null;
  canManagePreachings?: boolean;
  isActive: boolean;
  createdAt: number | Date | null;
}

export function UsuariosClient({
  initialUsers,
  ministriesList,
  campusesList = [],
  currentUserRole,
}: {
  initialUsers: any[];
  ministriesList: MinistryItem[];
  campusesList?: CampusItem[];
  currentUserRole: string;
}) {
  const [usersList, setUsersList] = useState<UserItem[]>(initialUsers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "pastor_campus" | "pastor" | "leader" | "user"
  >("all");
  const [search, setSearch] = useState("");

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>("");
  const [selectedCampusId, setSelectedCampusId] = useState<string>("");
  const [canManagePreachings, setCanManagePreachings] = useState<boolean>(false);

  function openEditModal(user: UserItem) {
    setEditingUser(user);
    setSelectedRole(user.role as UserRole);
    setSelectedMinistryId(user.ministryId || (ministriesList[0]?.id ?? ""));
    setSelectedCampusId(user.campusId || (campusesList[0]?.id ?? ""));
    setCanManagePreachings(Boolean(user.canManagePreachings));
  }

  function closeEditModal() {
    setEditingUser(null);
  }

  async function handleSaveRole() {
    if (!editingUser) return;
    setIsUpdating(editingUser.id);
    try {
      const res = await updateUserRole(editingUser.id, selectedRole, {
        ministryId: selectedRole === "leader" ? selectedMinistryId : null,
        campusId: selectedRole === "pastor_campus" ? selectedCampusId : null,
        canManagePreachings: selectedRole === "pastor" ? canManagePreachings : false,
      });

      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  role: selectedRole,
                  ministryId: selectedRole === "leader" ? selectedMinistryId : null,
                  campusId: selectedRole === "pastor_campus" ? selectedCampusId : null,
                  canManagePreachings:
                    selectedRole === "pastor"
                      ? canManagePreachings
                      : selectedRole === "superadmin" ||
                        selectedRole === "admin" ||
                        selectedRole === "pastor_general" ||
                        selectedRole === "pastor_campus",
                }
              : u
          )
        );
        closeEditModal();
      } else {
        alert(res.error || "Error al actualizar rol");
      }
    } catch (e) {
      console.error(e);
      alert("Error en el servidor");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleToggleActive(userId: string, currentActive: boolean, role: string) {
    if (role === "superadmin") return;
    setIsUpdating(userId);
    try {
      const res = await toggleUserActive(userId);
      if (res.success) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
        );
      } else if (res.error) {
        alert(res.error);
      }
    } finally {
      setIsUpdating(null);
    }
  }

  const ministryMap = new Map(ministriesList.map((m) => [m.id, m.name]));
  const campusMap = new Map(campusesList.map((c) => [c.id, c.name]));

  const filtered = usersList.filter((u) => {
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" &&
        (u.role === "admin" || u.role === "superadmin" || u.role === "pastor_general")) ||
      (roleFilter === "pastor_campus" && u.role === "pastor_campus") ||
      (roleFilter === "pastor" && u.role === "pastor") ||
      (roleFilter === "leader" && u.role === "leader") ||
      (roleFilter === "user" && u.role === "user");

    const q = search.trim().toLowerCase();
    const minName = u.ministryId ? (ministryMap.get(u.ministryId) || "").toLowerCase() : "";
    const campName = u.campusId ? (campusMap.get(u.campusId) || "").toLowerCase() : "";
    const matchesSearch =
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      minName.includes(q) ||
      campName.includes(q);

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-gold" /> Gestión de Usuarios y Liderazgo
          </h1>
          <p className="text-gray-500 text-sm">
            Administra roles jerárquicos: Super Admins, Pastor General, Administradores, Pastores de Campus, Pastores, Líderes y Miembros.
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todos", count: usersList.length },
            {
              key: "admin",
              label: "Admins / Pastor General",
              count: usersList.filter(
                (u) => u.role === "admin" || u.role === "superadmin" || u.role === "pastor_general"
              ).length,
            },
            {
              key: "pastor_campus",
              label: "Pastores Campus",
              count: usersList.filter((u) => u.role === "pastor_campus").length,
            },
            {
              key: "pastor",
              label: "Pastores",
              count: usersList.filter((u) => u.role === "pastor").length,
            },
            {
              key: "leader",
              label: "Líderes",
              count: usersList.filter((u) => u.role === "leader").length,
            },
            {
              key: "user",
              label: "Miembros",
              count: usersList.filter((u) => u.role === "user").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key as any)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                roleFilter === tab.key
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  roleFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, correo, campus..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200/80 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Rol Asignado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => {
                const assignedMinistry = user.ministryId ? ministryMap.get(user.ministryId) : null;
                const assignedCampus = user.campusId ? campusMap.get(user.campusId) : null;
                const isSuperAdmin = user.role === "superadmin";

                return (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-navy flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-navy/5 text-navy font-bold flex items-center justify-center border border-navy/10">
                          {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-gray-500" />}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-navy">{user.name || "Sin nombre"}</p>
                        {user.createdAt && (
                          <p className="text-[11px] text-gray-400">
                            Registro:{" "}
                            {new Date(user.createdAt).toLocaleDateString("es-MX", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/60">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === "superadmin" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                          <Crown className="w-3.5 h-3.5 text-amber-600" /> Super Admin
                        </span>
                      )}
                      {user.role === "pastor_general" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          <Crown className="w-3.5 h-3.5 text-gold-dark" /> Pastor General
                        </span>
                      )}
                      {user.role === "admin" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          <Shield className="w-3.5 h-3.5 text-blue-600" /> Administrador
                        </span>
                      )}
                      {user.role === "pastor_campus" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Pastor Campus:{" "}
                          {assignedCampus || "General"}
                        </span>
                      )}
                      {user.role === "pastor" && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-200">
                            <BookMarked className="w-3.5 h-3.5 text-purple-600" /> Pastor
                          </span>
                          {user.canManagePreachings && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-navy border border-gold/40">
                              + Predicaciones
                            </span>
                          )}
                        </div>
                      )}
                      {user.role === "leader" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <Layers className="w-3.5 h-3.5 text-emerald-600" />
                          Líder: {assignedMinistry || "General"}
                        </span>
                      )}
                      {user.role === "user" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Miembro
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(!isSuperAdmin || currentUserRole === "superadmin") && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleToggleActive(user.id, user.isActive !== false, user.role)
                            }
                            disabled={isUpdating === user.id || isSuperAdmin}
                            title={user.isActive !== false ? "Desactivar cuenta" : "Reactivar cuenta"}
                            className={cn(
                              "p-2 rounded-xl border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
                              user.isActive !== false
                                ? "border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            )}
                          >
                            {user.isActive !== false ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isUpdating === user.id}
                            onClick={() => openEditModal(user)}
                            className="bg-navy hover:bg-navy/90 text-white font-bold"
                          >
                            <Shield className="w-4 h-4 mr-1.5 text-gold" /> Asignar Rol
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No se encontraron usuarios con esos criterios.
            </div>
          )}
        </div>
      </Card>

      {/* Modal Asignar Rol */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={closeEditModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">Asignar Rol y Permisos</h3>
                <p className="text-xs text-gray-500 truncate max-w-[280px]">
                  {editingUser.name || editingUser.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Selecciona el Rol
                </label>
                <div className="space-y-2">
                  {[
                    ...(currentUserRole === "superadmin"
                      ? [
                          {
                            val: "superadmin" as UserRole,
                            title: "Super Admin",
                            desc: "Acceso total y configuración del sistema",
                          },
                        ]
                      : []),
                    {
                      val: "pastor_general" as UserRole,
                      title: "Pastor General",
                      desc: "Puede hacer todo lo que hace un administrador en toda la plataforma",
                    },
                    {
                      val: "admin" as UserRole,
                      title: "Administrador General",
                      desc: "Gestión completa de contenidos, eventos, ministerios y usuarios",
                    },
                    {
                      val: "pastor_campus" as UserRole,
                      title: "Pastor de Campus",
                      desc: "Administra su campus, puede crear eventos web, planeación y predicaciones",
                    },
                    {
                      val: "pastor" as UserRole,
                      title: "Pastor",
                      desc: "Solo lectura en eventos, planeación y ministerios (opcionalmente gestiona predicaciones)",
                    },
                    {
                      val: "leader" as UserRole,
                      title: "Líder de Ministerio",
                      desc: "Acceso exclusivo a su ministerio asignado y al calendario de planeación",
                    },
                    {
                      val: "user" as UserRole,
                      title: "Miembro",
                      desc: "Usuario regular sin acceso al panel administrativo",
                    },
                  ].map((option) => (
                    <label
                      key={option.val}
                      onClick={() => setSelectedRole(option.val)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                        selectedRole === option.val
                          ? "border-gold bg-gold/5 ring-1 ring-gold"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <input
                        type="radio"
                        name="roleOption"
                        checked={selectedRole === option.val}
                        onChange={() => setSelectedRole(option.val)}
                        className="mt-1 text-gold focus:ring-gold"
                      />
                      <div>
                        <p className="text-sm font-bold text-navy">{option.title}</p>
                        <p className="text-xs text-gray-500">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {selectedRole === "pastor_campus" && (
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Campus Asignado
                  </label>
                  <select
                    value={selectedCampusId}
                    onChange={(e) => setSelectedCampusId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium bg-white"
                  >
                    {campusesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        Campus {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedRole === "pastor" && (
                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-purple-200 bg-purple-50/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={canManagePreachings}
                    onChange={(e) => setCanManagePreachings(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-gold rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-navy">
                      Autorizar gestión de Predicaciones del Mes
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      Permite a este pastor programar y editar a quién le toca predicar cada mes. Si no se marca, solo tendrá vista de lectura.
                    </p>
                  </div>
                </label>
              )}

              {selectedRole === "leader" && (
                <div className="pt-3 border-t border-gray-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    Ministerio que Lidera
                  </label>
                  <select
                    value={selectedMinistryId}
                    onChange={(e) => setSelectedMinistryId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium bg-white"
                  >
                    {ministriesList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    El usuario figurará oficialmente como líder de este ministerio.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating === editingUser.id}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <Button
                variant="primary"
                onClick={handleSaveRole}
                disabled={isUpdating === editingUser.id}
                className="bg-gold hover:bg-gold-dark text-navy font-bold px-5"
              >
                {isUpdating === editingUser.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Guardando...
                  </>
                ) : (
                  "Guardar Permisos"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
