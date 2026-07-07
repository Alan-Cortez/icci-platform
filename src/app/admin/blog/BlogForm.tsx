"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { createBlogPost, updateBlogPost } from "@/actions/content";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

export function BlogForm({ post, onCancel }: { post?: any, onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (post) {
        await updateBlogPost(post.id, formData);
      } else {
        await createBlogPost(formData);
      }
      onCancel();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error al guardar el artículo.");
    } finally {
      setLoading(false);
    }
  }

  const defaultDate = post && post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-navy">{post ? "Editar Artículo" : "Nuevo Artículo"}</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-navy transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input label="Título" name="title" defaultValue={post?.title} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Autor" name="author" defaultValue={post?.author || "Equipo Pastoral ICCI"} required />
            <Input label="Fecha de Publicación" name="publishedAt" type="date" defaultValue={defaultDate} required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Resumen (Excerpt)</label>
            <textarea 
              name="excerpt" 
              defaultValue={post?.excerpt}
              required
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors resize-y"
              placeholder="Un resumen corto del artículo para mostrar en la lista..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy mb-2">Contenido</label>
            <textarea 
              name="content" 
              defaultValue={post?.content}
              required
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-colors resize-y"
              placeholder="Escribe el artículo aquí..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {post ? "Guardar Cambios" : "Publicar Artículo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
