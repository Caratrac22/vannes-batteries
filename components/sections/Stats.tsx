// ============================================================
// VANNES BATTERIES — Stats Section
// Orange banner with 4 animated counters
// ============================================================

"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { flipIn, staggerContainer } from "@/lib/animations";
import { useI18n } from "@/lib/i18n/context";

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
}

function Counter({ value, suffix = "", label, sublabel }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: 2,
        ease: [0.25, 0.1, 0.25, 1],
      });
    }
  }, [isInView, motionValue, value]);

  return (
    <motion.div
      ref={ref}
      variants={flipIn}
      className="text-center px-4 py-2"
      style={{ perspective: 1000 }}
    >
      <div className="flex items-baseline justify-center gap-1">
        <motion.span className="font-bebas text-5xl sm:text-6xl md:text-7xl text-white">
          {rounded}
        </motion.span>
        {suffix && (
          <span className="font-bebas text-3xl sm:text-4xl md:text-5xl text-white/80">
            {suffix}
          </span>
        )}
      </div>
      <p className="font-rajdhani font-semibold text-sm sm:text-base uppercase tracking-wider text-white mt-1">
        {label}
      </p>
      <p className="text-white/60 text-xs sm:text-sm">{sublabel}</p>
    </motion.div>
  );
}

export default function Stats() {
  const { t } = useI18n();

  const stats = [
    { value: 300, suffix: "+", label: t.stats.stock.label, sublabel: t.stats.stock.sub },
    { value: 180, suffix: "", label: t.stats.moto.label, sublabel: t.stats.moto.sub },
    { value: 95, suffix: "%", label: t.stats.reviews.label, sublabel: t.stats.reviews.sub },
    { value: 0, suffix: "", label: t.stats.wait.label, sublabel: t.stats.wait.sub },
  ];

  return (
    <section
      id="stats"
      className="relative bg-gradient-to-r from-orange-700 via-orange to-orange-600
                 py-12 md:py-16 overflow-hidden"
      aria-label="Chiffres clés"
    >
      {/* Decorative bg pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 25%,
              rgba(255,255,255,0.1) 25%,
              rgba(255,255,255,0.1) 25.5%
            )`,
          }}
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6
                   grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0
                   md:divide-x md:divide-white/20"
      >
        {stats.map((stat) => (
          <Counter key={stat.label} {...stat} />
        ))}
      </motion.div>
    </section>
  );
}
