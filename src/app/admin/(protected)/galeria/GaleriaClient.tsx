"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  ImagePlus,
  Loader2,
  Trash2,
  Pencil,
  X,
  UploadCloud,
  Calendar,
  Save,
} from "lucide-react";
import { Card } from "@/components/ui";
import { compressImage } from "@/lib/compress";
import {
  addServicePhoto,
  deleteServicePhotos,
  updateServicePhotos,
} from "@/actions/gallery";
import {
  SERVICE_TYPES,
  formatLongDate,
  groupIntoAlbums,
  serviceLabel,
  todayKey,
  type Album,
  type BankPhoto,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

interface Props {
  initialPhotos: BankPhoto[];
  campuses: { id: string; name: string }[];
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm";

export function GaleriaClient({ initialPhotos, campuses }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<BankPhoto[]>(initialPhotos);
  // Keep the local list in sync after router.refresh() delivers fresh server data
  useEffect(() => setPhotos(initialPhotos), [initialPhotos]);

  // Upload form
  const [campusId, setCampusId] = useState("allende");
  const [ministry, setMinistry] = useState("general");
  const [dateKey, setDateKey] = useState(todayKey());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  // Filters of the list
  const [filterCampus, setFilterCampus] = useState("all");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  // Album being edited / busy state
  const [editing, setEditing] = useState<Album | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", ministry: "general", dateKey: "" });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const campusName = (id: string | null) => campuses.find((c) => c.id === id)?.name ?? "—";

  const years = useMemo(
    () => Array.from(new Set(photos.map((p) => p.dateKey.slice(0, 4)))).sort().reverse(),
    [photos]
  );

  const albums = useMemo(() => {
    const filtered = photos.filter(
      (p) =>
        (filterCampus === "all" || p.campusId === filterCampus) &&
        (filterMinistry === "all" || p.ministry === filterMinistry) &&
        (filterYear === "all" || p.dateKey.startsWith(filterYear))
    );
    return groupIntoAlbums(filtered);
  }, [photos, filterCampus, filterMinistry, filterYear]);

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/")));
    setMessage(null);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) {
      setMessage({ type: "error", text: "Selecciona al menos una foto." });
      return;
    }
    setUploading(true);
    setMessage(null);
    setProgress({ done: 0, total: files.length });

    let failed = 0;
    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        const fd = new FormData();
        fd.set("image", compressed);
        fd.set("campusId", campusId);
        fd.set("ministry", ministry);
        fd.set("eventDate", dateKey);
        fd.set("title", title);
        fd.set("description", description);
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
    if (fileInput.current) fileInput.current.value = "";
    if (failed > 0) {
      setMessage({ type: "error", text: `No se pudieron subir ${failed} foto(s). Intenta de nuevo.` });
    } else {
      setMessage({ type: "ok", text: "Fotos subidas correctamente." });
      setTitle("");
      setDescription("");
    }
    router.refresh();
  }

  function openEdit(album: Album) {
    setEditing(album);
    setEditForm({
      title: album.title,
      description: album.description,
      ministry: album.ministry,
      dateKey: album.dateKey,
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    const ids = editing.photos.map((p) => p.id);
    const res = await updateServicePhotos(ids, editForm);
    setSaving(false);
    if (res.success) {
      setEditing(null);
      setMessage({ type: "ok", text: "Álbum actualizado." });
      router.refresh();
    } else {
      setMessage({ type: "error", text: res.error ?? "No se pudo guardar." });
    }
  }

  async function handleDelete(ids: string[], confirmText: string) {
    if (!confirm(confirmText)) return;
    setBusyId(ids[0]);
    const res = await deleteServicePhotos(ids);
    setBusyId(null);
    if (res.success) {
      setPhotos((prev) => prev.filter((p) => !ids.includes(p.id)));
      router.refresh();
    } else {
      setMessage({ type: "error", text: res.error ?? "No se pudo eliminar." });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
          <Camera className="w-7 h-7 text-gold" /> Banco de Fotos
        </h1>
        <p className="text-gray-500 text-sm">
          Sube las fotos de cada culto con su fecha, ministerio y descripción. Los visitantes
          podrán filtrarlas por ministerio, día, semana, mes y año en la página del campus.
        </p>
      </div>

      {/* ── Upload form ───────────────────────────────────────────── */}
      <Card className="p-6 border border-gray-200/80">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Campus</label>
              <select value={campusId} onChange={(e) => setCampusId(e.target.value)} className={inputClass}>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Culto / ministerio</label>
              <select value={ministry} onChange={(e) => setMinistry(e.target.value)} className={inputClass}>
                {SERVICE_TYPES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                    {s.day ? ` · ${s.day}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Fecha del culto</label>
              <input
                type="date"
                value={dateKey}
                max={todayKey()}
                onChange={(e) => setDateKey(e.target.value)}
                required
                className={inputClass}
              />
              {dateKey && <p className="text-xs text-gray-500 mt-1.5">{formatLongDate(dateKey)}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Título (opcional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={serviceLabel(ministry)}
                maxLength={120}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-2">Descripción (opcional)</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Noche de alabanza y bautismos"
                maxLength={300}
                className={inputClass}
              />
            </div>
          </div>

          <label
            className={cn(
              "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors",
              files.length > 0 ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/60 hover:bg-gray-50"
            )}
          >
            <UploadCloud className="w-9 h-9 text-gold" />
            <span className="font-semibold text-navy text-sm">
              {files.length > 0
                ? `${files.length} foto(s) seleccionada(s)`
                : "Toca para elegir fotos (puedes seleccionar varias)"}
            </span>
            <span className="text-xs text-gray-500">
              Todas las fotos de esta subida se guardan como un álbum del culto.
            </span>
            <input ref={fileInput} type="file" accept="image/*" multiple onChange={handleSelect} className="hidden" />
          </label>

          {message && (
            <p className={cn("text-sm font-medium", message.type === "ok" ? "text-emerald-700" : "text-red-600")}>
              {message.text}
            </p>
          )}

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

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-gray-200/80">
        <select value={filterCampus} onChange={(e) => setFilterCampus(e.target.value)} className={cn(inputClass, "md:w-auto")}>
          <option value="all">Todos los campus</option>
          {campuses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={filterMinistry} onChange={(e) => setFilterMinistry(e.target.value)} className={cn(inputClass, "md:w-auto")}>
          <option value="all">Todos los cultos</option>
          {SERVICE_TYPES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={cn(inputClass, "md:w-auto")}>
          <option value="all">Todos los años</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <p className="md:ml-auto self-center text-xs text-gray-500 font-medium">
          {albums.length} álbum(es) · {albums.reduce((n, a) => n + a.photos.length, 0)} foto(s)
        </p>
      </div>

      {/* ── Albums ────────────────────────────────────────────────── */}
      <div className="space-y-5">
        {albums.map((album) => (
          <Card key={album.key} className="border border-gray-200/80 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark border border-gold/20">
                    {serviceLabel(album.ministry)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-navy/5 text-navy">
                    {campusName(album.photos[0].campusId)}
                  </span>
                </div>
                <h3 className="font-bold text-navy text-lg leading-snug">{album.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatLongDate(album.dateKey)} · {album.photos.length} foto(s)
                </p>
                {album.description && <p className="text-sm text-gray-600 mt-2">{album.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(album)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-navy bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Editar álbum
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      album.photos.map((p) => p.id),
                      `¿Eliminar este álbum con ${album.photos.length} foto(s)? Esta acción no se puede deshacer.`
                    )
                  }
                  className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 cursor-pointer"
                  title="Eliminar álbum"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {album.photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <img src={photo.imageUrl} alt={photo.title} loading="lazy" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete([photo.id], "¿Eliminar esta foto?")}
                    disabled={busyId === photo.id}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all cursor-pointer"
                    title="Eliminar foto"
                  >
                    {busyId === photo.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {albums.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80">
            <Camera className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">No hay fotos con esos filtros</h3>
            <p className="text-gray-500 text-sm">Sube las fotos de un culto arriba o cambia los filtros.</p>
          </div>
        )}
      </div>

      {/* ── Edit album modal ──────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy">Editar álbum</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-navy cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Culto / ministerio</label>
                <select
                  value={editForm.ministry}
                  onChange={(e) => setEditForm({ ...editForm, ministry: e.target.value })}
                  className={inputClass}
                >
                  {SERVICE_TYPES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Fecha del culto</label>
                <input
                  type="date"
                  value={editForm.dateKey}
                  onChange={(e) => setEditForm({ ...editForm, dateKey: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Título</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  maxLength={120}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy mb-2">Descripción</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  maxLength={300}
                  rows={3}
                  className={cn(inputClass, "resize-none")}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || !editForm.dateKey}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
