/**
 * Script para promover a un usuario como superadmin.
 * Uso: npx tsx scripts/make-admin.ts <email>
 *
 * Ejemplo:
 *   npx tsx scripts/make-admin.ts alancortez9966@gmail.com
 */
import "dotenv/config";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error("❌ Debes proporcionar un email.");
  console.error("   Uso: npx tsx scripts/make-admin.ts <email>");
  process.exit(1);
}

async function main() {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    console.error(`❌ No existe un usuario con el email: ${email}`);
    console.error("   El usuario debe iniciar sesión al menos una vez antes de ser promovido.");
    process.exit(1);
  }

  await db.update(users).set({ role: "superadmin" }).where(eq(users.email, email));

  console.log(`✅ ${email} ahora es superadmin.`);
  console.log("   Cierra sesión y vuelve a entrar para que el cambio tome efecto.");
}

main().catch((err) => { console.error(err); process.exit(1); });
