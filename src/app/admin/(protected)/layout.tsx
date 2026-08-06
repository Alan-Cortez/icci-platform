import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Users,
  Video,
  BookOpen,
  FileText,
  Image,
  Droplets,
  HandCoins,
  ArrowLeft,
} from "lucide-react";
import { auth } from "@/auth";
import { SITE } from "@/lib/constants";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  MapPin,
  Users,
  Calendar,
  Heart,
  Video,
  BookOpen,
  FileText,
  Image,
  Droplets,
  HandCoins,
  MessageCircle,
};

const NAV_MODULES = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/eventos", label: "Eventos", icon: "Calendar" },
  { href: "/admin/devocionales", label: "Devocionales", icon: "BookOpen" },
  { href: "/admin/predicaciones", label: "Predicaciones", icon: "Video" },
  { href: "/admin/blog", label: "Blog", icon: "FileText" },
  { href: "/admin/galeria", label: "Galería", icon: "Image" },
  { href: "/admin/bautizos", label: "Bautizos", icon: "Droplets" },
  { href: "/admin/oracion", label: "Solicitudes de Oración", icon: "MessageCircle" },
  { href: "/admin/testimonios", label: "Testimonios", icon: "Heart" },
  { href: "/admin/donaciones", label: "Donaciones", icon: "HandCoins" },
  { href: "/admin/usuarios", label: "Usuarios", icon: "Users" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const role = session.user.role;

  if (role !== "admin" && role !== "superadmin") {
    redirect("/");
  }

  const visibleModules = role === "superadmin"
    ? NAV_MODULES
    : NAV_MODULES.filter((m) => m.href !== "/admin/usuarios");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
      <aside className="w-64 bg-navy text-white shrink-0 hidden lg:flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
              <span className="text-navy font-bold text-xs">ICCI</span>
            </div>
            <div>
              <p className="font-bold text-sm">Panel Admin</p>
              <p className="text-xs text-white/50">{SITE.shortName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleModules.map((mod) => {
            const Icon = iconMap[mod.icon] ?? LayoutDashboard;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                {mod.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: back to landing + logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Back to landing page */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Ir al sitio web
          </Link>
          <p className="text-xs text-white/40 px-1 truncate">{session.user?.name}</p>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:hidden">
          <p className="font-bold text-navy text-sm">ICCI Admin</p>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-navy flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Sitio
            </Link>
            <AdminLogoutButton />
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
