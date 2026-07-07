"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full px-3 py-2 rounded-xl hover:bg-white/10"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  );
}
