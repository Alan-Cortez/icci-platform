import type { DefaultSession, DefaultJWT } from "next-auth";

export type UserRole = "user" | "admin" | "superadmin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRole;
  }
}
