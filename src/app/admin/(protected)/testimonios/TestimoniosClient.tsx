"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Check, X, Loader2, Trash2 } from "lucide-react";
import { updateTestimonyStatus, deleteTestimony } from "@/actions/testimonies";

export function TestimoniosClient({ initialTestimonies }: { initialTestimonies: any[] }) {
  const [testimonios, setTestimonios] = useState(initialTestimonies);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  async function handleStatus(id: string, status: "approved" | "rejected") {
    setIsUpdating(id);
    try {
      await updateTestimonyStatus(id, status);
      setTestimonios(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    } catch (error) {
      alert("Error al actualizar el estado");
    } finally {
      setIsUpdating(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que deseas eliminar este testimonio?")) return;
    setIsUpdating(id);
    try {
      await deleteTestimony(id);
      setTestimonios(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Testimonios</h1>
          <p className="text-gray-500 text-sm">Aprueba o rechaza los testimonios enviados por los usuarios.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {testimonios.map((t) => (
          <Card key={t.id} className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="font-semibold text-navy">{t.userName || "Usuario Anónimo"}</div>
                  <div className="text-sm text-gray-500">{t.userEmail}</div>
                  <Badge variant={
                    t.status === 'approved' ? 'gold' :
                    t.status === 'rejected' ? 'default' : 'navy'
                  }>
                    {t.status === 'approved' ? 'Aprobado' :
                     t.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                  </Badge>
                  <div className="text-xs text-gray-400 ml-auto">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 italic border-l-4 border-gold pl-4 py-2 bg-gray-50/50">"{t.content}"</p>
              </div>
              <div className="flex sm:flex-col gap-2 justify-center">
                {t.status !== 'approved' && (
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    size="sm"
                    disabled={isUpdating === t.id}
                    onClick={() => handleStatus(t.id, 'approved')}
                  >
                    {isUpdating === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Aprobar
                  </Button>
                )}
                {t.status !== 'rejected' && (
                  <Button
                    variant="outline"
                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    size="sm"
                    disabled={isUpdating === t.id}
                    onClick={() => handleStatus(t.id, 'rejected')}
                  >
                    {isUpdating === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />} Rechazar
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-auto"
                  size="sm"
                  disabled={isUpdating === t.id}
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {testimonios.length === 0 && (
          <Card className="p-12 text-center text-gray-500">
            No hay testimonios aún.
          </Card>
        )}
      </div>
    </div>
  );
}
