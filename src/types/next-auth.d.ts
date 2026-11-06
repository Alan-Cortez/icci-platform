import type { DefaultSession, DefaultJWT } from "next-auth";

export type UserRole = "user" | "admin" | "superadmin" | "pastor" | "leader";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      ministryId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    ministryId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRole;
    ministryId?: string | null;
  }
}
