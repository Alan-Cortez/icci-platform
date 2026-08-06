import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import type { UserRole } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, user object is available
      if (user) {
        // Check if this email is the superadmin
        if (user.email && user.email === process.env.SUPER_ADMIN_EMAIL) {
          // Ensure superadmin role in DB
          await db
            .update(users)
            .set({ role: "superadmin" })
            .where(eq(users.email, user.email));
          token.role = "superadmin" as UserRole;
        } else {
          // Read role from DB (set by DrizzleAdapter when user was created or updated)
          token.role = (user.role ?? "user") as UserRole;
        }
        token.id = user.id;
      }

      // On session update, re-read role from DB to pick up admin promotions
      if (trigger === "update" && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email as string),
        });
        if (dbUser) {
          token.role = dbUser.role as UserRole;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
