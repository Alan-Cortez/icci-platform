import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Calendar,
  Heart,
  MessageCircle,
  Users,
  BookOpen,
  ArrowRight,
  MapPin,
  Star,
  Shield,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/auth";
import { Card, Badge } from "@/components/ui";
import { db } from "@/db";
import {
  users,
  events,
  prayerRequests,
  devotionals,
  testimonies,
  comments,
} from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import {
  DashboardHeaderActions,
  DashboardQuickModeration,
} from "@/components/admin/DashboardClientWidgets";

export const metadata = { title: "Dashboard | ICCI Admin" };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    redirect("/");
  }

  const [
    [totalUsers],
    [totalEvents],
    [pendingPrayersCount],
    [prayedPrayersCount],
    [totalDevotionals],
    [pendingTestimoniesCount],
    [approvedTestimoniesCount],
    [totalComments],
    recentEvents,
    recentDevotionals,
    recentUsers,
    pendingPrayersList,
    pendingTestimoniesList,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(prayerRequests).where(eq(prayerRequests.status, "pending")),
    db.select({ count: count() }).from(prayerRequests).where(eq(prayerRequests.status, "prayed")),
    db.select({ count: count() }).from(devotionals),
    db.select({ count: count() }).from(testimonies).where(eq(testimonies.status, "pending")),
    db.select({ count: count() }).from(testimonies).where(eq(testimonies.status, "approved")),
    db.select({ count: count() }).from(comments),
    db.select().from(events).orderBy(desc(events.startDate)).limit(4),
    db.select().from(devotionals).orderBy(desc(devotionals.date)).limit(4),
    db.select().from(users).orderBy(desc(users.createdAt)).limit(5),
    db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.status, "pending"))
      .orderBy(desc(prayerRequests.createdAt))
      .limit(5),
    db
      .select({
        id: testimonies.id,
        content: testimonies.content,
        createdAt: testimonies.createdAt,
        userName: users.name,
      })
      .from(testimonies)
      .leftJoin(users, eq(testimonies.userId, users.id))
      .where(eq(testimonies.status, "pending"))
      .orderBy(desc(testimonies.createdAt))
      .limit(5),
  ]);

  const stats = [
    {
      label: "Usuarios registrados",
      value: totalUsers.count,
      sublabel: "Comunidad en plataforma",
      icon: Users,
      iconBg: "bg-emerald-50 border-emerald-200/60",
      iconColor: "text-emerald-600",
      href: session.user.role === "superadmin" ? "/admin/usuarios" : "/admin",
    },
    {
      label: "Eventos",
      value: totalEvents.count,
      sublabel: "Actividades programadas",
      icon: Calendar,
      iconBg: "bg-purple-50 border-purple-200/60",
      iconColor: "text-purple-600",
      href: "/admin/eventos",
    },
    {
      label: "Devocionales",
      value: totalDevotionals.count,
      sublabel: `${totalComments.count} comentarios en total`,
      icon: BookOpen,
      iconBg: "bg-blue-50 border-blue-200/60",
      iconColor: "text-blue-600",
      href: "/admin/devocionales",
    },
    {
      label: "Oraciones pendientes",
      value: pendingPrayersCount.count,
      sublabel: `${prayedPrayersCount.count} marcadas como oradas`,
      icon: MessageCircle,
      iconBg: "bg-amber-50 border-amber-200/60",
      iconColor: "text-amber-600",
      alert: pendingPrayersCount.count > 0,
      href: "/admin/oracion",
    },
    {
      label: "Testimonios",
      value: approvedTestimoniesCount.count,
      sublabel:
        pendingTestimoniesCount.count > 0
          ? `${pendingTestimoniesCount.count} pendientes de aprobar`
          : "Todos moderados",
      icon: Heart,
      iconBg: "bg-pink-50 border-pink-200/60",
      iconColor: "text-pink-600",
      alert: pendingTestimoniesCount.count > 0,
      href: "/admin/testimonios",
    },
  ];

  const quickActions = [
    {
      href: "/admin/eventos",
      label: "Gestionar Eventos",
      desc: "Crear, editar o destacar próximos eventos",
      icon: Calendar,
      color: "text-purple-600 bg-purple-50",
    },
    {
      href: "/admin/devocionales",
      label: "Devocionales y Retos",
      desc: "Publicar reflexiones, frases o retos bíblicos",
      icon: BookOpen,
      color: "text-blue-600 bg-blue-50",
    },
    {
      href: "/admin/oracion",
      label: "Revisar Oraciones",
      desc: "Ver peticiones de la congregación y orar",
      icon: MessageCircle,
      color: "text-amber-600 bg-amber-50",
      badge: pendingPrayersCount.count,
    },
    {
      href: "/admin/testimonios",
      label: "Moderar Testimonios",
      desc: "Aprobar o destacar testimonios del muro",
      icon: Heart,
      color: "text-pink-600 bg-pink-50",
      badge: pendingTestimoniesCount.count,
    },
    ...(session.user.role === "superadmin"
      ? [
          {
            href: "/admin/usuarios",
            label: "Gestionar Usuarios",
            desc: "Asignar permisos de administrador y roles",
            icon: Users,
            color: "text-emerald-600 bg-emerald-50",
          },
        ]
      : []),
  ];

  const todayFormatted = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* ── Top Welcome Header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gold mb-1 capitalize">
            {todayFormatted}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
            Panel de Control
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Bienvenido de nuevo, <span className="font-semibold text-navy">{session.user?.name}</span>
          </p>
        </div>
        <DashboardHeaderActions />
      </div>

      {/* ── KPI Stat Cards ────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group block">
            <Card className="p-5 h-full border border-gray-200/80 hover:border-gold/60 hover:shadow-md transition-all relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center ${stat.iconBg} group-hover:scale-105 transition-transform`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {stat.alert ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <AlertCircle className="w-3 h-3" /> Atención
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <div>
                <p className="text-3xl font-black text-navy leading-none mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-gray-800">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.sublabel}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Acciones Rápidas Mejoradas ────────────────────────────────── */}
      <Card className="p-6 border border-gray-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-navy text-base">Acciones rápidas</h2>
            <p className="text-xs text-gray-500">Acceso directo a los módulos de administración</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group p-4 rounded-xl border border-gray-200/80 bg-gray-50/40 hover:bg-white hover:border-gold hover:shadow-sm transition-all flex flex-col justify-between relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                {action.badge !== undefined && action.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-navy">
                    {action.badge}
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
              <div>
                <p className="font-bold text-navy text-sm group-hover:text-gold-dark transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* ── Moderación Rápida en Vivo (Oraciones y Testimonios) ───────── */}
      <DashboardQuickModeration
        initialPendingPrayers={pendingPrayersList}
        initialPendingTestimonies={pendingTestimoniesList}
      />

      {/* ── Actividad Reciente: Eventos, Devocionales y Usuarios ──────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Próximos Eventos */}
        <Card className="p-6 border border-gray-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Eventos Recientes
            </h2>
            <Link
              href="/admin/eventos"
              className="text-xs font-semibold text-navy hover:text-gold flex items-center gap-1"
            >
              Gestionar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400 text-xs">
              No hay eventos registrados.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentEvents.map((ev) => (
                <Link
                  key={ev.id}
                  href="/admin/eventos"
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all"
                >
                  {ev.image ? (
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-navy text-xs truncate">{ev.title}</p>
                      {ev.featured && (
                        <Star className="w-3 h-3 text-gold fill-gold shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {new Date(ev.startDate).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      })}{" "}
                      • {ev.timeStr}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {ev.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Últimos Devocionales */}
        <Card className="p-6 border border-gray-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Últimos Devocionales
            </h2>
            <Link
              href="/admin/devocionales"
              className="text-xs font-semibold text-navy hover:text-gold flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentDevotionals.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400 text-xs">
              No hay devocionales publicados aún.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentDevotionals.map((dev) => (
                <Link
                  key={dev.id}
                  href="/admin/devocionales"
                  className="block p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/70 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {dev.type === "quote"
                        ? "Frase"
                        : dev.type === "challenge"
                        ? "Reto"
                        : "Devocional"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(dev.date).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="font-bold text-navy text-xs truncate">
                    {dev.type === "quote" ? "Pensamiento / Frase" : dev.title}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Por {dev.author}</p>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Usuarios Recientes */}
        <Card className="p-6 border border-gray-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Miembros Recientes
            </h2>
            {session.user.role === "superadmin" && (
              <Link
                href="/admin/usuarios"
                className="text-xs font-semibold text-navy hover:text-gold flex items-center gap-1"
              >
                Gestionar <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentUsers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-gray-400 text-xs">
              No hay usuarios registrados.
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {recentUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {u.image ? (
                      <img
                        src={u.image}
                        alt={u.name || "Usuario"}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-navy text-xs truncate">
                        {u.name || "Sin nombre"}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {u.role === "superadmin" && <Badge variant="gold">Super</Badge>}
                    {u.role === "admin" && <Badge variant="navy">Admin</Badge>}
                    {u.role === "user" && <Badge variant="default">Miembro</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
