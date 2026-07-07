import { Inter } from "next/font/google";
import { LogOut, Calendar, Image as ImageIcon, Users, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel | ICCI",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 flex min-h-screen`}>
        {/* Sidebar */}
        <aside className="w-64 bg-navy text-white flex flex-col hidden md:flex">
          <div className="p-6">
            <h1 className="text-2xl font-black tracking-tight text-white">ICCI<span className="text-gold">ADMIN</span></h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2 mt-4">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium">
              <LayoutDashboard className="w-5 h-5 text-gold" /> Dashboard
            </Link>
            <Link href="/admin/eventos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <Calendar className="w-5 h-5 text-gray-400" /> Eventos
            </Link>
            <Link href="/admin/fotos" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-400" /> Fotos
            </Link>
            <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              <Users className="w-5 h-5 text-gray-400" /> Usuarios
            </Link>
          </nav>

          <div className="p-4 mt-auto border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <img src={session?.user?.image || ""} alt="User" className="w-10 h-10 rounded-full border border-gold" />
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                <LogOut className="w-5 h-5" /> Cerrar Sesión
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <header className="md:hidden bg-navy text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-black">ICCI<span className="text-gold">ADMIN</span></h1>
            {/* Add mobile menu button later if needed */}
          </header>
          
          <div className="flex-1 overflow-auto p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
