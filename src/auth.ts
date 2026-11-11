import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { syncUserRoleFromMinistries } from "@/lib/role-sync";
import type { UserRole } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,                    // Auto-detect URL from request (works on Vercel)
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in: always read role from DB (DrizzleAdapter doesn't populate custom fields)
      if (user?.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });
        if (dbUser) {
          const synced = await syncUserRoleFromMinistries({
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            ministryId: dbUser.ministryId,
          });
          token.role = synced.role;
          token.id = dbUser.id;
          token.ministryId = synced.ministryId;
          token.campusId = dbUser.campusId;
          token.canManagePreachings = Boolean(dbUser.canManagePreachings);
        }
      }

      // On session update: re-read role from DB to pick up promotions made in admin panel
      if (trigger === "update" && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email as string),
        });
        if (dbUser) {
          const synced = await syncUserRoleFromMinistries({
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role,
            ministryId: dbUser.ministryId,
          });
          token.role = synced.role;
          token.ministryId = synced.ministryId;
          token.campusId = dbUser.campusId;
          token.canManagePreachings = Boolean(dbUser.canManagePreachings);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.ministryId = token.ministryId as string | null | undefined;
        session.user.campusId = token.campusId as string | null | undefined;
        session.user.canManagePreachings = Boolean(token.canManagePreachings);
      }
      return session;
    },
  },
});
