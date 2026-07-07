"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, Play } from "lucide-react";
import { SermonForm } from "./SermonForm";
import { deleteSermon } from "@/actions/content";

export function SermonListClient({ initialSermons }: { initialSermons: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(sermon: any) {
    setEditingSermon(sermon);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar esta predicación?")) {
      setDeletingId(id);
      await deleteSermon(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Predicaciones</h1>
          <p className="text-gray-500">Agrega mensajes en video desde YouTube para la página de predicaciones.</p>
        </div>
        <Button onClick={() => { setEditingSermon(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Video
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialSermons.map((sermon) => (
          <Card key={sermon.id} className="overflow-hidden flex flex-col p-0">
            <div className="aspect-video relative overflow-hidden bg-navy group">
              <img 
                src={`https://img.youtube.com/vi/${sermon.youtubeUrl}/hqdefault.jpg`} 
                alt={sermon.title} 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white ml-1" />
                </div>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-navy text-lg mb-1 leading-snug">{sermon.title}</h3>
              <p className="text-sm text-gray-500 mb-4 font-medium">
                {sermon.speaker} · {new Date(sermon.date).toLocaleDateString()}
              </p>
              
              <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(sermon)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-navy bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(sermon.id)}
                  disabled={deletingId === sermon.id}
                  className="flex items-center justify-center w-10 py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === sermon.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Card>
        ))}

        {initialSermons.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay videos subidos</h3>
            <p className="text-gray-500">Haz clic en Añadir Video para empezar.</p>
          </div>
        )}
      </div>

      {showForm && (
        <SermonForm 
          sermon={editingSermon} 
          onCancel={() => {
            setShowForm(false);
            setEditingSermon(null);
          }} 
        />
      )}
    </div>
  );
}
