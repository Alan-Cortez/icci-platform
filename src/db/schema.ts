import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─────────────────────────────────────────────────────────────────────────────
// NEXTAUTH TABLES (do NOT rename — required by DrizzleAdapter)
// ─────────────────────────────────────────────────────────────────────────────

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  // Platform fields
  role: text("role").$type<"user" | "admin" | "superadmin">().default("user").notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  campusId: text("campusId"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─────────────────────────────────────────────────────────────────────────────
// CHURCH STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────

export const campuses = sqliteTable("campus", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  state: text("state").notNull(),
  isMain: integer("isMain", { mode: "boolean" }).default(false).notNull(),
  pastor: text("pastor").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  description: text("description").notNull(),
  image: text("image"),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const campusSchedules = sqliteTable("campus_schedule", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId")
    .notNull()
    .references(() => campuses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  days: text("days").notNull(),
  time: text("time").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
});

export const ministries = sqliteTable("ministry", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // 'varones' | 'femenil' | 'jovenes' | 'ninos' | 'general'
  description: text("description").notNull(),
  schedule: text("schedule"),
  leader: text("leader"),
  image: text("image"),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT
// ─────────────────────────────────────────────────────────────────────────────

export const events = sqliteTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  responsible: text("responsible"),
  startDate: integer("startDate", { mode: "timestamp_ms" }).notNull(),
  endDate: integer("endDate", { mode: "timestamp_ms" }),
  timeStr: text("timeStr").notNull(),
  image: text("image"),
  capacity: integer("capacity"),
  requiresRegistration: integer("requiresRegistration", {
    mode: "boolean",
  })
    .default(false)
    .notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  isPublished: integer("isPublished", { mode: "boolean" })
    .default(true)
    .notNull(),
  price: text("price"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const eventRegistrations = sqliteTable("event_registration", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  registeredAt: integer("registeredAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const sermons = sqliteTable("sermon", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  series: text("series"),
  description: text("description"),
  youtubeUrl: text("youtubeUrl"),
  audioUrl: text("audioUrl"),
  pdfUrl: text("pdfUrl"),
  speaker: text("speaker").notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  image: text("image"),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  isPublished: integer("isPublished", { mode: "boolean" })
    .default(true)
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const devotionals = sqliteTable("devotional", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").default("classic").notNull(), // 'classic' | 'quote' | 'challenge'
  verse: text("verse"),
  verseText: text("verseText"),
  content: text("content").notNull(),
  author: text("author").notNull(),
  date: integer("date", { mode: "timestamp_ms" }).notNull(),
  image: text("image"),
  isPublished: integer("isPublished", { mode: "boolean" })
    .default(true)
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const blogPosts = sqliteTable("blog_post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  authorId: text("authorId").references(() => users.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(), // Display name (may differ from user.name)
  coverImage: text("coverImage"),
  isPublished: integer("isPublished", { mode: "boolean" })
    .default(false)
    .notNull(),
  publishedAt: integer("publishedAt", { mode: "timestamp_ms" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const gallery = sqliteTable("gallery", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'events' | 'youth' | 'kids' | 'campus' | 'general'
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY / ENGAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

export const testimonies = sqliteTable("testimony", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  status: text("status")
    .$type<"pending" | "approved" | "rejected">()
    .default("pending")
    .notNull(),
  featured: integer("featured", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const comments = sqliteTable("comment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  devotionalId: text("devotionalId").references(() => devotionals.id, {
    onDelete: "cascade",
  }),
  testimonyId: text("testimonyId").references(() => testimonies.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const prayerRequests = sqliteTable("prayer_request", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  request: text("request").notNull(),
  isPublic: integer("isPublic", { mode: "boolean" }).default(false).notNull(),
  status: text("status")
    .$type<"pending" | "prayed">()
    .default("pending")
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const baptisms = sqliteTable("baptism", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  pastor: text("pastor"),
  certificateUrl: text("certificateUrl"),
  notes: text("notes"),
  status: text("status")
    .$type<"pending" | "approved" | "completed">()
    .default("pending")
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const donations = sqliteTable("donation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  campusId: text("campusId").references(() => campuses.id, {
    onDelete: "set null",
  }),
  amount: integer("amount").notNull(), // stored in cents
  currency: text("currency").default("MXN").notNull(),
  status: text("status")
    .$type<"pending" | "completed" | "failed">()
    .default("pending")
    .notNull(),
  paymentMethod: text("paymentMethod"),
  email: text("email"),
  name: text("name"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

export const siteSettings = sqliteTable("site_setting", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// ─────────────────────────────────────────────────────────────────────────────
// INFERRED TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Campus = typeof campuses.$inferSelect;
export type NewCampus = typeof campuses.$inferInsert;
export type CampusSchedule = typeof campusSchedules.$inferSelect;
export type Ministry = typeof ministries.$inferSelect;
export type NewMinistry = typeof ministries.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;
export type Devotional = typeof devotionals.$inferSelect;
export type NewDevotional = typeof devotionals.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type GalleryItem = typeof gallery.$inferSelect;
export type NewGalleryItem = typeof gallery.$inferInsert;
export type Testimony = typeof testimonies.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type Baptism = typeof baptisms.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
