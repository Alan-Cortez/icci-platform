"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { getComments, createComment, deleteComment } from "@/actions/comments";
import { Loader2, Trash2, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui";

interface CommentSectionProps {
  devotionalId?: string;
  testimonyId?: string;
}

export function CommentSection({ devotionalId, testimonyId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true);
        const data = await getComments(devotionalId, testimonyId);
        setComments(data);
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [devotionalId, testimonyId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;

    setSubmitting(true);
    try {
      await createComment(text, devotionalId, testimonyId);
      // Reload comments to show the new one
      const data = await getComments(devotionalId, testimonyId);
      setComments(data);
      setText("");
    } catch (err: any) {
      alert(err.message || "Error al comentar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar tu comentario?")) return;

    setDeletingId(id);
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Error al eliminar comentario");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-bold text-navy">
          Conversación ({comments.length})
        </h3>
      </div>

      {/* Write comment section */}
      <div className="mb-6">
        {session?.user ? (
          <form onSubmit={handleSend} className="flex gap-3 items-start">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                className="w-10 h-10 rounded-full border border-gray-200 mt-1"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy mt-1">
                {session.user.name?.[0] || "U"}
              </div>
            )}
            <div className="flex-1 relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Comparte lo que piensas de esta publicación..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 text-navy bg-gray-50 focus:bg-white transition-all text-sm resize-none pr-12"
                required
              />
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="absolute right-3 bottom-3 p-1.5 bg-navy hover:bg-navy-light text-white rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-navy cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-gray-500 text-sm max-w-sm">
              Inicia sesión con tu cuenta de Google para unirte a la conversación, comentar y compartir.
            </p>
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 px-5 py-2.5 rounded-full hover:shadow-sm transition-all text-navy font-semibold text-sm cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Iniciar sesión con Google
            </button>
          </div>
        )}
      </div>

      {/* List comments */}
      {loading ? (
        <div className="flex justify-center py-6 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4 italic">
          No hay comentarios aún. ¡Sé el primero en compartir tu pensamiento!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isAuthor = session?.user?.email === comment.userId || session?.user?.id === comment.userId;
            // Also accept checking by name/avatar if next-auth ID comparison varies
            const isOwner = isAuthor || (session?.user && session.user.name === comment.user.name);
            const isAdmin = session?.user && ((session.user as any).role === "admin" || (session.user as any).role === "superadmin");

            return (
              <div
                key={comment.id}
                className="flex gap-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 transition-all duration-200"
              >
                {comment.user.image ? (
                  <img
                    src={comment.user.image}
                    alt={comment.user.name}
                    className="w-9 h-9 rounded-full border border-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center font-bold text-navy text-sm flex-shrink-0">
                    {comment.user.name?.[0] || "U"}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-navy truncate">
                      {comment.user.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {(isOwner || isAdmin) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar comentario"
                        >
                          {deletingId === comment.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 whitespace-pre-line leading-relaxed font-light">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
