import { auth } from "@/auth";
import { Card } from "@/components/ui";
import { Calendar, Image as ImageIcon, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-navy mb-2">¡Hola, {session?.user?.name?.split(" ")[0]}!</h1>
        <p className="text-gray-500">Bienvenido al panel de control. ¿Qué te gustaría hacer hoy?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/eventos" className="group">
          <Card className="p-6 border border-gray-100 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Gestionar Eventos</h3>
            <p className="text-sm text-gray-500">Agrega, edita o elimina los próximos eventos de la iglesia.</p>
          </Card>
        </Link>

        <Link href="/admin/fotos" className="group">
          <Card className="p-6 border border-gray-100 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Galería de Fotos</h3>
            <p className="text-sm text-gray-500">Actualiza las fotos de inicio, ministerios y campus.</p>
          </Card>
        </Link>

        <Link href="/admin/usuarios" className="group">
          <Card className="p-6 border border-gray-100 hover:border-gold/50 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Usuarios</h3>
            <p className="text-sm text-gray-500">Controla quién tiene acceso a este panel de administración.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
