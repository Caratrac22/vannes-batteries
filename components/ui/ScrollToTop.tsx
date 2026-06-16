// ============================================================
// VANNES BATTERIES — ScrollToTop button
// Animated appearance after 400px scroll
// ============================================================

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { scrollToTopVariants } from "@/lib/animations";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={scrollToTopVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={scrollToTop}
          aria-label="Retour en haut de la page"
          className="fixed bottom-6 right-6 z-50
                     w-12 h-12 flex items-center justify-center
                     bg-orange text-white rounded-full
                     shadow-orange-glow hover:bg-orange-600
                     transition-colors duration-300"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
