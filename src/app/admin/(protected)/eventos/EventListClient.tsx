"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Plus, Pencil, Trash2, Calendar, MapPin, Loader2 } from "lucide-react";
import { EventForm } from "./EventForm";
import { deleteEvent } from "@/actions/events";

export function EventListClient({ initialEvents }: { initialEvents: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(event: any) {
    setEditingEvent(event);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      setDeletingId(id);
      await deleteEvent(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Eventos</h1>
          <p className="text-gray-500">Gestiona los próximos eventos de la iglesia.</p>
        </div>
        <Button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Nuevo Evento
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col group">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
              {event.featured && (
                <div className="absolute top-2 right-2 bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">
                  Destacado
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">{event.category}</span>
                <span className="text-xs text-gray-500">{event.month}</span>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{event.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {event.dateStr} • {event.timeStr}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {event.location} ({event.campus})
                </div>
              </div>
              <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(event)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-navy bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  disabled={deletingId === event.id}
                  className="flex items-center justify-center w-10 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showForm && (
        <EventForm 
          event={editingEvent} 
          onCancel={() => {
            setShowForm(false);
            setEditingEvent(null);
          }} 
        />
      )}
    </div>
  );
}
