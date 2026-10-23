"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Users,
  BookOpen,
  Camera,
  ArrowLeft,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Calendar,
  Heart,
  BookOpen,
  MessageCircle,
  Camera,
};

export interface NavModule {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

interface AdminSidebarProps {
  modules: NavModule[];
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function AdminSidebar({ modules, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const totalAlerts = modules.reduce((acc, m) => acc + (m.badge || 0), 0);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Brand */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-navy font-black text-xs tracking-wider">ICCI</span>
          </div>
          <div>
            <p className="font-bold text-sm text-white tracking-wide">Panel Admin</p>
            <p className="text-[11px] text-gold/80 font-medium">{SITE.shortName}</p>
          </div>
        </Link>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Menú Principal
          </p>
          <nav className="space-y-1">
            {modules.map((mod) => {
              const Icon = iconMap[mod.icon] ?? LayoutDashboard;
              const active = isActive(mod.href);
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all relative group",
                    active
                      ? "bg-gold text-navy font-bold shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/8"
                  )}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                        active ? "text-navy" : "text-white/60 group-hover:text-gold"
                      )}
                    />
                    <span className="truncate">{mod.label}</span>
                  </span>

                  {mod.badge !== undefined && mod.badge > 0 && (
                    <span
                      className={cn(
                        "ml-2 px-2 py-0.5 text-[11px] font-extrabold rounded-full shrink-0",
                        active
                          ? "bg-navy text-gold"
                          : "bg-amber-500 text-navy animate-pulse"
                      )}
                    >
                      {mod.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom: User info + back to landing + logout */}
      <div className="p-4 border-t border-white/10 space-y-3 bg-black/15">
        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "Admin"}
              className="w-9 h-9 rounded-full border border-gold/40 object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold font-bold text-xs shrink-0">
              {(user.name || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user.name || "Administrador"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-gold shrink-0" />
              <span className="text-[10px] text-gold font-semibold uppercase tracking-wider">
                {user.role === "superadmin" ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-1 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              Ir al sitio web
            </span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <aside className="w-64 bg-navy text-white shrink-0 hidden lg:flex flex-col sticky top-0 h-screen shadow-xl z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Bar ────────────────────────────────────────────── */}
      <header className="bg-navy text-white px-4 py-3.5 flex items-center justify-between lg:hidden sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors relative"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-navy text-[10px] font-black flex items-center justify-center">
                {totalAlerts}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center">
              <span className="text-navy font-black text-[10px]">ICCI</span>
            </div>
            <span className="font-bold text-sm">Panel Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs text-white/80 hover:text-white bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sitio
          </Link>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-navy text-white flex flex-col h-full shadow-2xl z-10">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
