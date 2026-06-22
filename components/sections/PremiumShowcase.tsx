"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import {
  staggerContainerFast,
  fadeInUp,
  scaleIn,
} from "@/lib/animations";

const showcaseVehicles = [
  {
    src: "/media/ferrari-california.jpg",
    alt: "Voiture rouge équipée en atelier",
  },
  {
    src: "/media/Porsche 997.jpg",
    alt: "Voiture allemande en préparation",
  },
  {
    src: "/media/corvette c7.jfif",
    alt: "Voiture américaine en atelier",
  },
];

export default function PremiumShowcase() {
  return (
    <section className="relative bg-dark-950 py-20 md:py-28 overflow-hidden" aria-label="Nos réalisations">
      <div className="gradient-overlay absolute inset-0 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.span
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-orange bg-orange/10 border border-orange/30 rounded-full"
          >
            <Star className="w-3.5 h-3.5" />
            Nos réalisations
          </motion.span>
          <h2 className="font-rajdhani font-bold uppercase tracking-tight text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            ÉQUIPEMENT DE VÉHICULES
            <br />
            <span className="text-gradient-orange">VOITURES</span>
          </h2>
        </motion.div>

        {/* Grid — 3 véhicules */}
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {showcaseVehicles.map((vehicle, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative bg-dark-800/80 backdrop-blur-sm rounded-xl border border-white/5 hover:border-orange/30 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={vehicle.src}
                  alt={vehicle.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="/a-propos"
            className="btn-primary inline-flex items-center gap-2"
          >
            Voir toutes nos réalisations
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
