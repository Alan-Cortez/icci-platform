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
