"use client";

import { useState } from "react";
import { updateTestimonyStatus, deleteTestimony } from "@/actions/testimonies";
import { Card, Badge, Button } from "@/components/ui";
import { Check, X as XIcon, Trash2, User, Loader2, Heart } from "lucide-react";

interface TestimoniosListClientProps {
  initialTestimonies: any[];
}

export function TestimoniosListClient({ initialTestimonies }: TestimoniosListClientProps) {
  const [testimonies, setTestimonies] = useState(initialTestimonies);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: "pending" | "approved" | "rejected") {
    setUpdatingId(id);
    try {
      await updateTestimonyStatus(id, status);
      setTestimonies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err: any) {
      alert(err.message || "Error al actualizar estado del testimonio.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar este testimonio permanentemente?")) return;

    setUpdatingId(id);
    try {
      await deleteTestimony(id);
      setTestimonies((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar el testimonio.");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = testimonies.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Heart className="w-6 h-6 text-gold fill-gold" /> Gestión de Testimonios
        </h1>
        <p className="text-gray-500 text-sm">
          Modera, aprueba o rechaza los testimonios enviados por los miembros antes de publicarlos en el muro público.
        </p>
      </div>

      {/* Filtros por estado */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {[
          { key: "all", label: "Todos" },
          { key: "pending", label: "Pendientes" },
          { key: "approved", label: "Aprobados" },
          { key: "rejected", label: "Rechazados" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              filter === tab.key
                ? "bg-navy text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 hover:text-navy border border-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de testimonios */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Miembro</th>
                <th className="px-6 py-4 font-semibold">Testimonio</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Miembro info */}
                  <td className="px-6 py-4 font-medium text-navy flex items-center gap-3">
                    {t.user.image ? (
                      <img src={t.user.image} alt={t.user.name} className="w-8 h-8 rounded-full border border-gray-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-xs">
                        <User className="w-3.5 h-3.5 text-navy" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm leading-none mb-1">{t.user.name}</p>
                      <p className="text-xs text-gray-400 font-normal">{t.user.email}</p>
                    </div>
                  </td>

                  {/* Testimony Content */}
                  <td className="px-6 py-4 max-w-md text-gray-600 font-serif italic text-xs leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                    {new Date(t.createdAt).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    {t.status === "approved" && (
                      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                        Aprobado
                      </Badge>
                    )}
                    {t.status === "pending" && (
                      <Badge variant="navy" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Pendiente
                      </Badge>
                    )}
                    {t.status === "rejected" && (
                      <Badge variant="gold" className="bg-red-100 text-red-700 hover:bg-red-100">
                        Rechazado
                      </Badge>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {updatingId === t.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-navy" />
                      ) : (
                        <>
                          {t.status !== "approved" && (
                            <button
                              onClick={() => handleStatusChange(t.id, "approved")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                              title="Aprobar para publicación pública"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {t.status !== "rejected" && (
                            <button
                              onClick={() => handleStatusChange(t.id, "rejected")}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Rechazar y ocultar de la web"
                            >
                              <XIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                    No se encontraron testimonios {filter !== "all" ? `en estado ${filter}` : ""}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
