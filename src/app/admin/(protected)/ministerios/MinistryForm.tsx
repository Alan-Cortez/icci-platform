"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createMinistry, updateMinistry } from "@/actions/structure";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function MinistryForm({ ministry, onCancel }: { ministry?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (ministry) {
        await updateMinistry(ministry.id, formData);
      } else {
        await createMinistry(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el ministerio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{ministry ? "Editar Ministerio" : "Nuevo Ministerio"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Nombre del Ministerio" name="name" defaultValue={ministry?.name} required placeholder="Ej. Jóvenes, Femenil..." />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Líder Encargado (Opcional)" name="leader" defaultValue={ministry?.leader} />
            <Input label="Horario de Reunión (Opcional)" name="schedule" defaultValue={ministry?.schedule} placeholder="Ej. Sábados 7:00 PM" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Descripción</label>
            <textarea 
              name="description" 
              defaultValue={ministry?.description}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <Input label="URL de Imagen (Opcional)" name="image" defaultValue={ministry?.image} placeholder="https://ejemplo.com/foto.jpg" />

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {ministry ? "Guardar Cambios" : "Añadir Ministerio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
