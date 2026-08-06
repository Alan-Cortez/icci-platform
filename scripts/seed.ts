import "dotenv/config";
import { randomUUID } from "crypto";
import { db } from "@/db";
import { CAMPUSES, MINISTRIES, SCHEDULES } from "@/lib/constants";
import {
  campuses,
  campusSchedules,
  devotionals,
  events,
  ministries,
  sermons,
  siteSettings,
} from "@/db/schema";

async function seed() {
  console.log("🌱 Iniciando seed de la base de datos ICCI...");

  // ─── Campus ──────────────────────────────────────────────────────────────
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
  console.log(`   ✅ Campus: ${CAMPUSES.length}`);

  // ─── Campus schedules ────────────────────────────────────────────────────
  for (const [index, schedule] of SCHEDULES.entries()) {
    await db
      .insert(campusSchedules)
      .values({
        campusId: "allende",
        title: schedule.title,
        days: schedule.days,
        time: schedule.time,
        sortOrder: index,
      })
      .onConflictDoNothing();
  }
  console.log(`   ✅ Horarios: ${SCHEDULES.length}`);

  // ─── Ministries ──────────────────────────────────────────────────────────
  for (const ministry of MINISTRIES) {
    await db
      .insert(ministries)
      .values({
        id: ministry.id,
        name: ministry.name,
        slug: ministry.id,
        category: ministry.id, // varones, femenil, jovenes, ninos
        description: ministry.description,
        schedule: ministry.schedule,
        isActive: true,
      })
      .onConflictDoNothing();
  }
  console.log(`   ✅ Ministerios: ${MINISTRIES.length}`);

  // ─── Events ──────────────────────────────────────────────────────────────
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  await db
    .insert(events)
    .values([
      {
        id: "event-001",
        campusId: "allende",
        title: "Conferencia de Avivamiento",
        slug: "conferencia-de-avivamiento",
        category: "conferencia",
        description:
          "Tres días de adoración, enseñanza y renovación espiritual para toda la familia.",
        startDate: nextWeek,
        timeStr: "7:00 PM",
        location: "Auditorio Principal - Allende",
        responsible: "Pastor Principal",
        capacity: 500,
        requiresRegistration: true,
        featured: true,
        isPublished: true,
      },
      {
        id: "event-002",
        campusId: "allende",
        title: "Retiro de Jóvenes",
        slug: "retiro-de-jovenes",
        category: "retiro",
        description:
          "Un fin de semana de encuentro con Dios, amistad y propósito para jóvenes de 11 años en adelante.",
        startDate: nextMonth,
        timeStr: "Todo el día",
        location: "Campamento El Mirador, Coahuila",
        responsible: "Ministerio de Jóvenes",
        capacity: 150,
        requiresRegistration: true,
        featured: false,
        isPublished: true,
      },
      {
        id: "event-003",
        campusId: "allende",
        title: "Evangelización en la Comunidad",
        slug: "evangelizacion-comunidad",
        category: "evangelismo",
        description:
          "Último domingo del mes: salimos a compartir el evangelio en las calles de nuestra ciudad.",
        startDate: nextMonth,
        timeStr: "7:00 PM",
        location: "Centro de Allende",
        responsible: "Equipo de Evangelismo",
        featured: false,
        isPublished: true,
      },
    ])
    .onConflictDoNothing();
  console.log("   ✅ Eventos: 3");

  // ─── Sermons ─────────────────────────────────────────────────────────────
  await db
    .insert(sermons)
    .values([
      {
        id: "sermon-001",
        campusId: "allende",
        title: "Fe que mueve montañas",
        slug: "fe-que-mueve-montanas",
        series: "Serie de Fe",
        speaker: "Pastor General ICCI",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        date: now,
        featured: true,
        isPublished: true,
      },
      {
        id: "sermon-002",
        campusId: "allende",
        title: "El poder de la oración",
        slug: "el-poder-de-la-oracion",
        series: "Fundamentos Bíblicos",
        speaker: "Pastor General ICCI",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        featured: false,
        isPublished: true,
      },
      {
        id: "sermon-003",
        campusId: "sabinas",
        title: "Gracia que transforma",
        slug: "gracia-que-transforma",
        series: "Serie de Fe",
        speaker: "Pastor Campus Sabinas",
        youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        featured: false,
        isPublished: true,
      },
    ])
    .onConflictDoNothing();
  console.log("   ✅ Predicaciones: 3");

  // ─── Devotionals ─────────────────────────────────────────────────────────
  await db
    .insert(devotionals)
    .values([
      {
        id: "devotional-001",
        title: "Confía en el Señor",
        slug: "confia-en-el-senor",
        type: "classic",
        content:
          "En momentos de incertidumbre, recordemos que Dios tiene un plan perfecto para nuestras vidas. Su fidelidad es constante y Su amor inagotable.",
        verse: "Proverbios 3:5",
        verseText:
          "Confía en el Señor de todo corazón, y no en tu propia inteligencia.",
        author: "Equipo Pastoral ICCI",
        date: now,
        isPublished: true,
      },
      {
        id: "devotional-002",
        title: "Fortaleza en la debilidad",
        slug: "fortaleza-en-la-debilidad",
        type: "classic",
        content:
          "Es precisamente en nuestra debilidad donde la gracia de Dios brilla con mayor intensidad. No temas admitir que necesitas a Dios.",
        verse: "2 Corintios 12:9",
        verseText: "Mi poder se perfecciona en la debilidad.",
        author: "Equipo Pastoral ICCI",
        date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        isPublished: true,
      },
      {
        id: "devotional-003",
        title: "El gozo del Señor",
        slug: "el-gozo-del-senor",
        type: "classic",
        content:
          "El gozo bíblico no depende de las circunstancias externas. Es una fortaleza interior que proviene de nuestra relación con Dios.",
        verse: "Nehemías 8:10",
        verseText: "El gozo del Señor es vuestra fortaleza.",
        author: "Equipo Pastoral ICCI",
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        isPublished: true,
      },
    ])
    .onConflictDoNothing();
  console.log("   ✅ Devocionales: 3");

  // ─── Site settings ───────────────────────────────────────────────────────
  await db
    .insert(siteSettings)
    .values([
      { key: "site_name", value: "Iglesias Comunidad De Cristo Internacional" },
      { key: "site_phone", value: "+52 862 101 3598" },
      {
        key: "site_address",
        value: "Calle Benito Juárez #1705 Norte, Allende, Coahuila",
      },
      { key: "site_email", value: "contacto@icci.org.mx" },
      {
        key: "site_facebook",
        value: "https://www.facebook.com/share/1eUnmRAFef/",
      },
      {
        key: "site_youtube",
        value: "https://youtube.com/@icctv-101?si=kp51y50RG4r6icuu",
      },
    ])
    .onConflictDoNothing();
  console.log("   ✅ Configuración del sitio");

  console.log("\n✨ Seed completado exitosamente.");
  console.log(
    "   Para configurar el superadmin, pon tu email en SUPER_ADMIN_EMAIL en .env"
  );
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
