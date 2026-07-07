import { db } from "@/db";
import { testimonies, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TestimoniosClient } from "./TestimoniosClient";

export const metadata = { title: "Testimonios | ICCI Admin" };

export default async function AdminTestimoniosPage() {
  const data = await db
    .select({
      id: testimonies.id,
      content: testimonies.content,
      status: testimonies.status,
      createdAt: testimonies.createdAt,
      userId: testimonies.userId,
      userName: users.name,
      userEmail: users.email,
    })
    .from(testimonies)
    .leftJoin(users, eq(testimonies.userId, users.id))
    .orderBy(desc(testimonies.createdAt));

  return <TestimoniosClient initialTestimonies={data} />;
}
