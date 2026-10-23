"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, Loader2, Trash2, Pencil, Check, X, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui";
import { compressImage } from "@/lib/compress";
import {
  addServicePhoto,
  deleteServicePhoto,
  updateServicePhotoTitle,
} from "@/actions/gallery";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  campusId: string | null;
  title: string;
  imageUrl: string;
}

interface Props {
  initialPhotos: Photo[];
  campuses: { id: string; name: string }[];
}

export function GaleriaClient({ initialPhotos, campuses }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  // Keep the local list in sync after router.refresh() delivers fresh server data
  useEffect(() => setPhotos(initialPhotos), [initialPhotos]);
  const [campusId, setCampusId] = useState("allende");
  const [filterCampus, setFilterCampus] = useState("all");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const campusName = (id: string | null) => campuses.find((c) => c.id === id)?.name ?? "—";

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    setFiles(selected);
    setError(null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setError("Selecciona al menos una foto.");
      return;
    }
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });

    let failed = 0;
    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.set("image", compressed);
        fd.set("campusId", campusId);
        fd.set("title", title);
        const res = await addServicePhoto(fd);
        if (!res.success) failed++;
      } catch (err) {
        console.error(err);
        failed++;
      }
      setProgress((p) => ({ ...p, done: p.done + 1 }));
    }

    setUploading(false);
    setFiles([]);
    setTitle("");
    if (fileInput.current) fileInput.current.value = "";
    if (failed > 0) setError(`No se pudieron subir ${failed} foto(s). Intenta de nuevo.`);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta foto? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    const res = await deleteServicePhoto(id);
    setDeletingId(null);
    if (res.success) setPhotos((prev) => prev.filter((p) => p.id !== id));
    else setError(res.error ?? "No se pudo eliminar la foto.");
  }

  async function handleSaveTitle(id: string) {
    const res = await updateServicePhotoTitle(id, editTitle);
    if (res.success) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, title: editTitle.trim() || "Culto" } : p))
      );
      setEditingId(null);
    } else {
      setError(res.error ?? "No se pudo actualizar.");
    }
  }

  const visible = photos.filter((p) => filterCampus === "all" || p.campusId === filterCampus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
          <Camera className="w-7 h-7 text-gold" /> Fotos de Cultos
        </h1>
        <p className="text-gray-500 text-sm">
          Sube las fotos de los servicios. Se muestran automáticamente en la página del campus
          seleccionado.
        </p>
      </div>

      {/* Upload form */}
      <Card className="p-6 border border-gray-200/80">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Campus</label>
              <select
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">
                Descripción (opcional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Servicio dominical"
                maxLength={120}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <label
            className={cn(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
              files.length > 0
                ? "border-gold bg-gold/5"
                : "border-gray-200 hover:border-gold/60 hover:bg-gray-50"
            )}
          >
            <UploadCloud className="w-9 h-9 text-gold" />
            <span className="font-semibold text-navy text-sm">
              {files.length > 0
                ? `${files.length} foto(s) seleccionada(s)`
                : "Toca para elegir fotos (puedes seleccionar varias)"}
            </span>
            <span className="text-xs text-gray-500">JPG, PNG o WebP. Se optimizan automáticamente.</span>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleSelect}
              className="hidden"
            />
          </label>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={uploading || files.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subiendo {progress.done}/{progress.total}...
              </>
            ) : (
              <>
                <ImagePlus className="w-4 h-4" /> Subir fotos
              </>
            )}
          </button>
        </form>
      </Card>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {[{ id: "all", name: "Todos" }, ...campuses].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCampus(c.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
              filterCampus === c.id
                ? "bg-navy text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/60"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((photo) => (
          <Card key={photo.id} className="group border border-gray-200/80 flex flex-col">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 space-y-2 flex-1 flex flex-col">
              <span className="self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy/5 text-navy">
                {campusName(photo.campusId)}
              </span>

              {editingId === photo.id ? (
                <div className="flex items-center gap-1">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveTitle(photo.id)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-xs font-semibold text-navy line-clamp-2 flex-1">{photo.title}</p>
              )}

              <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
                <button
                  onClick={() => {
                    setEditingId(photo.id);
                    setEditTitle(photo.title);
                  }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-navy hover:bg-gray-100 cursor-pointer"
                  title="Editar descripción"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                  title="Eliminar foto"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))}

        {visible.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-gray-200/80">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">Aún no hay fotos</h3>
            <p className="text-gray-500 text-sm">Sube las primeras fotos de los cultos arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}
