"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, MapPin, Phone, User } from "lucide-react";
import { CampusForm } from "./CampusForm";
import { deleteCampus } from "@/actions/structure";

export function CampusListClient({ initialCampuses }: { initialCampuses: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCampus, setEditingCampus] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(campus: any) {
    setEditingCampus(campus);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este campus?")) {
      setDeletingId(id);
      await deleteCampus(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Sedes / Campus</h1>
          <p className="text-gray-500">Administra las iglesias y puntos de reunión.</p>
        </div>
        <Button onClick={() => { setEditingCampus(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Campus
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialCampuses.map((campus) => (
          <Card key={campus.id} className="p-6 bg-white flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy text-xl leading-snug">{campus.name}</h3>
                  {campus.isMain && <Badge variant="gold" className="text-[10px]">Principal</Badge>}
                </div>
                <p className="text-sm text-gray-500">{campus.state}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(campus)}
                  className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(campus.id)}
                  disabled={deletingId === campus.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === campus.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6 flex-1">
              {campus.description}
            </p>

            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gold" />
                <span>{campus.pastor}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{campus.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold" />
                <span>{campus.phone}</span>
              </div>
            </div>
          </Card>
        ))}

        {initialCampuses.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay Sedes</h3>
            <p className="text-gray-500">Añade el primer campus o punto de reunión.</p>
          </div>
        )}
      </div>

      {showForm && (
        <CampusForm 
          campus={editingCampus} 
          onCancel={() => {
            setShowForm(false);
            setEditingCampus(null);
          }} 
        />
      )}
    </div>
  );
}
