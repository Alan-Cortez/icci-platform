import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  Settings,
  Users,
  Video,
  BookOpen,
  FileText,
  Image,
  Droplets,
  HandCoins,
} from "lucide-react";
import { getSession, canAccessAdmin } from "@/lib/auth/session";
import { ADMIN_MODULES, SITE } from "@/lib/constants";
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
  Settings,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {session && canAccessAdmin(session.role) && (
        <aside className="w-64 bg-navy text-white shrink-0 hidden lg:flex flex-col">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center">
                <span className="text-navy font-bold text-xs">ICCI</span>
              </div>
              <div>
                <p className="font-bold text-sm">Admin</p>
                <p className="text-xs text-white/50">{SITE.shortName}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {ADMIN_MODULES.map((mod) => {
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
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-2 truncate">{session.name}</p>
            <AdminLogoutButton />
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {session && canAccessAdmin(session.role) && (
          <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between lg:hidden">
            <p className="font-bold text-navy text-sm">ICCI Admin</p>
            <AdminLogoutButton />
          </header>
        )}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
