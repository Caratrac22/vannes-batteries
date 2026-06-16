// ============================================================
// VANNES BATTERIES — Services Page (/services)
// ============================================================

import { generatePageMetadata } from "@/lib/metadata";
import ServicesSection from "@/components/sections/Services";
import ContactSection from "@/components/sections/ContactSection";
import { Phone } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "SERVICES | VANNES BATTERIES",
  description:
    "L'entreprise Vannes Batteries propose le conseil, la vente et l'installation de batteries.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      {/* ── Page Header ───────────────────────────────────── */}
      <section className="bg-dark-950 pt-32 pb-16 relative overflow-hidden">
        <div className="gradient-overlay absolute inset-0 opacity-50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-rajdhani font-bold uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl text-white mb-6">
            NOS SERVICES
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-3xl mx-auto">
            VANNES BATTERIES est là pour répondre à tous vos besoins en batteries.
            Que ce soit pour vos voitures, camping-cars, motos, bateaux, engins TP,
            poids lourds, alarmes, véhicules agricoles, golfettes, chariots
            élévateurs, auto laveuses, nous avons la solution de batterie qu'il
            vous faut.
          </p>
        </div>
      </section>

      {/* ── Services Component ────────────────────────────── */}
      <ServicesSection />

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="bg-orange py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-rajdhani font-bold text-3xl uppercase tracking-wide text-white mb-6">
            Venez nous voir en magasin
          </h2>
          <a
            href="tel:+33297492019"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange font-rajdhani font-bold uppercase tracking-wider rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            <Phone className="w-5 h-5" />
            02 97 49 20 19
          </a>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
