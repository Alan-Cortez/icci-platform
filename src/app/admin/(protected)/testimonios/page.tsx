import { getAllTestimonies } from "@/actions/testimonies";
import { TestimoniosListClient } from "./TestimoniosListClient";
import { requireRole } from "@/lib/admin-auth";
import { EVENT_WRITER_ROLES } from "@/lib/roles";

export const metadata = {
  title: "Gestión de Testimonios | ICCI Admin",
};

export default async function AdminTestimoniosPage() {
  await requireRole(EVENT_WRITER_ROLES, "/admin");

  const list = await getAllTestimonies();

  return <TestimoniosListClient initialTestimonies={list} />;
}
