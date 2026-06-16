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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <section
      ref={ref}
      className="relative h-[70vh] md:h-[85vh] lg:h-screen overflow-hidden bg-dark-950"
      aria-label="Véhicule d'exception"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src="/media/ferrari california.jpg"
          alt="Ferrari California rouge équipée par Vannes Batteries"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

    </section>
  );
}