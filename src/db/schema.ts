import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// --- NEXTAUTH SCHEMAS ---

export const users = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  role: text("role").default("user"), // 'user', 'admin'
});

export const accounts = sqliteTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => [
  primaryKey({ columns: [account.provider, account.providerAccountId] })
]);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (vt) => [
  primaryKey({ columns: [vt.identifier, vt.token] })
]);

// --- PLATFORM SCHEMAS ---

export const events = sqliteTable("event", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  category: text("category").notNull(),
  month: text("month").notNull(),
  description: text("description").notNull(),
  dateStr: text("dateStr").notNull(),
  timeStr: text("timeStr").notNull(),
  location: text("location").notNull(),
  campus: text("campus").notNull(),
  capacity: integer("capacity"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  image: text("image").notNull(),
  price: text("price"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const sermons = sqliteTable("sermon", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  youtubeUrl: text("youtubeUrl").notNull(),
  speaker: text("speaker").notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const devotionals = sqliteTable("devotional", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  verse: text("verse"),
  verseText: text("verseText"),
  content: text("content").notNull(),
  author: text("author").notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const blogPosts = sqliteTable("blog_post", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  coverImage: text("coverImage"),
  publishedAt: integer("publishedAt", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const gallery = sqliteTable("gallery", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'events', 'youth', 'kids', 'campus'
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const baptisms = sqliteTable("baptism", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  campus: text("campus").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'completed'
  notes: text("notes"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const prayerRequests = sqliteTable("prayer_request", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  request: text("request").notNull(),
  isPublic: integer("isPublic", { mode: "boolean" }).default(false),
  status: text("status").notNull().default("pending"), // 'pending', 'prayed'
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const testimonies = sqliteTable("testimony", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const donations = sqliteTable("donation", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: integer("amount").notNull(), // stored in cents
  currency: text("currency").notNull().default("MXN"),
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  paymentMethod: text("paymentMethod"),
  email: text("email"),
  name: text("name"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// --- CHURCH STRUCTURE SCHEMAS ---

export const campuses = sqliteTable("campus", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  state: text("state").notNull(),
  isMain: integer("isMain", { mode: "boolean" }).default(false),
  pastor: text("pastor").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  image: text("image"), // Cover photo for the campus
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const ministries = sqliteTable("ministry", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  schedule: text("schedule"),
  leader: text("leader"),
  image: text("image"), // Cover photo for the ministry
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
