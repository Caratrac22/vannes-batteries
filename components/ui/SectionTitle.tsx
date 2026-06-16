// ============================================================
// VANNES BATTERIES — SectionTitle component
// Reusable heading with badge, title, and subtitle
// ============================================================

"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";

interface SectionTitleProps {
  badge?: string;
  badgeIcon?: React.ElementType;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}

export default function SectionTitle({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`${alignClass} mb-12 md:mb-16`}>
      {badge && (
        <motion.span
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold
                     uppercase tracking-wider text-orange
                     bg-orange/10 border border-orange/30 rounded-full"
        >
          {badgeIcon && React.createElement(badgeIcon, { className: "w-4 h-4" })}
          {badge}
        </motion.span>
      )}
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className={`font-rajdhani font-bold uppercase tracking-tight
                   text-3xl md:text-4xl lg:text-5xl
                   ${light ? "text-dark-950" : "text-white"}`}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className={`mt-4 text-base md:text-lg max-w-2xl
                     ${align === "center" ? "mx-auto" : ""}
                     ${light ? "text-dark-700" : "text-muted"}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
