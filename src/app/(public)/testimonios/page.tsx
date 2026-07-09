import { getApprovedTestimonies } from "@/actions/testimonies";
import { TestimoniosClient } from "./TestimoniosClient";

export const metadata = {
  title: "Testimonios de Fe | Comunidad ICCI",
  description: "Historias reales de fe, restauración y el obrar de Dios en las vidas de nuestra familia espiritual.",
};

export default async function TestimoniosPage() {
  const list = await getApprovedTestimonies();

  return <TestimoniosClient initialTestimonies={list} />;
}
