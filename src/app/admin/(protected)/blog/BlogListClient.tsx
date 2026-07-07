"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { Plus, Pencil, Trash2, Loader2, BookText } from "lucide-react";
import { BlogForm } from "./BlogForm";
import { deleteBlogPost } from "@/actions/content";

export function BlogListClient({ initialPosts }: { initialPosts: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleEdit(post: any) {
    setEditingPost(post);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (confirm("¿Estás seguro de que deseas eliminar este artículo?")) {
      setDeletingId(id);
      await deleteBlogPost(id);
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-navy mb-2">Blog</h1>
          <p className="text-gray-500">Administra los artículos y reflexiones largas de la iglesia.</p>
        </div>
        <Button onClick={() => { setEditingPost(null); setShowForm(true); }} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Añadir Artículo
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {initialPosts.map((post) => (
          <Card key={post.id} className="p-6 bg-white flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gold mb-1">{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</p>
                <h3 className="font-bold text-navy text-xl leading-snug">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Por {post.author}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(post)}
                  className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 flex-1">
              {post.excerpt}
            </p>
          </Card>
        ))}

        {initialPosts.length === 0 && (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100">
            <BookText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No hay artículos</h3>
            <p className="text-gray-500">Haz clic en Añadir Artículo para empezar a escribir.</p>
          </div>
        )}
      </div>

      {showForm && (
        <BlogForm 
          post={editingPost} 
          onCancel={() => {
            setShowForm(false);
            setEditingPost(null);
          }} 
        />
      )}
    </div>
  );
}
