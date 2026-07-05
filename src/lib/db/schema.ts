import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("social_admin"),
  campusId: text("campus_id"),
  ministryId: text("ministry_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const campuses = sqliteTable("campuses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  state: text("state"),
  isMain: integer("is_main", { mode: "boolean" }).notNull().default(false),
  pastor: text("pastor"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  imageUrl: text("image_url"),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export const campusSchedules = sqliteTable("campus_schedules", {
  id: text("id").primaryKey(),
  campusId: text("campus_id").notNull().references(() => campuses.id),
  title: text("title").notNull(),
  days: text("days").notNull(),
  time: text("time").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const ministries = sqliteTable("ministries", {
  id: text("id").primaryKey(),
  campusId: text("campus_id").references(() => campuses.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description"),
  schedule: text("schedule"),
  imageUrl: text("image_url"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  campusId: text("campus_id").references(() => campuses.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  time: text("time"),
  location: text("location"),
  responsible: text("responsible"),
  capacity: integer("capacity"),
  requiresRegistration: integer("requires_registration", { mode: "boolean" }).notNull().default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const eventRegistrations = sqliteTable("event_registrations", {
  id: text("id").primaryKey(),
  eventId: text("event_id").notNull().references(() => events.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  registeredAt: text("registered_at").notNull().default(sql`(datetime('now'))`),
});

export const sermons = sqliteTable("sermons", {
  id: text("id").primaryKey(),
  campusId: text("campus_id").references(() => campuses.id),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  series: text("series"),
  pastor: text("pastor"),
  videoUrl: text("video_url"),
  audioUrl: text("audio_url"),
  pdfUrl: text("pdf_url"),
  date: text("date").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const devotionals = sqliteTable("devotionals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  imageUrl: text("image_url"),
  reflection: text("reflection").notNull(),
  verse: text("verse").notNull(),
  author: text("author").notNull(),
  date: text("date").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  authorId: text("author_id").references(() => users.id),
  imageUrl: text("image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(false),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const galleryItems = sqliteTable("gallery_items", {
  id: text("id").primaryKey(),
  campusId: text("campus_id").references(() => campuses.id),
  title: text("title"),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const prayerRequests = sqliteTable("prayer_requests", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  campusId: text("campus_id").references(() => campuses.id),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const baptisms = sqliteTable("baptisms", {
  id: text("id").primaryKey(),
  personName: text("person_name").notNull(),
  date: text("date").notNull(),
  pastor: text("pastor").notNull(),
  campusId: text("campus_id").notNull().references(() => campuses.id),
  certificateUrl: text("certificate_url"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const donations = sqliteTable("donations", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  donorName: text("donor_name"),
  email: text("email"),
  method: text("method"),
  status: text("status").notNull().default("pending"),
  campusId: text("campus_id").references(() => campuses.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type User = typeof users.$inferSelect;
export type Campus = typeof campuses.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Sermon = typeof sermons.$inferSelect;
export type Devotional = typeof devotionals.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
