// ============================================================
// VANNES BATTERIES — Home Page
// ============================================================

import dynamic from "next/dynamic";
import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import BatteryCategories from "@/components/sections/BatteryCategories";
import FerrariShowcase from "@/components/sections/FerrariShowcase";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import ContactSection from "@/components/sections/ContactSection";

const Reviews = dynamic(() => import("@/components/sections/Reviews"), { ssr: false });
const MapSection = dynamic(() => import("@/components/sections/MapSection"), { ssr: false });

export const metadata = generatePageMetadata({
  title: "VANNES BATTERIES 02.97.49.20.19 | Vannes, France",
  description:
    "VANNES BATTERIES 02.97.49.20.19 — Batterie voiture, moto, camping-car, bateau, TP, agricole à Vannes. +300 modèles en stock. Pose en magasin et contrôle gratuit.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <BatteryCategories />
      <FerrariShowcase />
      <Stats />
      <Services />
      <WhyUs />
      <Reviews />
      <MapSection />
      <ContactSection />
    </>
  );
}
