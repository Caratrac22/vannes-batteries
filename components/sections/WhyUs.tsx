// ============================================================
// VANNES BATTERIES — Why Us Section
// 4 key advantages with checkmarks
// ============================================================

"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { staggerContainerFast, fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";

const advantages = [
  {
    title: "+300 modèles en stock immédiat",
    description:
      "Pas de commande, pas d'attente. Vous repartez avec votre batterie le jour même.",
  },
  {
    title: "Pose en magasin incluse",
    description:
      "Nos techniciens installent votre batterie et vérifient le circuit de charge. Gratuit.",
  },
  {
    title: "Prix compétitifs garantis",
    description:
      "Des tarifs parmi les meilleurs du marché, sans compromis sur la qualité.",
  },
  {
    title: "Conseil d'experts",
    description:
      "Nous identifions la batterie exacte compatible avec votre véhicule. Zéro erreur possible.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-light-50 py-20 md:py-28 section-separator" aria-label="Pourquoi nous choisir">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Pourquoi Vannes Batteries ?"
          light
        />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto"
        >
          {advantages.map((adv) => (
            <motion.div key={adv.title} variants={fadeInUp} className="flex gap-4 items-start">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-orange shrink-0 mt-1" />
              <div>
                <h3 className="font-rajdhani font-bold text-dark-950 text-xl uppercase tracking-wide mb-2">
                  {adv.title}
                </h3>
                <p className="text-dark-700 text-base leading-relaxed">
                  {adv.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
