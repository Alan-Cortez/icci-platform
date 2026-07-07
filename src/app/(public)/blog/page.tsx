import type { Metadata } from "next";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { BlogClient } from "./BlogClient";

export const metadata: Metadata = { title: "Blog | ICCI" };
export const revalidate = 0;

export default async function BlogPage() {
  const allPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));

  return <BlogClient initialPosts={allPosts} />;
}
