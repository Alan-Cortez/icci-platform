import { redirect } from "next/navigation";
import { Calendar, Heart, MessageCircle, Users } from "lucide-react";
import { auth } from "@/auth";
import { Card } from "@/components/ui";
import { db } from "@/db";
import { users, events, prayerRequests, devotionals } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export const metadata = { title: "Dashboard | ICCI Admin" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    redirect("/admin/login");
  }

  const [[totalUsers], [totalEvents], [pendingPrayers], [totalDevotionals]] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(prayerRequests).where(eq(prayerRequests.status, "pending")),
    db.select({ count: count() }).from(devotionals),
  ]);

  const stats = [
    { label: "Usuarios registrados", value: totalUsers.count, icon: Users, color: "text-green-600" },
    { label: "Eventos", value: totalEvents.count, icon: Calendar, color: "text-purple-600" },
    { label: "Oraciones pendientes", value: pendingPrayers.count, icon: MessageCircle, color: "text-gold" },
    { label: "Devocionales", value: totalDevotionals.count, icon: Heart, color: "text-pink-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido, {session.user?.name}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-bold text-navy mb-4">Acciones rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/admin/eventos", label: "Eventos" },
            { href: "/admin/devocionales", label: "Nuevo devocional" },
            { href: "/admin/oracion", label: "Revisar oraciones" },
            { href: "/admin/usuarios", label: "Gestionar usuarios" },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="px-4 py-3 rounded-xl border border-gray-100 text-sm font-medium text-navy hover:bg-gray-50 transition-colors text-center"
            >
              {action.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
