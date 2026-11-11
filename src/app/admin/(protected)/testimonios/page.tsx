import { getAllTestimonies } from "@/actions/testimonies";
import { TestimoniosListClient } from "./TestimoniosListClient";
import { requireRole } from "@/lib/admin-auth";

export const metadata = {
  title: "Gestión de Testimonios | ICCI Admin",
};

export default async function AdminTestimoniosPage() {
  await requireRole(["superadmin", "admin", "pastor"], "/admin");

  const list = await getAllTestimonies();

  return <TestimoniosListClient initialTestimonies={list} />;
}
