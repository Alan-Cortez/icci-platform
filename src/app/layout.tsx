import type { Metadata } from "next";
import { Inter, Bebas_Neue, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* ── Body / UI font ─────────────────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* ── Display / Hero headlines ───────────────────────── */
const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",          // Bebas Neue is single-weight (very bold condensed)
  subsets: ["latin"],
  display: "swap",
});

/* ── Elegant serif sub-headings ─────────────────────── */
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ICCI | Iglesias Comunidad De Cristo Internacional",
    template: "%s | ICCI",
  },
  description:
    "Plataforma oficial de Iglesias Comunidad De Cristo Internacional. Campus en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango.",
  keywords: ["iglesia", "ICCI", "Comunidad De Cristo", "Allende", "Coahuila", "cristiano"],
  openGraph: {
    title: "ICCI | Iglesias Comunidad De Cristo Internacional",
    description: "Una familia de fe, esperanza y amor",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
