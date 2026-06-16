// ============================================================
// VANNES BATTERIES — Batteries Section
// Grid of 8 battery categories with glassmorphism cards
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeInUp, staggerContainerFast } from "@/lib/animations";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  MotorcycleIcon,
  CarIcon,
  CamperIcon,
  BoatIcon,
  TruckIcon,
  TractorIcon,
  WarningIcon,
  BatteryIcon,
} from "@/components/ui/icons";

const batteries = [
  {
    icon: MotorcycleIcon,
    title: "BATTERIE MOTO",
    description:
      "180 modèles en stock. Toutes marques et cylindrées, du scooter à la moto sportive.",
    badge: "En stock",
  },
  {
    icon: CarIcon,
    title: "BATTERIE VOITURE",
    description:
      "AGM, Gel, Start & Stop, véhicules de collection, voitures asiatiques, américaines et haut de gamme. Toutes technologies disponibles.",
    badge: "En stock",
  },
  {
    icon: CamperIcon,
    title: "CAMPING-CAR",
    description:
      "Batteries sans entretien, étanches, conformes aux normes européennes. Kits panneaux solaires en option.",
  },
  {
    icon: BoatIcon,
    title: "BATEAU / VOILIER",
    description:
      "Batteries marines à décharge lente pour voiliers et bateaux moteurs. Étanches, haute durabilité.",
  },
  {
    icon: TruckIcon,
    title: "POIDS LOURDS & TP",
    description:
      "Camions, engins de travaux publics, matériels de chantier. Batteries haute capacité.",
  },
  {
    icon: TractorIcon,
    title: "AGRICOLE",
    description:
      "Tracteurs, moissonneuses et engins agricoles. Conçues pour les conditions d'utilisation intensive.",
  },
  {
    icon: WarningIcon,
    title: "ALARME & SÉCURITÉ",
    description:
      "Batteries stationnaires pour alarmes, onduleurs, groupes électrogènes et systèmes de sécurité.",
  },
  {
    icon: BatteryIcon,
    title: "INDUSTRIEL & DIVERS",
    description:
      "Golfettes, chariots élévateurs, auto-laveuses, jouets, parcs solaires et sites isolés.",
  },
];

export default function Batteries() {
  return (
    <section
      id="batteries"
      className="relative bg-light-50 py-20 md:py-28"
      aria-label="Nos batteries"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Notre gamme complète"
          badgeIcon={BatteryIcon}
          title="Toutes vos batteries, un seul spécialiste"
          subtitle="Du scooter au poids lourd, de la voiture de collection au bateau, nous avons votre batterie."
          light
        />

        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        >
          {batteries.map((battery) => (
            <motion.div
              key={battery.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.04, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-white rounded-xl border border-gray-100
                         p-6 shadow-sm hover:shadow-xl hover:border-orange/30
                         transition-shadow duration-300"
            >
              {/* Icon */}
              <motion.div
                className="w-9 h-9 mb-4"
                whileHover={{ rotate: 5, scale: 1.15 }}
              >
                <battery.icon className="w-full h-full" />
              </motion.div>

              {/* Title */}
              <h3 className="font-rajdhani font-bold text-dark-950 text-lg uppercase tracking-wide mb-2">
                {battery.title}
              </h3>

              {/* Description */}
              <p className="text-dark-700 text-sm leading-relaxed">
                {battery.description}
              </p>

              {/* Badge */}
              {battery.badge && (
                <span
                  className="inline-flex items-center gap-1 mt-3 px-3 py-1 text-xs font-semibold
                             text-green-700 bg-green-50 border border-green-200
                             rounded-full"
                >
                  <Check className="w-3 h-3" />
                  {battery.badge}
                </span>
              )}

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                           transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(220,38,38,0.05) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
