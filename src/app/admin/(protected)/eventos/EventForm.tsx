"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createEvent, updateEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function EventForm({ event, onCancel }: { event?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (event) {
        await updateEvent(event.id, formData);
      } else {
        await createEvent(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el evento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{event ? "Editar Evento" : "Nuevo Evento"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Título del Evento" name="title" defaultValue={event?.title} required />
          
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Categoría</label>
              <select name="category" defaultValue={event?.category || "Jóvenes"} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors" required>
                <option value="Jóvenes">Jóvenes</option>
                <option value="Niños">Niños</option>
                <option value="Varones">Varones</option>
                <option value="Femenil">Femenil</option>
                <option value="General">General</option>
              </select>
            </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Descripción</label>
            <textarea 
              name="description" 
              defaultValue={event?.description} 
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fecha de Inicio (Calendario)" 
              type="date" 
              name="startDate" 
              defaultValue={event?.startDate ? new Date(event.startDate).toISOString().split('T')[0] : ""} 
              required 
            />
            <Input 
              label="Fecha de Fin (Opcional)" 
              type="date" 
              name="endDate" 
              defaultValue={event?.endDate ? new Date(event.endDate).toISOString().split('T')[0] : ""} 
            />
          </div>

          <div>
            <Input label="Hora (Ej: 7:00 PM)" name="timeStr" defaultValue={event?.timeStr} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Ubicación (Ej: Auditorio Principal)" name="location" defaultValue={event?.location} required />
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Campus</label>
              <select name="campus" defaultValue={event?.campus || "Allende"} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors" required>
                <option value="Allende">Allende</option>
                <option value="Sabinas">Sabinas</option>
                <option value="Múzquiz">Múzquiz</option>
                <option value="Barroterán">Barroterán</option>
                <option value="Anáhuac">Anáhuac</option>
                <option value="Durango">Durango</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              Imagen del Evento (Póster) {event ? "(Opcional si no la cambias)" : ""}
            </label>
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              required={!event}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors"
            />
            {event?.image && (
              <p className="mt-2 text-xs text-gray-500">Ya hay una imagen subida. Selecciona otra solo si deseas cambiarla.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio (Opcional, ej: $150)" name="price" defaultValue={event?.price || ""} />
            <Input label="Capacidad Máxima (Opcional)" name="capacity" type="number" defaultValue={event?.capacity || ""} />
          </div>

          <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={event?.featured} className="w-5 h-5 accent-gold" />
            <div>
              <span className="block font-semibold text-navy text-sm">Evento Destacado</span>
              <span className="block text-xs text-gray-500">Aparecerá en grande en la cabecera de la página de Eventos.</span>
            </div>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {event ? "Guardar Cambios" : "Crear Evento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
