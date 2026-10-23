"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, BookOpen, Search } from "lucide-react";
import { DevocionalForm } from "./DevocionalForm";
import { deleteDevotional } from "@/actions/content";
import { cn } from "@/lib/utils";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
}

export function DevocionalListClient({ initialDevotionals }: { initialDevotionals: any[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingDevotional, setEditingDevotional] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<"all" | "classic" | "quote" | "challenge">("all");
  const [search, setSearch] = useState("");

  function handleEdit(devotional: any) {
    setEditingDevotional(devotional);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este devocional?")) {
      setDeletingId(id);
      await deleteDevotional(id);
      setDeletingId(null);
      router.refresh();
    }
  }

  const filtered = initialDevotionals.filter((dev) => {
    const devType = dev.type || "classic";
    const matchesType = typeFilter === "all" || devType === typeFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (dev.title || "").toLowerCase().includes(q) ||
      (dev.author || "").toLowerCase().includes(q) ||
      (dev.verse || "").toLowerCase().includes(q) ||
      stripHtml(dev.content || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-gold" /> Devocionales
          </h1>
          <p className="text-gray-500 text-sm">
            Publica reflexiones diarias, pensamientos y retos de lectura para la congregación.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingDevotional(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Añadir Publicación
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "Todos" },
            { key: "classic", label: "Devocionales" },
            { key: "quote", label: "Frases" },
            { key: "challenge", label: "Retos" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                typeFilter === tab.key
                  ? "bg-navy text-white shadow-xs"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar título, autor o cita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {filtered.map((devotional) => (
          <Card
            key={devotional.id}
            className="p-6 bg-white border border-gray-200/80 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs font-bold text-gold">
                    {new Date(devotional.date).toLocaleDateString("es-MX", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {devotional.type === "quote" && (
                    <span className="text-[10px] bg-navy/5 text-navy border border-navy/10 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Frase
                    </span>
                  )}
                  {devotional.type === "challenge" && (
                    <span className="text-[10px] bg-gold/15 text-gold-dark border border-gold/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Reto
                    </span>
                  )}
                  {(devotional.type === "classic" || !devotional.type) && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Devocional
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-navy text-xl leading-snug">
                  {devotional.type === "quote" ? "Pensamiento / Frase" : devotional.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Por {devotional.author}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleEdit(devotional)}
                  className="p-2 text-gray-500 hover:text-navy hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(devotional.id)}
                  disabled={deletingId === devotional.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  title="Eliminar"
                >
                  {deletingId === devotional.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {devotional.verse && (
              <div className="mb-3 text-xs font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                📖 {devotional.verse}
                {devotional.verseText && (
                  <span className="block font-normal italic text-gray-500 mt-1">
                    &ldquo;{devotional.verseText}&rdquo;
                  </span>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 line-clamp-3 mb-2 flex-1">
              {stripHtml(devotional.content)}
            </p>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="lg:col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-200/80">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">No se encontraron publicaciones</h3>
            <p className="text-gray-500 text-sm">
              Haz clic en Añadir Publicación o ajusta los filtros de búsqueda.
            </p>
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
