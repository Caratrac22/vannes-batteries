// ============================================================
// VANNES BATTERIES — Services Section
// Reused on both Home and /services page
// ============================================================

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MessageCircleHeart, ShoppingCart, Wrench, SearchCheck, Recycle, Building2, MapPin } from "lucide-react";
import { staggerContainerFast, fadeInLeft, fadeInRight, fadeInUp } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import { WrenchIcon } from "@/components/ui/icons";

const services = [
  {
    icon: MessageCircleHeart,
    title: "CONSEIL PERSONNALISÉ",
    description:
      "Notre équipe analyse votre besoin et vous guide vers la batterie exactement adaptée à votre véhicule et usage. Batteries spécialisées disponibles pour tous usages : industriels, marines, agricoles ou autres.",
  },
  {
    icon: ShoppingCart,
    title: "VENTE +300 MODÈLES",
    description:
      "Un stock exceptionnel de plus de 300 références toutes technologies. Qualité garantie, performances fiables et durables. Vous repartez équipé le jour même.",
  },
  {
    icon: Wrench,
    title: "POSE EN MAGASIN",
    description:
      "Installation de votre nouvelle batterie dans notre atelier. Notre équipe qualifiée s'occupe de tout, vous offrant un service complet et pratique.",
    photo: "/media/pose batterie .2.jpg",
  },
  {
    icon: SearchCheck,
    title: "CONTRÔLE GRATUIT",
    description:
      "À chaque visite, nous contrôlons gratuitement votre circuit de charge et de démarrage.",
  },
  {
    icon: Recycle,
    title: "RECYCLAGE RESPONSABLE",
    description:
      "Reprise et recyclage de toutes vos batteries usagées dans une démarche de préservation de l'environnement.",
  },
  {
    icon: Building2,
    title: "SERVICE PROFESSIONNEL",
    description:
      "Devis, conseil technique et accompagnement personnalisé pour les professionnels. Contactez-nous pour vos besoins spécifiques.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-dark-900 py-20 md:py-28 relative overflow-hidden" aria-label="Nos services">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          badge="Nos expertises"
          badgeIcon={WrenchIcon}
          title="QUEL BESOIN DE BATTERIE AVEZ-VOUS ?"
          subtitle="Tout se fait exclusivement en magasin. Venez nous voir Zone de Kerniol, Vannes."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="info-banner max-w-3xl mx-auto mb-16"
        >
          <MapPin className="w-4 h-4 inline-block -mt-0.5 text-orange" /> <strong className="text-orange">Tous nos services sont réalisés exclusivement en magasin</strong>
          <br className="hidden sm:block" />
          19 rue Denis Papin, Z.A. de Kerniol — 56000 Vannes
        </motion.div>

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const hasPhoto = "photo" in service;

            if (hasPhoto) {
              return (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className="relative col-span-1 md:col-span-2 lg:col-span-2 row-span-1 rounded-2xl overflow-hidden group min-h-[300px]"
                >
                  <Image
                    src={service.photo!}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/60 to-transparent" />
                  <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-end">
                    <div className="w-14 h-14 mb-4 flex items-center justify-center rounded-xl bg-orange/20 border border-orange/30 backdrop-blur-sm">
                      <Icon className="w-7 h-7 text-orange" />
                    </div>
                    <h3 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase tracking-wide mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            }

            // Alternating animation based on index
            const isEven = index % 2 === 0;
            const variant = isEven ? fadeInLeft : fadeInRight;

            return (
              <motion.div
                key={service.title}
                variants={variant}
                className="glass-card p-8 group"
              >
                <div className="relative w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-dark-700 border border-orange/20 overflow-hidden">
                  {/* Pulse background on hover */}
                  <div className="absolute inset-0 bg-orange/20 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out rounded-full" />
                  <Icon className="w-7 h-7 text-orange relative z-10 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="font-rajdhani font-bold text-xl uppercase tracking-wide mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
