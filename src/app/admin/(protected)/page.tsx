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
  Layers,
  CalendarRange,
  BookMarked,
  Cake,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { db } from "@/db";
import {
  users,
  events,
  prayerRequests,
  devotionals,
  testimonies,
  comments,
  ministries,
  ministryMembers,
  planningEvents,
  preachingSchedules,
} from "@/db/schema";
import { eq, count, desc, asc, inArray } from "drizzle-orm";
import { getCurrentAdminUser, getAccessibleMinistryIds } from "@/lib/admin-auth";
import { isFullAdminRole, canManagePreachingsUser } from "@/lib/roles";
import {
  DashboardHeaderActions,
  DashboardQuickModeration,
} from "@/components/admin/DashboardClientWidgets";

export const metadata = { title: "Dashboard | ICCI Admin" };

export default async function AdminDashboardPage() {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/");
  }

  const todayFormatted = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Vista exclusiva para Líderes de Ministerio ──────────────────────────
  if (user.role === "leader") {
    const accessibleIds = (await getAccessibleMinistryIds(user)) || [];

    const [allMinistries, upcomingPlanning, teamCounts] = await Promise.all([
      db.select().from(ministries).orderBy(asc(ministries.name)),
      db.select().from(planningEvents).orderBy(asc(planningEvents.date)),
      accessibleIds.length > 0
        ? db
            .select({ count: count() })
            .from(ministryMembers)
            .where(inArray(ministryMembers.ministryId, accessibleIds))
        : Promise.resolve([{ count: 0 }]),
    ]);

    const myMinistries = allMinistries.filter((m) => accessibleIds.includes(m.id));
    const ministryMap = new Map(allMinistries.map((m) => [m.id, m.name]));
    const nowStart = new Date();
    nowStart.setHours(0, 0, 0, 0);

    const nextEvents = upcomingPlanning
      .filter((ev) => new Date(ev.date).getTime() >= nowStart.getTime() && ev.status === "scheduled")
      .slice(0, 6);

    const myEventsCount = upcomingPlanning.filter(
      (ev) => ev.ministryId && accessibleIds.includes(ev.ministryId)
    ).length;

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold mb-1 capitalize">
              {todayFormatted}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Panel de Liderazgo
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Bienvenido, <span className="font-semibold text-navy">{user.name}</span>
              {myMinistries.length > 0 && (
                <>
                  {" "}•{" "}
                  <span className="font-bold text-gold-dark">
                    {myMinistries.map((m) => m.name).join(", ")}
                  </span>
                </>
              )}
            </p>
          </div>
          <Link
            href="/admin/planeacion"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy/90 transition-colors"
          >
            <CalendarRange className="w-4 h-4 text-gold" />
            Abrir Calendario de Planeación
          </Link>
        </div>

        {myMinistries.length === 0 && (
          <Card className="p-6 border border-amber-200 bg-amber-50/70">
            <p className="text-sm font-bold text-amber-900">
              Ministerio pendiente de asignar
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Tu cuenta tiene rol de Líder, pero aún no está vinculada a un ministerio específico. Pide al Pastor o Administrador que te asigne en la sección de Ministerios.
            </p>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/ministerios" className="group block">
            <Card className="p-6 h-full border border-gray-200/80 hover:border-gold/60 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl border bg-amber-50 border-amber-200/60 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-amber-700" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-navy leading-none mb-1">
                {myMinistries.length > 0 ? myMinistries[0].name : "Sin asignar"}
              </p>
              <p className="text-sm font-bold text-gray-800">Mi Ministerio</p>
              <p className="text-xs text-gray-500 mt-1">
                {teamCounts[0]?.count || 0} miembros registrados en servicio
              </p>
            </Card>
          </Link>

          <Link href="/admin/planeacion" className="group block">
            <Card className="p-6 h-full border border-gray-200/80 hover:border-gold/60 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl border bg-purple-50 border-purple-200/60 flex items-center justify-center">
                  <CalendarRange className="w-5 h-5 text-purple-600" />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-2xl font-black text-navy leading-none mb-1">
                {myEventsCount}
              </p>
              <p className="text-sm font-bold text-gray-800">Actividades de mi Ministerio</p>
              <p className="text-xs text-gray-500 mt-1">
                Ver calendario general para evitar choques de fechas
              </p>
            </Card>
          </Link>

          <Card className="p-6 h-full border border-gray-200/80 bg-navy text-white">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gold mb-2">
              Acceso de Rol
            </p>
            <p className="text-base font-bold mb-1">Líder de Ministerio</p>
            <p className="text-xs text-white/75 leading-relaxed">
              Puedes gestionar el equipo y detalles de tu ministerio, y consultar el calendario general de planeación para programar actividades sin empalmes con otros ministerios.
            </p>
          </Card>
        </div>

        <Card className="p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-navy text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" /> Próximas Fechas en el Calendario General
              </h2>
              <p className="text-xs text-gray-500">
                Revisa las fechas ocupadas por todos los ministerios antes de agendar
              </p>
            </div>
            <Link
              href="/admin/planeacion"
              className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1"
            >
              Ir al Calendario <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {nextEvents.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">
              No hay actividades próximas programadas en el calendario.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {nextEvents.map((ev) => {
                const isMine = ev.ministryId ? accessibleIds.includes(ev.ministryId) : false;
                const minName = ev.ministryId ? ministryMap.get(ev.ministryId) || "General" : "General";
                return (
                  <div
                    key={ev.id}
                    className={`p-3.5 rounded-xl border ${
                      isMine
                        ? "border-gold/60 bg-gold/5"
                        : "border-gray-100 bg-gray-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isMine
                            ? "bg-gold text-navy"
                            : "bg-navy/10 text-navy"
                        }`}
                      >
                        {minName}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-500">
                        {new Date(ev.date).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          timeZone: "UTC",
                        })}
                      </span>
                    </div>
                    <p className="font-bold text-navy text-sm truncate">{ev.title}</p>
                    {ev.timeStr && (
                      <p className="text-[11px] text-gray-500 mt-0.5">{ev.timeStr}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ── Vista para Pastores (Lectura general + Predicaciones si autorizado) ─
  if (user.role === "pastor") {
    const canManagePreachings = canManagePreachingsUser(user);
    const [upcomingEvents, upcomingPlanning, upcomingPreachings] = await Promise.all([
      db.select().from(events).where(eq(events.isPublished, true)).orderBy(desc(events.startDate)).limit(4),
      db.select().from(planningEvents).orderBy(asc(planningEvents.date)),
      db.select().from(preachingSchedules).orderBy(asc(preachingSchedules.date)),
    ]);

    const nowStart = new Date();
    nowStart.setHours(0, 0, 0, 0);
    const nextPlanning = upcomingPlanning
      .filter((ev) => new Date(ev.date).getTime() >= nowStart.getTime() && ev.status === "scheduled")
      .slice(0, 5);
    const nextPreachings = upcomingPreachings
      .filter((p) => new Date(p.date).getTime() >= nowStart.getTime())
      .slice(0, 5);

    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold mb-1 capitalize">
              {todayFormatted}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
              Panel Pastoral
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Bienvenido, <span className="font-semibold text-navy">{user.name}</span>
              {" "}• Modo consulta pastoral{canManagePreachings ? " (con gestión de Predicaciones)" : ""}
            </p>
          </div>
          <Link
            href="/admin/predicaciones"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy/90 transition-colors"
          >
            <BookMarked className="w-4 h-4 text-gold" />
            {canManagePreachings ? "Gestionar Predicaciones" : "Ver Rol de Predicaciones"}
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { href: "/admin/eventos", label: "Eventos Web", desc: "Consulta de eventos publicados", icon: Calendar, color: "bg-purple-50 text-purple-600" },
            { href: "/admin/planeacion", label: "Planeación", desc: "Calendario por mes y ministerio", icon: CalendarRange, color: "bg-blue-50 text-blue-600" },
            { href: "/admin/predicaciones", label: "Predicaciones", desc: canManagePreachings ? "Asignar predicaciones del mes" : "Ver rol de predicaciones", icon: BookMarked, color: "bg-amber-50 text-amber-700" },
            { href: "/admin/ministerios", label: "Ministerios", desc: "Ver líderes y equipos", icon: Layers, color: "bg-emerald-50 text-emerald-600" },
            { href: "/admin/cumpleanos", label: "Cumpleaños", desc: "Directorio de cumpleaños", icon: Cake, color: "bg-pink-50 text-pink-600" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group block">
              <Card className="p-5 h-full border border-gray-200/80 hover:border-gold/60 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold transition-colors" />
                </div>
                <p className="font-bold text-navy text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy text-base flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-gold" /> Próximas Predicaciones
              </h2>
              <Link href="/admin/predicaciones" className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1">
                Ver rol completo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {nextPreachings.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No hay predicaciones programadas próximamente.</p>
            ) : (
              <div className="space-y-2.5">
                {nextPreachings.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-navy text-sm truncate">{p.preacherName}</p>
                      <p className="text-xs text-gray-500 truncate">{p.serviceName}{p.topic ? ` • ${p.topic}` : ""}</p>
                    </div>
                    <span className="text-xs font-bold text-navy shrink-0">
                      {new Date(p.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy text-base flex items-center gap-2">
                <CalendarRange className="w-4 h-4 text-blue-600" /> Agenda Próxima
              </h2>
              <Link href="/admin/planeacion" className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1">
                Ver calendario <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {nextPlanning.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No hay actividades próximas en planeación.</p>
            ) : (
              <div className="space-y-2.5">
                {nextPlanning.map((ev) => (
                  <div key={ev.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-navy text-sm truncate">{ev.title}</p>
                      <p className="text-xs text-gray-500 truncate">{ev.timeStr || "Todo el día"}{ev.responsible ? ` • ${ev.responsible}` : ""}</p>
                    </div>
                    <span className="text-xs font-bold text-navy shrink-0">
                      {new Date(ev.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Eventos Web Publicados
            </h2>
            <Link href="/admin/eventos" className="text-xs font-bold text-navy hover:text-gold flex items-center gap-1">
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50/60">
                <p className="text-[10px] font-bold uppercase text-gold-dark mb-1">{ev.category}</p>
                <p className="font-bold text-navy text-sm truncate">{ev.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(ev.startDate).toLocaleDateString("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })} • {ev.timeStr}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ── Vista completa para Super Admin, Admin, Pastor General y Pastor de Campus ──
  const session = { user };

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
    ...(isFullAdminRole(session.user.role)
      ? [
          {
            href: "/admin/usuarios",
            label: "Gestionar Usuarios",
            desc: "Asignar permisos de administrador, pastores o líder",
            icon: Users,
            color: "text-emerald-600 bg-emerald-50",
          },
        ]
      : []),
  ];

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
            {isFullAdminRole(session.user.role) && (
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
