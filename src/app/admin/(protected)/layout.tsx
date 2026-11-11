import { redirect } from "next/navigation";
import { db } from "@/db";
import { prayerRequests, testimonies } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { AdminSidebar, type NavModule } from "@/components/admin/AdminSidebar";
import { getCurrentAdminUser } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/");
  }

  const role = user.role;
  const isLeader = role === "leader";

  let visibleModules: NavModule[];

  if (isLeader) {
    visibleModules = [
      { href: "/admin", label: "Mi Panel", icon: "LayoutDashboard" },
      { href: "/admin/planeacion", label: "Planeación / Calendario", icon: "CalendarRange" },
      { href: "/admin/ministerios", label: "Mi Ministerio", icon: "Layers" },
    ];
  } else {
    const [[pendingPrayers], [pendingTestimonies]] = await Promise.all([
      db.select({ count: count() }).from(prayerRequests).where(eq(prayerRequests.status, "pending")),
      db.select({ count: count() }).from(testimonies).where(eq(testimonies.status, "pending")),
    ]);

    visibleModules = [
      { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/admin/eventos", label: "Eventos Web", icon: "Calendar" },
      { href: "/admin/planeacion", label: "Planeación", icon: "CalendarRange" },
      { href: "/admin/cumpleanos", label: "Cumpleaños", icon: "Cake" },
      { href: "/admin/ministerios", label: "Ministerios", icon: "Layers" },
      { href: "/admin/campus", label: "Campus", icon: "MapPin" },
      { href: "/admin/devocionales", label: "Devocionales", icon: "BookOpen" },
      { href: "/admin/galeria", label: "Banco de Fotos", icon: "Camera" },
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
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col lg:flex-row">
      <AdminSidebar
        modules={visibleModules}
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
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
