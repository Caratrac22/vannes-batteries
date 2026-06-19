import { generatePageMetadata } from "@/lib/metadata";
import Hero from "@/components/sections/Hero";
import BatteryCategories from "@/components/sections/BatteryCategories";
import FerrariShowcase from "@/components/sections/FerrariShowcase";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import WhyUs from "@/components/sections/WhyUs";
import ContactSection from "@/components/sections/ContactSection";
import LazySections from "@/components/LazySections";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

export const metadata = generatePageMetadata({
  title: "VANNES BATTERIES 02.97.49.20.19 | Vannes, France",
  description:
    "VANNES BATTERIES 02.97.49.20.19 — Batterie voiture, moto, camping-car, bateau, TP, agricole à Vannes. +300 modèles en stock. Pose en magasin et contrôle gratuit.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <FerrariShowcase />
      <Hero />
      <section className="relative bg-slate-50 py-14 md:py-20 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <YouTubeEmbed videoId="kbaoiROYaB4" />
        </div>
      </section>
      <BatteryCategories />
      <Stats />
      <Services />
      <WhyUs />
      <LazySections />
      <ContactSection />
    </>
  );
}
