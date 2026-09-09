"use client";

import { useState, useRef } from "react";
import { Button, Input } from "@/components/ui";
import { createEvent, updateEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { compressImage } from "@/lib/compress";

/** Convert "HH:MM" (24h) to "H:MM AM/PM" */
function to12h(value: string): string {
  if (!value) return "";
  const [hStr, mStr] = value.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ?? "00";
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

/** Convert "H:MM AM/PM" back to "HH:MM" for the time input default */
function to24h(value: string): string {
  if (!value) return "";
  const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return "";
  let h = parseInt(match[1], 10);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === "AM" && h === 12) h = 0;
  else if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${m}`;
}

export function EventForm({ event, onCancel }: { event?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const timeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Convert 24h time input to "H:MM AM/PM" string for timeStr
    if (timeRef.current?.value) {
      formData.set("timeStr", to12h(timeRef.current.value));
    }
    
    // Compress the image client-side if a file was selected
    const imageFile = formData.get("image");
    if (imageFile instanceof File && imageFile.size > 0) {
      try {
        const compressed = await compressImage(imageFile);
        formData.set("image", compressed);
      } catch (err) {
        console.error("Failed to compress image:", err);
      }
    }

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
            <label className="block text-sm font-semibold text-navy mb-2">Hora del evento</label>
            <input
              ref={timeRef}
              type="time"
              name="timeStr"
              defaultValue={event?.timeStr ? to24h(event.timeStr) : "19:00"}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors text-navy"
            />
          </div>

          <div>
            <Input label="Ubicación (Ej: Auditorio Principal)" name="location" defaultValue={event?.location} required />
            <input type="hidden" name="campus" value="allende" />
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
