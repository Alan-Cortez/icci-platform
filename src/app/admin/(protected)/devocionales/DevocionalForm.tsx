"use client";

import { useState, useRef } from "react";
import { Button, Input } from "@/components/ui";
import { createDevotional, updateDevotional } from "@/actions/content";
import { useRouter } from "next/navigation";
import { Loader2, X, Bold, Italic, Heading3, List, Quote } from "lucide-react";

export function DevocionalForm({ devotional, onCancel }: { devotional?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(devotional?.type || "classic");
  const contentRef = useRef(devotional?.content || "");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // For quote type, set title to a default value if not present
    if (type === "quote") {
      formData.set("title", "Pensamiento");
    }
    
    // Set the rich text content from our ref
    formData.set("content", contentRef.current);
    
    try {
      if (devotional) {
        await updateDevotional(devotional.id, formData);
      } else {
        await createDevotional(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el devocional.");
    } finally {
      setLoading(false);
    }
  }

  function handleFormat(command: string, value: string = "") {
    document.execCommand(command, false, value);
    const editor = document.getElementById("rich-editor");
    if (editor) {
      contentRef.current = editor.innerHTML;
    }
  }

  const defaultDate = devotional ? new Date(devotional.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        <style dangerouslySetInnerHTML={{ __html: `
          #rich-editor:empty:before {
            content: attr(data-placeholder);
            color: #a1a1aa;
            cursor: text;
          }
          #rich-editor blockquote {
            border-left: 4px solid #d4af37;
            padding-left: 1rem;
            margin: 0.5rem 0;
            font-style: italic;
            color: #4b5563;
          }
          #rich-editor ul {
            list-style-type: disc;
            margin-left: 1.25rem;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          #rich-editor h3 {
            font-size: 1.125rem;
            font-weight: bold;
            margin-top: 0.75rem;
            margin-bottom: 0.25rem;
            color: #0f172a;
          }
        `}} />

        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">
            {devotional ? "Editar Publicación" : "Nueva Publicación"}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tipo de publicación */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Tipo de publicación</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 text-navy font-medium cursor-pointer"
            >
              <option value="classic">Devocional Clásico</option>
              <option value="quote">Frase o Pensamiento corto</option>
              <option value="challenge">Reto de Lectura Bíblica</option>
            </select>
          </div>

          {/* Campos dinámicos según el tipo */}
          {type !== "quote" && (
            <Input 
              label="Título" 
              name="title" 
              defaultValue={devotional?.title} 
              placeholder={type === "challenge" ? "Ej. Reto de lectura en un año" : "Ej. Un Corazón Dispuesto"} 
              required 
            />
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Autor" 
              name="author" 
              defaultValue={devotional?.author || (type === "quote" ? "Pastor Oscar Sosa" : "Equipo Pastoral ICCI")} 
              required 
            />
            <Input label="Fecha" name="date" type="date" defaultValue={defaultDate} required />
          </div>

          {type === "classic" && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cita Bíblica (Opcional)" name="verse" defaultValue={devotional?.verse} placeholder="Ej. Proverbios 3:5-6" />
              <Input label="Texto Bíblico (Opcional)" name="verseText" defaultValue={devotional?.verseText} placeholder="Confía en el Señor..." />
            </div>
          )}

          {/* Editor enriquecido WYSIWYG */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-navy">
                {type === "classic" && "Reflexión / Devocional"}
                {type === "quote" && "Frase o Pensamiento corto"}
                {type === "challenge" && "Detalles y lecturas del reto"}
              </label>
              
              {/* Barra de formato (Toolbar) */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => handleFormat("bold")}
                  className="p-1.5 text-gray-600 hover:text-navy hover:bg-white rounded transition-all cursor-pointer"
                  title="Negrita"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("italic")}
                  className="p-1.5 text-gray-600 hover:text-navy hover:bg-white rounded transition-all cursor-pointer"
                  title="Cursiva"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("formatBlock", "<h3>")}
                  className="p-1.5 text-gray-600 hover:text-navy hover:bg-white rounded transition-all cursor-pointer"
                  title="Subtítulo"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("insertUnorderedList")}
                  className="p-1.5 text-gray-600 hover:text-navy hover:bg-white rounded transition-all cursor-pointer"
                  title="Lista"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormat("formatBlock", "<blockquote>")}
                  className="p-1.5 text-gray-600 hover:text-navy hover:bg-white rounded transition-all cursor-pointer"
                  title="Cita"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editor div contentEditable */}
            <div 
              id="rich-editor"
              contentEditable
              onInput={(e) => { contentRef.current = e.currentTarget.innerHTML; }}
              dangerouslySetInnerHTML={{ __html: contentRef.current }}
              data-placeholder={
                type === "quote" 
                  ? "Escribe aquí la frase o pensamiento edificante..." 
                  : "Escribe tu devocional y usa la barra de herramientas superior para darle formato directo."
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors min-h-[220px] focus:outline-none focus:ring-2 focus:ring-gold/50 text-navy overflow-y-auto"
              style={{ minHeight: type === "quote" ? "120px" : "220px" }}
            />
          </div>

          {/* Imagen (Portada o Perfil según tipo) */}
          <div>
            <label className="block text-sm font-semibold text-navy mb-2">
              {type === "quote" 
                ? "Fotografía del Autor (Formato Circular, opcional)" 
                : "Fotografía de Portada (Opcional)"}
            </label>
            <input 
              type="file" 
              name="image" 
              accept="image/*"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors text-sm"
            />
            {devotional?.image && (
              <p className="mt-2 text-xs text-gray-500">Ya hay una imagen subida. Selecciona otra solo si deseas cambiarla.</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {devotional ? "Guardar Cambios" : "Publicar Publicación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
