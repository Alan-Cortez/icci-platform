import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { prayerRequests, testimonies } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { AdminSidebar, type NavModule } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const role = session.user.role;

  if (role !== "admin" && role !== "superadmin") {
    redirect("/");
  }

  const [[pendingPrayers], [pendingTestimonies]] = await Promise.all([
    db.select({ count: count() }).from(prayerRequests).where(eq(prayerRequests.status, "pending")),
    db.select({ count: count() }).from(testimonies).where(eq(testimonies.status, "pending")),
  ]);

  const allModules: NavModule[] = [
    { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/admin/eventos", label: "Eventos", icon: "Calendar" },
    { href: "/admin/devocionales", label: "Devocionales", icon: "BookOpen" },
    { href: "/admin/galeria", label: "Fotos de Cultos", icon: "Camera" },
    {
      href: "/admin/oracion",
      label: "Solicitudes de Oración",
      icon: "MessageCircle",
      badge: pendingPrayers?.count || 0,
    },
    {
      href: "/admin/testimonios",
      label: "Testimonios",
      icon: "Heart",
      badge: pendingTestimonies?.count || 0,
    },
    { href: "/admin/usuarios", label: "Usuarios", icon: "Users" },
    { href: "/admin/configuracion", label: "Configuración", icon: "Settings" },
  ];

  const visibleModules =
    role === "superadmin"
      ? allModules
      : allModules.filter((m) => m.href !== "/admin/usuarios");

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col lg:flex-row">
      <AdminSidebar
        modules={visibleModules}
        user={{
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
          role: session.user?.role,
        }}
      />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
