import { db } from "@/db";
import { ministries } from "@/db/schema";
import { MinistryListClient } from "./MinistryListClient";

export const metadata = { title: "Ministerios | ICCI Admin" };

export default async function AdminMinisteriosPage() {
  const allMinistries = await db.select().from(ministries);

  return <MinistryListClient initialMinistries={allMinistries} />;
}
