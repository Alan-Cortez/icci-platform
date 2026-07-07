import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog – ICCI",
  description: "Artículos y reflexiones de Iglesias Comunidad De Cristo Internacional.",
};

// Dynamic data passed as props

const categoryColors: Record<string, string> = {
  Crecimiento: "bg-blue-100 text-blue-700",
  Comunidad: "bg-green-100 text-green-700",
  Familia: "bg-pink-100 text-pink-700",
  Ministerio: "bg-purple-100 text-purple-700",
  Finanzas: "bg-amber-100 text-amber-700",
};

export function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const featured = initialPosts[0]; // Just take the first one as featured for now
  const rest = initialPosts.slice(1);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Reflexiones y recursos"
          title="Blog ICCI"
          description="Artículos para inspirarte, informarte y crecer en tu caminar con Dios."
        />

        {/* Featured post */}
        {featured && (
          <Card className="overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2">
              <div className="bg-navy min-h-48 lg:min-h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-3">Artículo destacado</p>
                  <p className="text-white/60 text-sm">{new Date(featured.publishedAt || featured.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-gray-100 text-gray-600`}>
                  General
                </span>
                <h2 className="text-2xl font-bold text-navy mb-3">{featured.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>{featured.author}</span>
                    <span className="mx-2">·</span>
                    <span>5 min de lectura</span>
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-1 text-gold font-medium text-sm hover:underline"
                  >
                    Leer artículo <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Card key={post.id} hover className="flex flex-col overflow-hidden">
              <div className="bg-gray-50 h-36 flex items-center justify-center border-b border-gray-100">
                <div className="text-center px-6">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600`}>
                    General
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-navy text-lg mb-2 leading-snug">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    <span className="mx-1">·</span>
                    <Clock className="w-3 h-3" /> 5 min
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-gold text-xs font-medium hover:underline"
                  >
                    Leer →
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
