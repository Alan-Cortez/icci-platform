import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { CAMPUSES, MINISTRIES, ROLES, SCHEDULES } from "@/lib/constants";
import {
  campuses,
  campusSchedules,
  devotionals,
  events,
  ministries,
  sermons,
  siteSettings,
  testimonials,
  users as usersTable,
} from "@/lib/db/schema";

async function seed() {
  console.log("🌱 Iniciando seed de la base de datos ICCI...");

  // ─── Campus ────────────────────────────────────────────────────────────────
  for (const campus of CAMPUSES) {
    await db
      .insert(campuses)
      .values({
        id: campus.id,
        name: campus.name,
        slug: campus.id,
        state: campus.state,
        isMain: campus.isMain,
        pastor: campus.pastor,
        address: campus.address,
        phone: campus.phone,
        description: campus.description,
        isActive: true,
      })
      .onConflictDoNothing();
  }

  // ─── Schedules ─────────────────────────────────────────────────────────────
  for (const [index, schedule] of SCHEDULES.entries()) {
    await db
      .insert(campusSchedules)
      .values({
        id: randomUUID(),
        campusId: "allende",
        title: schedule.title,
        days: schedule.days,
        time: schedule.time,
        sortOrder: index,
      })
      .onConflictDoNothing();
  }

  // ─── Ministries ────────────────────────────────────────────────────────────
  for (const ministry of MINISTRIES) {
    await db
      .insert(ministries)
      .values({
        id: ministry.id,
        name: ministry.name,
        slug: ministry.id,
        category: "principal",
        description: ministry.description,
        schedule: ministry.schedule,
        isActive: true,
      })
      .onConflictDoNothing();
  }

  // ─── Users ─────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  await db
    .insert(usersTable)
    .values({
      id: "admin-001",
      email: "admin@icci.org.mx",
      passwordHash: adminPassword,
      name: "Administrador ICCI",
      role: ROLES.SUPER_ADMIN,
      isActive: true,
    })
    .onConflictDoNothing();

  await db
    .insert(usersTable)
    .values({
      id: "pastor-001",
      email: "pastor@icci.org.mx",
      passwordHash: adminPassword,
      name: "Pastor General ICCI",
      role: ROLES.PASTOR_GENERAL,
      isActive: true,
    })
    .onConflictDoNothing();

  // ─── Events ────────────────────────────────────────────────────────────────
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(events).values([
    {
      id: "event-001",
      campusId: "allende",
      title: "Conferencia de Avivamiento",
      slug: "conferencia-de-avivamiento",
      description: "Tres días de adoración, enseñanza y renovación espiritual para toda la familia.",
      startDate: nextWeek.toISOString().split("T")[0],
      time: "7:00 PM",
      location: "Auditorio Principal - Allende",
      responsible: "Pastor Principal",
      capacity: 500,
      requiresRegistration: true,
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "event-002",
      campusId: "allende",
      title: "Retiro de Jóvenes",
      slug: "retiro-de-jovenes",
      description: "Un fin de semana de encuentro con Dios, amistad y propósito para jóvenes de 11 años en adelante.",
      startDate: nextMonth.toISOString().split("T")[0],
      time: "Todo el día",
      location: "Campamento El Mirador, Coahuila",
      responsible: "Ministerio de Jóvenes",
      capacity: 150,
      requiresRegistration: true,
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "event-003",
      campusId: "allende",
      title: "Evangelización en la Comunidad",
      slug: "evangelizacion-comunidad",
      description: "Último domingo del mes: salimos a compartir el evangelio en las calles de nuestra ciudad.",
      startDate: nextMonth.toISOString().split("T")[0],
      time: "7:00 PM",
      location: "Centro de Allende",
      responsible: "Equipo de Evangelismo",
      capacity: 0,
      requiresRegistration: false,
      isFeatured: false,
      isPublished: true,
    },
  ]).onConflictDoNothing();

  // ─── Sermons ───────────────────────────────────────────────────────────────
  await db.insert(sermons).values([
    {
      id: "sermon-001",
      campusId: "allende",
      title: "Fe que mueve montañas",
      slug: "fe-que-mueve-montanas",
      series: "Serie de Fe",
      pastor: "Pastor General ICCI",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: now.toISOString().split("T")[0],
      isFeatured: true,
      isPublished: true,
    },
    {
      id: "sermon-002",
      campusId: "allende",
      title: "El poder de la oración",
      slug: "el-poder-de-la-oracion",
      series: "Fundamentos Bíblicos",
      pastor: "Pastor General ICCI",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isFeatured: false,
      isPublished: true,
    },
    {
      id: "sermon-003",
      campusId: "sabinas",
      title: "Gracia que transforma",
      slug: "gracia-que-transforma",
      series: "Serie de Fe",
      pastor: "Pastor Campus Sabinas",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isFeatured: false,
      isPublished: true,
    },
  ]).onConflictDoNothing();

  // ─── Devotionals ───────────────────────────────────────────────────────────
  await db.insert(devotionals).values([
    {
      id: "devotional-001",
      title: "Confía en el Señor",
      slug: "confia-en-el-senor",
      reflection: "En momentos de incertidumbre, recordemos que Dios tiene un plan perfecto para nuestras vidas. Su fidelidad es constante y Su amor inagotable.",
      verse: "Confía en el Señor de todo corazón, y no en tu propia inteligencia. — Proverbios 3:5",
      author: "Equipo Pastoral ICCI",
      date: now.toISOString().split("T")[0],
      isPublished: true,
    },
    {
      id: "devotional-002",
      title: "Fortaleza en la debilidad",
      slug: "fortaleza-en-la-debilidad",
      reflection: "Es precisamente en nuestra debilidad donde la gracia de Dios brilla con mayor intensidad. No temas admitir que necesitas a Dios.",
      verse: "Mi poder se perfecciona en la debilidad. — 2 Corintios 12:9",
      author: "Equipo Pastoral ICCI",
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isPublished: true,
    },
    {
      id: "devotional-003",
      title: "El gozo del Señor",
      slug: "el-gozo-del-senor",
      reflection: "El gozo bíblico no depende de las circunstancias externas. Es una fortaleza interior que proviene de nuestra relación con Dios.",
      verse: "El gozo del Señor es vuestra fortaleza. — Nehemías 8:10",
      author: "Equipo Pastoral ICCI",
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isPublished: true,
    },
  ]).onConflictDoNothing();

  // ─── Testimonials ──────────────────────────────────────────────────────────
  await db.insert(testimonials).values([
    {
      id: "testimonial-001",
      name: "María González",
      content: "ICCI ha sido mi hogar espiritual. Aquí encontré una familia que me ama y me impulsa a crecer en mi fe cada día.",
      isPublished: true,
      sortOrder: 0,
    },
    {
      id: "testimonial-002",
      name: "Carlos y Ana Rodríguez",
      content: "Nuestra familia encontró en ICCI un lugar de sanidad y restauración. Los ministerios para niños y jóvenes han transformado a nuestros hijos.",
      isPublished: true,
      sortOrder: 1,
    },
    {
      id: "testimonial-003",
      name: "Roberto Martínez",
      content: "Llegué sin saber nada de Dios. Hoy soy líder del ministerio de varones. ICCI me dio propósito y una familia que jamás imaginé.",
      isPublished: true,
      sortOrder: 2,
    },
  ]).onConflictDoNothing();

  // ─── Site settings ─────────────────────────────────────────────────────────
  await db.insert(siteSettings).values([
    { key: "site_name", value: "Iglesias Comunidad De Cristo Internacional" },
    { key: "site_phone", value: "+52 862 101 3598" },
    { key: "site_address", value: "Calle Benito Juárez #1705 Norte, Allende, Coahuila" },
    { key: "site_email", value: "contacto@icci.org.mx" },
    { key: "site_facebook", value: "https://facebook.com" },
  ]).onConflictDoNothing();

  console.log("✅ Seed completado exitosamente.");
  console.log("   👤 Admin:  admin@icci.org.mx  /  admin123");
  console.log("   👤 Pastor: pastor@icci.org.mx /  admin123");
  console.log(`   🏛️  Campus: ${CAMPUSES.length}`);
  console.log("   📅 Eventos: 3");
  console.log("   🎙️  Predicaciones: 3");
  console.log("   📖 Devocionales: 3");
  console.log("   🙏 Testimonios: 3");
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
