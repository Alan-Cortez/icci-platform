"use client";

import { useState } from "react";
import { Card } from "@/components/ui";
import { Trash2, Loader2, Droplets, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { deleteBaptismRegistration, updateBaptismStatus } from "@/actions/baptisms";
import { cn } from "@/lib/utils";

export function BaptismListClient({ initialBaptisms }: { initialBaptisms: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: "pending" | "approved" | "completed") {
    setLoadingId(id);
    try {
      await updateBaptismStatus(id, newStatus);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      setLoadingId(id);
      try {
        await deleteBaptismRegistration(id);
      } finally {
        setLoadingId(null);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy mb-2">Registros de Bautizos</h1>
        <p className="text-gray-500">Administra los candidatos para los próximos bautismos.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialBaptisms.map((baptism) => (
          <Card key={baptism.id} className="p-0 overflow-hidden flex flex-col bg-white">
            <div className={cn(
              "p-4 border-b flex justify-between items-center",
              baptism.status === "completed" ? "bg-green-50 border-green-100" :
              baptism.status === "approved" ? "bg-blue-50 border-blue-100" :
              "bg-gray-50 border-gray-100"
            )}>
              <div className="flex items-center gap-3">
                <Droplets className={cn(
                  "w-6 h-6",
                  baptism.status === "completed" ? "text-green-500" :
                  baptism.status === "approved" ? "text-blue-500" :
                  "text-gray-400"
                )} />
                <div>
                  <h3 className="font-bold text-navy text-lg leading-tight">{baptism.fullName}</h3>
                  <span className="text-xs text-gray-500">{baptism.age} años</span>
                </div>
              </div>
              <select
                value={baptism.status}
                onChange={(e) => handleStatusChange(baptism.id, e.target.value as any)}
                disabled={loadingId === baptism.id}
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer",
                  baptism.status === "completed" ? "bg-green-200 text-green-800" :
                  baptism.status === "approved" ? "bg-blue-200 text-blue-800" :
                  "bg-amber-100 text-amber-800"
                )}
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="completed">Bautizado</option>
              </select>
            </div>
            
            <div className="p-6 flex-1">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gold" /> Campus {baptism.campus}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gold" /> {baptism.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gold" /> {baptism.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" /> Registrado el {new Date(baptism.createdAt).toLocaleDateString()}
                </div>
              </div>

              {baptism.notes && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700">
                  <span className="font-semibold block mb-1">Notas:</span>
                  {baptism.notes}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button 
                onClick={() => handleDelete(baptism.id)}
                disabled={loadingId === baptism.id}
                className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
              >
                {loadingId === baptism.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Eliminar Registro
              </button>
            </div>
          </Card>
        ))}

        {initialBaptisms.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay registros</h3>
            <p className="text-gray-500">Los candidatos a bautismo aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
