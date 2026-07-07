import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { BlogListClient } from "./BlogListClient";

export const metadata = { title: "Blog | ICCI Admin" };

export default async function AdminBlogPage() {
  const allPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));

  return <BlogListClient initialPosts={allPosts} />;
}
