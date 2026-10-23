"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, ImagePlus, Loader2, RotateCcw, MapPin, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui";
import { compressImage } from "@/lib/compress";
import { resetCampusImage, updateCampusImage } from "@/actions/campus";

interface CampusItem {
  id: string;
  name: string;
  state: string;
  isMain: boolean;
  defaultImage: string;
  customImage: string | null;
}

export function ConfiguracionClient({ campuses }: { campuses: CampusItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(campuses);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function handleFile(campus: CampusItem, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "El archivo debe ser una imagen." });
      return;
    }
    setBusyId(campus.id);
    setMessage(null);
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.set("image", compressed);
      const res = await updateCampusImage(campus.id, fd);
      if (res.success && res.imageUrl) {
        setItems((prev) =>
          prev.map((c) => (c.id === campus.id ? { ...c, customImage: res.imageUrl! } : c))
        );
        setMessage({ type: "ok", text: `Foto de ${campus.name} actualizada.` });
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error ?? "No se pudo actualizar la foto." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Ocurrió un error al subir la foto." });
    } finally {
      setBusyId(null);
      const input = inputs.current[campus.id];
      if (input) input.value = "";
    }
  }

  async function handleReset(campus: CampusItem) {
    if (!confirm(`¿Restaurar la foto original del campus ${campus.name}?`)) return;
    setBusyId(campus.id);
    setMessage(null);
    const res = await resetCampusImage(campus.id);
    setBusyId(null);
    if (res.success) {
      setItems((prev) => prev.map((c) => (c.id === campus.id ? { ...c, customImage: null } : c)));
      setMessage({ type: "ok", text: `Foto original de ${campus.name} restaurada.` });
      router.refresh();
    } else {
      setMessage({ type: "error", text: res.error ?? "No se pudo restaurar." });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy mb-1 flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-gold" /> Configuración
        </h1>
        <p className="text-gray-500 text-sm">
          Administra la apariencia del sitio público.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="font-bold text-navy text-lg">Fotos de los campus</h2>
          <p className="text-gray-500 text-sm">
            Cambia la foto que se muestra en la lista de campus y en el encabezado de la página de
            cada campus. Usa fotos horizontales (recomendado 1600 × 900 px).
          </p>
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border ${
              message.type === "ok"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.type === "ok" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {message.text}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((campus) => {
            const busy = busyId === campus.id;
            const image = campus.customImage ?? campus.defaultImage;
            return (
              <Card key={campus.id} className="border border-gray-200/80 flex flex-col">
                <div className="relative aspect-video bg-navy overflow-hidden">
                  <img
                    src={image}
                    alt={`Foto del campus ${campus.name}`}
                    className="w-full h-full object-cover"
                  />
                  {busy && (
                    <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                  )}
                  {campus.isMain && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.2em] uppercase bg-gold text-navy px-3 py-1 rounded-full">
                      Principal
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="font-bold text-navy text-base">Campus {campus.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {campus.state}
                      <span className="mx-1">·</span>
                      {campus.customImage ? "Foto personalizada" : "Foto original"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <label
                      className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold text-navy text-xs font-bold hover:bg-gold-light transition-colors ${
                        busy ? "opacity-50 pointer-events-none" : "cursor-pointer"
                      }`}
                    >
                      <ImagePlus className="w-4 h-4" />
                      Cambiar foto
                      <input
                        ref={(el) => {
                          inputs.current[campus.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => handleFile(campus, e.target.files?.[0])}
                      />
                    </label>
                    {campus.customImage && (
                      <button
                        onClick={() => handleReset(campus)}
                        disabled={busy}
                        title="Restaurar foto original"
                        className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-navy hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
