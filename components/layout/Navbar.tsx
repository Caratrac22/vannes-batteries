// ============================================================
// VANNES BATTERIES — Navbar
// Glassmorphism on scroll, animated burger, mobile overlay
// ============================================================

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Phone, Menu, X, Globe } from "lucide-react";
import {
  navbarVariants,
  mobileMenuVariants,
  mobileMenuItemVariants,
} from "@/lib/animations";
import SocialLinks from "@/components/ui/SocialLinks";
import ShopStatus from "@/components/ui/ShopStatus";
import { useI18n } from "@/lib/i18n/context";

const navLinks = [
  { name: "Nos Batteries", href: "/#batteries", key: "nav.batteries" },
  { name: "Services", href: "/services", key: "nav.services" },
  { name: "À Propos", href: "/a-propos", key: "nav.about" },
  { name: "Contact", href: "/contact", key: "nav.contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { t, locale, toggleLocale } = useI18n();

  const translatedLinks = [
    { name: t.nav.batteries || "Nos Batteries", href: "/#batteries" },
    { name: t.nav.services, href: "/services" },
    { name: t.nav.about, href: "/a-propos" },
    { name: t.nav.contact, href: "/contact" },
  ];

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
        className="px-1 sm:px-1.5 lg:px-2"
        aria-label="Navigation principale"
      >
        <div className="flex items-center justify-between h-18 md:h-22">
          {/* ── Logo ────────────────────────────────────── */}
          <Link href="/" className="flex items-center group" aria-label="Accueil VANNES BATTERIES">
            <span className="font-rajdhani font-bold text-3xl md:text-4xl lg:text-5xl tracking-wider italic whitespace-nowrap text-white drop-shadow-[0_0_4px_rgba(0,210,255,0.4)] transition-all duration-300">
              VANNES BATTERIES
            </span>
          </Link>

          {/* ── Desktop Nav Links ────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1">
            {translatedLinks.map((link) => (
              <Link
                key={link.href}
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

          {/* ── CTA Phone + Lang ──────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <ShopStatus compact />
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full
                         text-[11px] font-bold uppercase tracking-wider
                         text-white/60 bg-white/5 border border-white/10
                         hover:text-white hover:bg-white/10 transition-all"
              aria-label={`Switch to ${locale === "fr" ? "English" : "Français"}`}
            >
              <Globe className="w-3 h-3" />
              {locale === "fr" ? "EN" : "FR"}
            </button>
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
            aria-label={isOpen ? t.nav.menuClose : t.nav.menuOpen}
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
                {translatedLinks.map((link) => (
                  <motion.div key={link.href} variants={mobileMenuItemVariants}>
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

                {/* Language Switcher */}
                <motion.div variants={mobileMenuItemVariants} className="pt-2 flex justify-center">
                  <button
                    onClick={toggleLocale}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl
                               text-sm font-semibold text-white/60 bg-white/5
                               border border-white/10 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    {locale === "fr" ? "English" : "Français"}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
