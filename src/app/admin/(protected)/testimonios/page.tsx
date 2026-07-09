import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllTestimonies } from "@/actions/testimonies";
import { TestimoniosListClient } from "./TestimoniosListClient";

export const metadata = {
  title: "Gestión de Testimonios | ICCI Admin",
};

export default async function AdminTestimoniosPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  const role = (session.user as any)?.role || "user";
  if (role !== "admin" && role !== "superadmin") {
    redirect("/");
  }

  const list = await getAllTestimonies();

  return <TestimoniosListClient initialTestimonies={list} />;
}
