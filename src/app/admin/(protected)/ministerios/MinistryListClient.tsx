"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, Heart, Clock, User } from "lucide-react";
import { MinistryForm } from "./MinistryForm";
import { deleteMinistry } from "@/actions/structure";

export function MinistryListClient({ initialMinistries }: { initialMinistries: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(ministry: any) {
    setEditingMinistry(ministry);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este ministerio?")) {
      setDeletingId(id);
      await deleteMinistry(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Ministerios</h1>
          <p className="text-gray-500">Administra los grupos y ministerios de la iglesia.</p>
        </div>
        <Button onClick={() => { setEditingMinistry(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Ministerio
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialMinistries.map((ministry) => (
          <Card key={ministry.id} className="p-6 bg-white flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-navy text-xl leading-snug">{ministry.name}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(ministry)}
                  className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(ministry.id)}
                  disabled={deletingId === ministry.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === ministry.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 flex-1">
              {ministry.description}
            </p>

            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
              {ministry.leader && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gold" />
                  <span>{ministry.leader}</span>
                </div>
              )}
              {ministry.schedule && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{ministry.schedule}</span>
                </div>
              )}
            </div>
          </Card>
        ))}

        {initialMinistries.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay Ministerios</h3>
            <p className="text-gray-500">Añade el primer ministerio (Jóvenes, Niños, Mujeres, etc).</p>
          </div>
        )}
      </div>

      {showForm && (
        <MinistryForm 
          ministry={editingMinistry} 
          onCancel={() => {
            setShowForm(false);
            setEditingMinistry(null);
          }} 
        />
      )}
    </div>
  );
}
