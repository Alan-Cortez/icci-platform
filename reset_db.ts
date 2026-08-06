import "dotenv/config";
import { db } from "./src/db/index.js";
import { sql } from "drizzle-orm";

async function run() {
  await db.run(sql`DROP TABLE IF EXISTS event`);
  await db.run(sql`DROP TABLE IF EXISTS sermon`);
  await db.run(sql`DROP TABLE IF EXISTS devotional`);
  await db.run(sql`DROP TABLE IF EXISTS campus`);
  await db.run(sql`DROP TABLE IF EXISTS ministry`);
  await db.run(sql`DROP TABLE IF EXISTS gallery`);
  await db.run(sql`DROP TABLE IF EXISTS baptism`);
  console.log("Dropped modified tables.");
}

run();
