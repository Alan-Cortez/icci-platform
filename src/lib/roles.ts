import type { UserRole } from "@/types/next-auth";

export const FULL_ADMIN_ROLES: UserRole[] = ["superadmin", "admin", "pastor_general"];

export const EVENT_WRITER_ROLES: UserRole[] = [
  "superadmin",
  "admin",
  "pastor_general",
  "pastor_campus",
];

export const ADMIN_PANEL_ROLES: UserRole[] = [
  "superadmin",
  "admin",
  "pastor_general",
  "pastor_campus",
  "pastor",
  "leader",
];

export function isFullAdminRole(role: string | undefined | null): boolean {
  return Boolean(role && FULL_ADMIN_ROLES.includes(role as UserRole));
}

export function canWriteEventsRole(role: string | undefined | null): boolean {
  return Boolean(role && EVENT_WRITER_ROLES.includes(role as UserRole));
}

export function canWritePlanningRole(role: string | undefined | null): boolean {
  return Boolean(role && [...EVENT_WRITER_ROLES, "leader"].includes(role as UserRole));
}

export function canManagePreachingsUser(user: {
  role?: string | null;
  canManagePreachings?: boolean | null;
}): boolean {
  if (!user?.role) return false;
  if (isFullAdminRole(user.role) || user.role === "pastor_campus") return true;
  if (user.role === "pastor" && Boolean(user.canManagePreachings)) return true;
  return false;
}

export function getRoleLabel(role: string | undefined | null): string {
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "admin":
      return "Administrador";
    case "pastor_general":
      return "Pastor General";
    case "pastor_campus":
      return "Pastor de Campus";
    case "pastor":
      return "Pastor";
    case "leader":
      return "Líder de Ministerio";
    default:
      return "Miembro";
  }
}
