"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Shield, User, Loader2 } from "lucide-react";
import { updateUserRole } from "@/actions/users";

export function UsuariosClient({ initialUsers }: { initialUsers: any[] }) {
  const [usersList, setUsersList] = useState(initialUsers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  async function handleToggleRole(userId: string, currentRole: string) {
    if (currentRole === "superadmin") return; // Cannot change superadmin
    
    setIsUpdating(userId);
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      setUsersList((prev) => 
        prev.map((u) => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch (e) {
      console.error(e);
      alert("Error al actualizar rol");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Gestión de Usuarios</h1>
          <p className="text-gray-500 text-sm">Administra quién tiene acceso al panel de control.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Usuario</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    {user.name || "Sin nombre"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === "superadmin" && <Badge variant="gold">Super Admin</Badge>}
                    {user.role === "admin" && <Badge variant="navy">Administrador</Badge>}
                    {user.role === "user" && <Badge variant="default">Usuario Normal</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== "superadmin" && (
                      <Button
                        variant={user.role === "admin" ? "outline" : "primary"}
                        size="sm"
                        disabled={isUpdating === user.id}
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className="min-w-[140px]"
                      >
                        {isUpdating === user.id ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando</>
                        ) : user.role === "admin" ? (
                          "Quitar Admin"
                        ) : (
                          <><Shield className="w-4 h-4 mr-2" /> Hacer Admin</>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usersList.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay usuarios registrados.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
