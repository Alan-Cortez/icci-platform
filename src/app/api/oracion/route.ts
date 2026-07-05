import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { prayerRequests } from "@/lib/db/schema";

const prayerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(1),
  campusId: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = prayerSchema.parse(await request.json());

    await db.insert(prayerRequests).values({
      id: randomUUID(),
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      message: body.message,
      campusId: body.campusId || null,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
