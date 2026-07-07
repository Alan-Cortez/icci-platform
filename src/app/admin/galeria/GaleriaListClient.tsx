"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { GaleriaForm } from "./GaleriaForm";
import { deleteGalleryImage } from "@/actions/content";

export function GaleriaListClient({ initialPhotos }: { initialPhotos: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(photo: any) {
    setEditingPhoto(photo);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar esta imagen de la galería?")) {
      setDeletingId(id);
      await deleteGalleryImage(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Galería</h1>
          <p className="text-gray-500">Sube fotos de eventos, campus y ministerios.</p>
        </div>
        <Button onClick={() => { setEditingPhoto(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Foto
        </Button>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {initialPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden p-0 flex flex-col relative group bg-white">
            <div className="aspect-square relative overflow-hidden bg-gray-100">
              <img 
                src={photo.imageUrl} 
                alt={photo.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="gold" className="shadow-sm">{photo.category}</Badge>
              </div>
            </div>
            
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-navy mb-1 leading-snug truncate">{photo.title}</h3>
              {photo.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{photo.description}</p>
              )}
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => handleEdit(photo)}
                  className="flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold text-navy bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="flex items-center justify-center w-8 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50"
                >
                  {deletingId === photo.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </Card>
        ))}

        {initialPhotos.length === 0 && (
          <div className="md:col-span-3 lg:col-span-4 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">Galería Vacía</h3>
            <p className="text-gray-500">Haz clic en Añadir Foto para llenar la galería.</p>
          </div>
        )}
      </div>

      {showForm && (
        <GaleriaForm 
          photo={editingPhoto} 
          onCancel={() => {
            setShowForm(false);
            setEditingPhoto(null);
          }} 
        />
      )}
    </div>
  );
}
