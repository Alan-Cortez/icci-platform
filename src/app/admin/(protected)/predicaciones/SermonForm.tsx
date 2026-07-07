"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createSermon, updateSermon } from "@/actions/content";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function SermonForm({ sermon, onCancel }: { sermon?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (sermon) {
        await updateSermon(sermon.id, formData);
      } else {
        await createSermon(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la predicación.");
    } finally {
      setLoading(false);
    }
  }

  // Format date for input type="date" if it exists
  const defaultDate = sermon ? new Date(sermon.date).toISOString().split('T')[0] : "";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{sermon ? "Editar Predicación" : "Nueva Predicación"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Título de la Predicación" name="title" defaultValue={sermon?.title} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Predicador (Ej: Pastor Juan)" name="speaker" defaultValue={sermon?.speaker} required />
            <Input label="Fecha" name="date" type="date" defaultValue={defaultDate} required />
          </div>

          <Input 
            label="ID del video en YouTube (Ej: dQw4w9WgXcQ)" 
            name="youtubeUrl" 
            defaultValue={sermon?.youtubeUrl} 
            required 
            placeholder="Solo el ID, no el link completo"
          />

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Descripción Corta (Opcional)</label>
            <textarea 
              name="description" 
              defaultValue={sermon?.description}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Miniatura del Video {sermon ? "(Opcional si no la cambias)" : "(Opcional)"}
            </label>
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
            {sermon?.image && (
              <p className="mt-2 text-xs text-gray-500">Ya hay una imagen subida. Selecciona otra solo si deseas cambiarla.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {sermon ? "Guardar Cambios" : "Añadir Predicación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
