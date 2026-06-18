"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function FerrariShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.6]);

  return (
    <section
      ref={ref}
      className="relative h-[60vh] md:h-[75vh] lg:h-[90vh] overflow-hidden bg-dark-950"
      aria-label="Véhicule d'exception"
    >
      {/* Parallax image */}
      <motion.div style={{ y, scale, opacity }} className="absolute inset-0">
        <Image
          src="/media/ferrari california.jpg"
          alt="Ferrari California rouge équipée par Vannes Batteries"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Light gradient overlay (client wanted brighter) */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/10 via-transparent to-dark-950/40" />
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent" />
    </section>
  );
}
