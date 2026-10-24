import type { Metadata } from "next";
import { Inter, Bebas_Neue, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ChurchJsonLd } from "@/components/seo/JsonLd";

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
  metadataBase: new URL(process.env.AUTH_URL || "https://www.iglesiascomunidaddecristoint.com"),
  title: {
    default: "ICCI | Iglesias Comunidad De Cristo Internacional",
    template: "%s | ICCI",
  },
  description:
    "Plataforma oficial de Iglesias Comunidad De Cristo Internacional. Campus en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango.",
  keywords: ["iglesia", "ICCI", "Comunidad De Cristo", "Allende", "Coahuila", "cristiano"],
  openGraph: {
    title: "ICCI | Iglesias Comunidad De Cristo Internacional",
    description:
      "Somos uno, uno somos. Plataforma oficial de Iglesias Comunidad De Cristo Internacional. Campus en Allende, Sabinas, Múzquiz, Barroterán, Anáhuac y Durango.",
    url: "https://www.iglesiascomunidaddecristoint.com",
    siteName: "ICCI",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ICCI | Iglesias Comunidad De Cristo Internacional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICCI | Iglesias Comunidad De Cristo Internacional",
    description: "Somos uno, uno somos",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable} ${cormorant.variable} h-full`}>
      <head>
        <ChurchJsonLd />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
