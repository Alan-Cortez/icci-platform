"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createGalleryImage, updateGalleryImage } from "@/actions/content";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function GaleriaForm({ photo, onCancel }: { photo?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (photo) {
        await updateGalleryImage(photo.id, formData);
      } else {
        await createGalleryImage(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{photo ? "Editar Imagen" : "Añadir Imagen"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Título Corto (Ej. Retiro 2025)" name="title" defaultValue={photo?.title} required />
          
          <Input label="Enlace de la imagen (URL)" name="imageUrl" defaultValue={photo?.imageUrl} required placeholder="https://ejemplo.com/imagen.jpg" />

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Categoría</label>
            <select name="category" defaultValue={photo?.category || "Todos"} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold/50">
              <option value="Todos">General (Todos)</option>
              <option value="Campus">Campus</option>
              <option value="Eventos">Eventos</option>
              <option value="Ministerios">Ministerios</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Descripción (Opcional)</label>
            <textarea 
              name="description" 
              defaultValue={photo?.description}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
              placeholder="Detalles sobre este momento..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {photo ? "Guardar Cambios" : "Añadir a Galería"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
