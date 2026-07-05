"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { campuses, events, sermons, devotionals, ministries } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function createCampus(data: any) {
  await db.insert(campuses).values({
    id: data.slug || data.name.toLowerCase().replace(/ /g, "-"),
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/ /g, "-"),
    state: data.state,
    pastor: data.pastor,
    phone: data.phone,
    address: data.address,
    email: data.email,
    description: data.description,
    isActive: true,
  });
  revalidatePath("/admin/campus");
  revalidatePath("/campus");
}

export async function deleteCampus(id: string) {
  await db.delete(campuses).where(eq(campuses.id, id));
  revalidatePath("/admin/campus");
  revalidatePath("/campus");
}

export async function createEvent(data: any) {
  await db.insert(events).values({
    id: randomUUID(),
    title: data.title,
    slug: data.title.toLowerCase().replace(/ /g, "-"),
    description: data.description,
    startDate: data.startDate,
    time: data.time,
    location: data.location,
    campusId: data.campusId || null,
    responsible: data.responsible,
    capacity: data.capacity ? parseInt(data.capacity) : 0,
    isPublished: true,
  });
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}

export async function createSermon(data: any) {
  await db.insert(sermons).values({
    id: randomUUID(),
    title: data.title,
    slug: data.title.toLowerCase().replace(/ /g, "-"),
    series: data.series,
    pastor: data.pastor,
    campusId: data.campusId || null,
    videoUrl: data.videoUrl,
    date: data.date,
    isPublished: true,
  });
  revalidatePath("/admin/predicaciones");
  revalidatePath("/predicaciones");
}

export async function deleteSermon(id: string) {
  await db.delete(sermons).where(eq(sermons.id, id));
  revalidatePath("/admin/predicaciones");
  revalidatePath("/predicaciones");
}

export async function createDevotional(data: any) {
  await db.insert(devotionals).values({
    id: randomUUID(),
    title: data.title,
    slug: data.title.toLowerCase().replace(/ /g, "-"),
    verse: data.verse,
    reflection: data.reflection,
    author: data.author,
    date: data.date,
    isPublished: true,
  });
  revalidatePath("/admin/devocionales");
  revalidatePath("/devocionales");
}

export async function deleteDevotional(id: string) {
  await db.delete(devotionals).where(eq(devotionals.id, id));
  revalidatePath("/admin/devocionales");
  revalidatePath("/devocionales");
}
