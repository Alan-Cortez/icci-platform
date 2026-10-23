"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import {
  Shield,
  User,
  Loader2,
  Search,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import { updateUserRole, toggleUserActive } from "@/actions/users";
import { cn } from "@/lib/utils";

export function UsuariosClient({ initialUsers }: { initialUsers: any[] }) {
  const [usersList, setUsersList] = useState(initialUsers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [search, setSearch] = useState("");

  async function handleToggleRole(userId: string, currentRole: string) {
    if (currentRole === "superadmin") return;

    setIsUpdating(userId);
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (e) {
      console.error(e);
      alert("Error al actualizar rol");
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

  const filtered = usersList.filter((u) => {
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && (u.role === "admin" || u.role === "superadmin")) ||
      (roleFilter === "user" && u.role === "user");
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-gold" /> Gestión de Usuarios
          </h1>
          <p className="text-gray-500 text-sm">
            Administra los roles, permisos de acceso y estado de las cuentas registradas.
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todos", count: usersList.length },
            {
              key: "admin",
              label: "Administradores",
              count: usersList.filter((u) => u.role === "admin" || u.role === "superadmin").length,
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
                "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre o correo..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200/80">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
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
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
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
                    {user.role === "superadmin" && <Badge variant="gold">Super Admin</Badge>}
                    {user.role === "admin" && <Badge variant="navy">Administrador</Badge>}
                    {user.role === "user" && <Badge variant="default">Miembro</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "superadmin" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleToggleActive(user.id, user.isActive !== false, user.role)
                          }
                          disabled={isUpdating === user.id}
                          title={
                            user.isActive !== false
                              ? "Desactivar cuenta"
                              : "Reactivar cuenta"
                          }
                          className={cn(
                            "p-2 rounded-xl border transition-colors cursor-pointer",
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
                          variant={user.role === "admin" ? "outline" : "primary"}
                          size="sm"
                          disabled={isUpdating === user.id}
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="min-w-[140px]"
                        >
                          {isUpdating === user.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando
                            </>
                          ) : user.role === "admin" ? (
                            "Quitar Admin"
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" /> Hacer Admin
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No se encontraron usuarios con esos criterios.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
