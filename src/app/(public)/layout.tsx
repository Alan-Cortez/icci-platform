import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/auth";
import { getCurrentAdminUser } from "@/lib/admin-auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  let hydratedSession = session;

  // For signed-in users, read live role from DB so newly promoted
  // leaders/pastors immediately see the Admin Panel button without re-login.
  if (session?.user) {
    const adminUser = await getCurrentAdminUser();
    if (adminUser) {
      hydratedSession = {
        ...session,
        user: {
          ...session.user,
          id: adminUser.id,
          role: adminUser.role,
          ministryId: adminUser.ministryId,
          campusId: adminUser.campusId,
          canManagePreachings: adminUser.canManagePreachings,
        },
      };
    } else {
      hydratedSession = {
        ...session,
        user: {
          ...session.user,
          role: "user",
        },
      };
    }
  }

  return (
    <>
      <Header session={hydratedSession} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
