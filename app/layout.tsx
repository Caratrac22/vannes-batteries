// ============================================================
// VANNES BATTERIES — Root Layout
// Fonts, GTM, JSON-LD, global meta, Google Site Verification
// ============================================================

import type { Metadata } from "next";
import { Inter, Rajdhani, Bebas_Neue } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import { localBusinessSchema } from "@/lib/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import "./globals.css";

// ── Fonts ────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rajdhani",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

// ── Global Metadata ──────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://www.vannes-batteries.fr"),
  title: {
    default:
      "VANNES BATTERIES 02.97.49.20.19 | vannes | Vannes, France",
    template: "%s",
  },
  description:
    "VANNES BATTERIES 02.97.49.20.19 — Vannes, France. Spécialiste batterie, batterie moto, batterie voiture, batterie camping car, batterie TP agricole, batterie bateau, batterie alarme, batterie golfette.",
  verification: {
    google: "bDSWZlnB7Y6jJvWG0OxxI5Ff55yozynkOUUW7LFZXeI",
  },
  icons: {
    icon: [
      { url: "/favicon.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/favicon.jpg", sizes: "32x32", type: "image/jpeg" },
    ],
    apple: { url: "/favicon.jpg", sizes: "180x180", type: "image/jpeg" },
  },
  openGraph: {
    siteName: "VANNES BATTERIES",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "VANNES BATTERIES — Professionnel de la batterie à Vannes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image"],
  },
  other: {
    "fb:admins": "vannes.batteries",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// ── Root Layout ──────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${rajdhani.variable} ${bebasNeue.variable}`}
    >
      <head>
        {/* JSON-LD LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="font-inter bg-dark-950 text-white antialiased">
        <GoogleTagManager gtmId="GTM-T9QDSJSL" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-orange focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Aller au contenu principal
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
