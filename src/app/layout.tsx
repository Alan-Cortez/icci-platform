import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ChurchJsonLd } from "@/components/seo/JsonLd";
import { getBaseUrl } from "@/lib/constants";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "ICCI | Iglesia Comunidad De Cristo Internacional | Sitio Oficial",
    template: "%s | ICCI – Iglesia Comunidad De Cristo Internacional",
  },
  description:
    "Sitio oficial de ICCI (Iglesias Comunidad De Cristo Internacional / ICC / ICCInt). Sede Central en Allende, Coahuila y campus en Sabinas, Múzquiz, Barroterán, Anáhuac y Durango. Servicios presenciales y transmisiones en vivo.",
  keywords: [
    "icci",
    "icc",
    "iccint",
    "iglesia comunidad de cristo",
    "iglesias comunidad de cristo",
    "iglesias comunidad de cristo internacional",
    "comunidad de cristo allende",
    "iglesia cristiana allende",
    "iglesia cristiana en allende coahuila",
    "apostol oscar sosa",
    "pastor oscar sosa",
    "ministerio de restauracion",
    "icci allende",
    "iglesias en allende",
    "iglesias en sabinas",
    "iglesias en muzquiz",
    "somos uno uno somos",
  ],
  authors: [{ name: "Iglesia Comunidad De Cristo Internacional" }],
  creator: "ICCI",
  publisher: "ICCI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Iglesia Comunidad De Cristo Internacional | ICCI Oficial",
    description:
      "Somos uno, uno somos. Conoce la Iglesia Comunidad De Cristo Internacional (ICCI / ICCInt) en Allende, Coahuila y campus en el norte de México.",
    url: "https://www.iglesiascomunidaddecristoint.com",
    siteName: "ICCI – Iglesia Comunidad De Cristo Internacional",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Iglesia Comunidad De Cristo Internacional - ICCI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iglesia Comunidad De Cristo Internacional | ICCI",
    description: "Somos uno, uno somos. Sitio oficial de la Iglesia Comunidad De Cristo Internacional (ICCI / ICCInt).",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googled4f0374d4dc7b94f.html",
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
