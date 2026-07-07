"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createCampus, updateCampus } from "@/actions/structure";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function CampusForm({ campus, onCancel }: { campus?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (campus) {
        await updateCampus(campus.id, formData);
      } else {
        await createCampus(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar la sede.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{campus ? "Editar Campus" : "Nuevo Campus"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre del Campus" name="name" defaultValue={campus?.name} required placeholder="Ej. Allende" />
            <Input label="Estado" name="state" defaultValue={campus?.state || "Coahuila"} required />
          </div>

          <div className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input type="checkbox" id="isMain" name="isMain" defaultChecked={campus?.isMain} className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold" />
            <label htmlFor="isMain" className="text-sm font-semibold text-navy cursor-pointer">¿Es el campus principal?</label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pastor Principal / Encargado" name="pastor" defaultValue={campus?.pastor} required />
            <Input label="Teléfono de Contacto" name="phone" defaultValue={campus?.phone} required />
          </div>

          <Input label="Dirección Completa" name="address" defaultValue={campus?.address} required />

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Descripción</label>
            <textarea 
              name="description" 
              defaultValue={campus?.description}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Fotografía de la Sede (Opcional)
            </label>
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
            {campus?.image && (
              <p className="mt-2 text-xs text-gray-500">Ya hay una imagen subida. Selecciona otra solo si deseas cambiarla.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {campus ? "Guardar Cambios" : "Añadir Campus"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
