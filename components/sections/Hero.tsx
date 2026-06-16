// ============================================================
// VANNES BATTERIES — Hero Section
// Focus on batteries, not years of experience
// ============================================================

"use client";

import { motion } from "framer-motion";
import { Zap, ChevronDown, MapPin, Clock } from "lucide-react";
import {
  clipReveal,
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/lib/animations";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center
                 bg-dark-950 overflow-hidden pt-20"
      aria-label="Section héro"
    >
      {/* ── Gradient overlay ──────────────────────────────── */}
      <div className="gradient-overlay absolute inset-0" />

      {/* ── Lightning particles (CSS only) ────────────────── */}
      <div className="lightning-bg" />

      {/* ── Content ───────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={scaleIn} className="mb-8">
          <span
            className="inline-flex items-center gap-2 px-5 py-2
                       text-xs sm:text-sm font-semibold uppercase tracking-wider
                       text-orange bg-orange/10 border border-orange/30
                       rounded-full"
          >
            <Zap className="w-4 h-4" />
            +300 modèles en stock — pose incluse
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={clipReveal}
          className="font-rajdhani font-bold uppercase tracking-tight
                     text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                     text-white leading-[0.95] mb-6"
        >
          LA BATTERIE
          <br />
          <span className="text-gradient-orange">QU&apos;IL VOUS FAUT</span>
        </motion.h1>

        {/* Accroche */}
        <motion.p
          variants={fadeInUp}
          className="text-muted text-base sm:text-lg md:text-xl
                     max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Voiture, moto, camping-car, bateau, poids lourd, agricole.
          <br className="hidden sm:block" />
          Trouvez votre batterie parmi +300 références. Pose en magasin et contrôle offert.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <a
            href="tel:+33297492019"
            className="btn-primary animate-pulse-glow text-base"
            aria-label="Appeler VANNES BATTERIES au 02 97 49 20 19"
          >
            <Zap className="w-5 h-5" />
            Appeler — 02 97 49 20 19
          </a>
          <a href="#categories" className="btn-secondary text-base">
            Voir nos batteries
          </a>
        </motion.div>

        {/* Infos rapides */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center
                     gap-4 sm:gap-8 text-sm text-muted"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange" />
            <span>Z.A. de Kerniol, Vannes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange" />
            <span>Lun–Ven 8h30–18h30 · Sam 9h–12h</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#categories" aria-label="Défiler vers le bas">
          <ChevronDown className="w-6 h-6 text-muted animate-bounce-y" />
        </a>
      </motion.div>
    </section>
  );
}
