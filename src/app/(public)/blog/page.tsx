import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { Badge, Card, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog – ICCI",
  description: "Artículos y reflexiones de Iglesias Comunidad De Cristo Internacional.",
};

const posts = [
  {
    id: "post-1",
    slug: "como-crecer-en-la-fe",
    title: "Cómo crecer en tu fe este año",
    excerpt:
      "La fe no crece sola. Requiere disciplinas espirituales, comunidad y decisiones diarias. En este artículo exploramos hábitos concretos que transformarán tu vida espiritual.",
    author: "Equipo Pastoral ICCI",
    date: "Junio 2026",
    category: "Crecimiento",
    readTime: "5 min",
    featured: true,
  },
  {
    id: "post-2",
    slug: "el-valor-de-la-comunidad",
    title: "El valor de la comunidad cristiana",
    excerpt:
      "Dios nunca diseñó al ser humano para vivir en aislamiento. La iglesia no es solo un edificio o un servicio dominical — es una familia que se apoya, ora y camina junta.",
    author: "Pastores Oscar y Raquel Sosa",
    date: "Mayo 2026",
    category: "Comunidad",
    readTime: "4 min",
    featured: false,
  },
  {
    id: "post-3",
    slug: "criando-hijos-en-la-fe",
    title: "Criando hijos en la fe: consejos prácticos",
    excerpt:
      "Como padres, tenemos la hermosa responsabilidad de guiar a nuestros hijos hacia Dios. Aquí encontrarás ideas prácticas para cultivar la fe en el hogar.",
    author: "Ministerio Femenil ICCI",
    date: "Mayo 2026",
    category: "Familia",
    readTime: "6 min",
    featured: false,
  },
  {
    id: "post-4",
    slug: "nuevos-campus-nuevas-oportunidades",
    title: "Nuevos campus, nuevas oportunidades para servir",
    excerpt:
      "La expansión de ICCI es señal de la fidelidad de Dios. Cada nuevo campus es una oportunidad para que más personas encuentren a Cristo y a una familia de fe.",
    author: "Equipo ICCI",
    date: "Abril 2026",
    category: "Ministerio",
    readTime: "3 min",
    featured: false,
  },
  {
    id: "post-5",
    slug: "el-poder-de-la-oracion",
    title: "El poder transformador de la oración",
    excerpt:
      "La oración no es un ritual religioso — es una conversación real con Dios. Descubre cómo construir una vida de oración genuina y poderosa.",
    author: "Equipo Pastoral ICCI",
    date: "Marzo 2026",
    category: "Crecimiento",
    readTime: "5 min",
    featured: false,
  },
  {
    id: "post-6",
    slug: "generosidad-como-estilo-de-vida",
    title: "La generosidad como estilo de vida",
    excerpt:
      "Dar no es solo acerca del dinero. Es una postura del corazón que refleja el carácter de Dios. Aprende cómo vivir con una mentalidad generosa en todas las áreas de tu vida.",
    author: "Equipo ICCI",
    date: "Marzo 2026",
    category: "Finanzas",
    readTime: "4 min",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  Crecimiento: "bg-blue-100 text-blue-700",
  Comunidad: "bg-green-100 text-green-700",
  Familia: "bg-pink-100 text-pink-700",
  Ministerio: "bg-purple-100 text-purple-700",
  Finanzas: "bg-amber-100 text-amber-700",
};

export default function BlogPage() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

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
                  <p className="text-white/60 text-sm">{featured.date}</p>
                </div>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <span className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4 ${categoryColors[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {featured.category}
                </span>
                <h2 className="text-2xl font-bold text-navy mb-3">{featured.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>{featured.author}</span>
                    <span className="mx-2">·</span>
                    <span>{featured.readTime} de lectura</span>
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
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-navy text-lg mb-2 leading-snug">{post.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" /> {post.date}
                    <span className="mx-1">·</span>
                    <Clock className="w-3 h-3" /> {post.readTime}
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
