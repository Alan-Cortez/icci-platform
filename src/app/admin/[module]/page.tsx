import { redirect } from "next/navigation";
import { getSession, canAccessAdmin } from "@/lib/auth/session";
import { AdminModulePage } from "@/components/admin/AdminModulePage";
import { db } from "@/lib/db";
import { campuses, events, sermons, devotionals, users as usersTable } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

interface Props {
  params: Promise<{ module?: string }>;
}

const moduleTitles: Record<string, { title: string; description: string }> = {
  campus: { title: "Gestión de Campus", description: "Administra los campus de la red ICCI." },
  usuarios: { title: "Gestión de Usuarios", description: "Administra usuarios y roles del sistema." },
  eventos: { title: "Gestión de Eventos", description: "Crea y administra eventos en todos los campus." },
  ministerios: { title: "Gestión de Ministerios", description: "Administra los ministerios de la iglesia." },
  predicaciones: { title: "Gestión de Predicaciones", description: "Publica y administra predicaciones." },
  devocionales: { title: "Gestión de Devocionales", description: "Publica devocionales diarios." },
  blog: { title: "Gestión del Blog", description: "Administra artículos del blog." },
  galeria: { title: "Gestión de Galería", description: "Administra fotos y multimedia." },
  bautizos: { title: "Registro de Bautizos", description: "Registra bautizos y certificados." },
  donaciones: { title: "Donaciones", description: "Consulta y administra donaciones." },
  oracion: { title: "Solicitudes de Oración", description: "Revisa peticiones de oración recibidas." },
  configuracion: { title: "Configuración", description: "Ajustes generales del sitio." },
};

export default async function AdminModuleRoute({ params }: Props) {
  const session = await getSession();
  if (!session || !canAccessAdmin(session.role)) {
    redirect("/admin/login");
  }

  const segment = await params;
  const moduleName = segment.module ?? "";
  const config = moduleTitles[moduleName];

  if (!config) {
    redirect("/admin");
  }

  let initialData: any = [];
  
  if (moduleName === "campus") {
    initialData = await db.select().from(campuses);
  } else if (moduleName === "eventos") {
    initialData = await db.select().from(events).orderBy(desc(events.startDate));
  } else if (moduleName === "predicaciones") {
    initialData = await db.select().from(sermons).orderBy(desc(sermons.date));
  } else if (moduleName === "devocionales") {
    initialData = await db.select().from(devotionals).orderBy(desc(devotionals.date));
  } else if (moduleName === "usuarios") {
    initialData = await db.select().from(usersTable);
  }

  // Also fetch all campuses for the dropdowns
  const allCampuses = await db.select().from(campuses);

  return (
    <AdminModulePage 
      title={config.title} 
      description={config.description} 
      module={moduleName} 
      initialData={initialData}
      allCampuses={allCampuses}
    />
  );
}
