"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, BookOpen } from "lucide-react";
import { DevocionalForm } from "./DevocionalForm";
import { deleteDevotional } from "@/actions/content";

export function DevocionalListClient({ initialDevotionals }: { initialDevotionals: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(devotional: any) {
    setEditingDevotional(devotional);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este devocional?")) {
      setDeletingId(id);
      await deleteDevotional(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Devocionales</h1>
          <p className="text-gray-500">Publica reflexiones diarias para la congregación.</p>
        </div>
        <Button onClick={() => { setEditingDevotional(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Devocional
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialDevotionals.map((devotional) => (
          <Card key={devotional.id} className="p-6 bg-white flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs font-bold text-gold">{new Date(devotional.date).toLocaleDateString()}</p>
                  {devotional.type === "quote" && <span className="text-[9px] bg-navy/5 text-navy border border-navy/10 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Frase</span>}
                  {devotional.type === "challenge" && <span className="text-[9px] bg-gold/15 text-gold-dark border border-gold/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Reto</span>}
                  {(devotional.type === "classic" || !devotional.type) && <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Devocional</span>}
                </div>
                <h3 className="font-bold text-navy text-xl leading-snug">
                  {devotional.type === "quote" ? "Pensamiento / Frase" : devotional.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Por {devotional.author}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(devotional)}
                  className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(devotional.id)}
                  disabled={deletingId === devotional.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === devotional.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {(devotional.verse) && (
              <div className="mb-4 text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                📖 {devotional.verse}
              </div>
            )}
            
            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
              {devotional.content}
            </p>
          </Card>
        ))}

        {initialDevotionals.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay devocionales</h3>
            <p className="text-gray-500">Haz clic en Añadir Devocional para publicar la primera reflexión.</p>
          </div>
        )}
      </div>

      {showForm && (
        <DevocionalForm 
          devotional={editingDevotional} 
          onCancel={() => {
            setShowForm(false);
            setEditingDevotional(null);
          }} 
        />
      )}
    </div>
  );
}
