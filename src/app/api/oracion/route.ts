import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { prayerRequests } from "@/db/schema";

const prayerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  request: z.string().min(1, "La solicitud es requerida"),
  campusId: z.string().nullable().optional(),
  isPublic: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const body = prayerSchema.parse(await req.json());

    await db.insert(prayerRequests).values({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      request: body.request,
      campusId: body.campusId || null,
      isPublic: body.isPublic,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
