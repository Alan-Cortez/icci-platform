import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <Header session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
