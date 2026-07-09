"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, LogIn, Calendar, Church, LogOut, BookOpen, Heart, Shield } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

// ─── Nav structure ───────────────────────────────────────────────────────────

const NAV = [
  { label: "Conócenos", href: "/conocenos" },
  { label: "Campus",    href: "/campus"    },
  {
    label: "Iglesia",
    children: [
      { label: "Servicios", href: "/campus/allende", icon: Church   },
      { label: "Eventos",   href: "/eventos",        icon: Calendar },
      { label: "Devocionales", href: "/devocionales", icon: BookOpen },
      { label: "Testimonios",  href: "/testimonios",   icon: Heart    },
    ],
  },
  { label: "Oraciones", href: "/oracion"    },
  { label: "Donativos", href: "/donaciones" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Header({ session }: { session?: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo only */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="ICCI Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map((item) =>
              item.children ? (
                /* ── Dropdown ── */
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={cn(
                      "flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors",
                      dropdownOpen
                        ? "text-navy bg-gray-50"
                        : "text-gray-700 hover:text-navy hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform duration-200",
                        dropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <div
                    className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top",
                      dropdownOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-navy hover:bg-gray-50 transition-colors"
                      >
                        <child.icon className="w-4 h-4 text-gold flex-shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── Regular link ── */
                <Link
                  key={item.href}
                  href={item.href!}
                  className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-navy rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA — Iniciar sesión o Perfil */}
          <div className="hidden lg:flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-3">
                {((session.user as any).role === "admin" || (session.user as any).role === "superadmin") && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/15 text-gold-dark hover:bg-gold/25 transition-all text-xs font-bold rounded-xl border border-gold/20"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <span className="text-sm font-medium text-gray-700">
                  Hola, <span className="font-bold text-navy">{session.user.name?.split(" ")[0]}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-navy-light transition-colors duration-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen
              ? <X    className="w-6 h-6 text-navy" />
              : <Menu className="w-6 h-6 text-navy" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-gray-100",
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 py-4 space-y-1 bg-white">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label}>
                <p className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-xl font-medium"
                  >
                    <child.icon className="w-4 h-4 text-gold" />
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-navy hover:bg-gray-50 rounded-xl font-medium"
              >
                {item.label}
              </Link>
            )
          )}

          {/* Login CTA or User Info */}
          <div className="pt-3 px-4 pb-2">
            {session?.user ? (
              <div className="flex flex-col gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Hola, <span className="font-bold text-navy">{session.user.name?.split(" ")[0]}</span>
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
                {((session.user as any).role === "admin" || (session.user as any).role === "superadmin") && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full mt-2 bg-gold/20 text-gold-dark text-xs font-bold py-2.5 rounded-xl border border-gold/25"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Panel de Administración
                  </Link>
                )}
              </div>
            ) : (
              <button
                onClick={() => { signIn("google"); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full bg-navy text-white text-sm font-semibold px-5 py-3 rounded-full hover:bg-navy-light transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión con Google
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
