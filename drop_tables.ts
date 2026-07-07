import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {
  await db.run(sql`DROP TABLE IF EXISTS blog_post;`);
  await db.run(sql`DROP TABLE IF EXISTS gallery;`);
  console.log("Tables dropped");
}

main().catch(console.error);
