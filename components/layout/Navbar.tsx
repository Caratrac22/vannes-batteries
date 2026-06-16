// ============================================================
// VANNES BATTERIES — Navbar
// Glassmorphism on scroll, animated burger, mobile overlay
// ============================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import {
  navbarVariants,
  mobileMenuVariants,
  mobileMenuItemVariants,
} from "@/lib/animations";
import SocialLinks from "@/components/ui/SocialLinks";
import ShopStatus from "@/components/ui/ShopStatus";

const navLinks = [
  { name: "Nos Batteries", href: "/#batteries" },
  { name: "Services", href: "/services" },
  { name: "À Propos", href: "/a-propos" },
  { name: "Avis", href: "/#avis" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  };

  return (
    <motion.header
      variants={navbarVariants}
      animate={scrolled ? "scrolled" : "top"}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── Logo ────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Accueil VANNES BATTERIES">
            <motion.span
              className="w-8 h-8 shrink-0 relative"
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Image
                src="/media/LOGO 56 et miniature.jpg"
                alt="Logo Vannes Batteries"
                fill
                sizes="32px"
                className="object-contain rounded"
              />
            </motion.span>
            <span className="font-rajdhani text-lg md:text-xl tracking-tight">
              <span className="font-normal text-blue-400 group-hover:text-blue-300 transition-colors">VANNES</span>{" "}
              <span className="font-bold text-orange group-hover:text-red-400 transition-colors">BATTERIES</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium
                           text-muted hover:text-white transition-colors duration-200"
              >
                {link.name}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── CTA Phone ────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <ShopStatus compact />
            <a
              href="tel:+33297492019"
              className="btn-primary text-sm !py-2.5 !px-5"
              aria-label="Appeler VANNES BATTERIES au 02 97 49 20 19"
            >
              <Phone className="w-4 h-4" />
              02 97 49 20 19
            </a>
          </div>

          {/* ── Burger Button ────────────────────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center justify-center
                       w-12 h-12 text-white"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ── Mobile Menu ────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden
                         bg-dark-700/95 backdrop-blur-xl
                         border-t border-orange/15 rounded-b-2xl"
            >
              <div className="px-4 py-6 space-y-1">
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={mobileMenuItemVariants}>
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-xl text-base font-medium
                                 transition-colors duration-200
                                 ${
                                   isActive(link.href)
                                     ? "text-orange bg-orange/10"
                                     : "text-muted hover:text-white hover:bg-white/5"
                                 }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Phone CTA */}
                <motion.div variants={mobileMenuItemVariants} className="pt-4">
                  <a
                    href="tel:+33297492019"
                    className="btn-primary w-full text-center"
                    aria-label="Appeler VANNES BATTERIES"
                  >
                    <Phone className="w-4 h-4" />
                    02 97 49 20 19
                  </a>
                </motion.div>

                {/* Social Links */}
                <motion.div variants={mobileMenuItemVariants} className="pt-4 flex justify-center">
                  <SocialLinks />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
