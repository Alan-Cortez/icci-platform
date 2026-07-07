"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Trash2, CheckCircle, Clock, Phone, Loader2 } from "lucide-react";
import { deletePrayerRequest, updatePrayerStatus } from "@/actions/prayers";
import { cn } from "@/lib/utils";

export function PrayerListClient({ initialPrayers }: { initialPrayers: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleToggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "pending" ? "prayed" : "pending";
    setLoadingId(id);
    try {
      await updatePrayerStatus(id, newStatus as "pending" | "prayed");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar esta petición?")) {
      setLoadingId(id);
      try {
        await deletePrayerRequest(id);
      } finally {
        setLoadingId(null);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy mb-2">Solicitudes de Oración</h1>
        <p className="text-gray-500">Administra las peticiones, testimonios y agradecimientos de la congregación.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialPrayers.map((prayer) => (
          <Card key={prayer.id} className={cn("p-6 transition-all", prayer.status === "prayed" ? "opacity-75 bg-gray-50" : "bg-white")}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-navy text-lg">{prayer.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(prayer.createdAt).toLocaleDateString()}</span>
                  {prayer.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {prayer.phone}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(prayer.id, prayer.status)}
                  disabled={loadingId === prayer.id}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1",
                    prayer.status === "pending" 
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  )}
                >
                  {loadingId === prayer.id ? (
                     <Loader2 className="w-3 h-3 animate-spin" />
                  ) : prayer.status === "pending" ? (
                    "Marcar como Orada"
                  ) : (
                    <><CheckCircle className="w-3 h-3" /> Orada</>
                  )}
                </button>
                <button 
                  onClick={() => handleDelete(prayer.id)}
                  disabled={loadingId === prayer.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap">
              {prayer.request}
            </div>
          </Card>
        ))}

        {initialPrayers.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <h3 className="text-xl font-bold text-navy mb-2">No hay peticiones</h3>
            <p className="text-gray-500">Las solicitudes de oración aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
