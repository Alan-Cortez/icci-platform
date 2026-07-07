import type { Metadata } from "next";
import { EventosClient } from "./EventosClient";

export const metadata: Metadata = { title: "Eventos | ICCI" };

export default function EventosPage() {
  return <EventosClient />;
}
