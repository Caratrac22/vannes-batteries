// ============================================================
// VANNES BATTERIES — Framer Motion animation variants
// All animations respect prefers-reduced-motion via the hook
// ============================================================

import type { Variants, Transition } from "framer-motion";

// ── Shared spring config ─────────────────────────────────────
export const springTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
};

export const smoothTransition: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

// ── Fade in up ───────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

// ── Fade in down ─────────────────────────────────────────────
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

// ── Fade in left ─────────────────────────────────────────────
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// ── Fade in right ────────────────────────────────────────────
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

// ── Scale in (badge bounce) ──────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  show: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

// ── Flip card (stats) ────────────────────────────────────────
export const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: 90 },
  show: {
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// ── Stagger container ────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// ── Clip path reveal (hero title) ────────────────────────────
export const clipReveal: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
  },
  show: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.2,
    },
  },
};

// ── Navbar scroll transform ──────────────────────────────────
export const navbarVariants: Variants = {
  top: {
    backgroundColor: "rgba(8, 8, 16, 0)",
    backdropFilter: "blur(0px)",
    borderBottom: "1px solid rgba(220, 38, 38, 0)",
  },
  scrolled: {
    backgroundColor: "rgba(28, 28, 46, 0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(220, 38, 38, 0.15)",
  },
};

// ── Mobile menu ──────────────────────────────────────────────
export const mobileMenuVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const mobileMenuItemVariants: Variants = {
  closed: { opacity: 0, x: -20 },
  open: { opacity: 1, x: 0 },
};

// ── Scroll to top button ─────────────────────────────────────
export const scrollToTopVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
    rotate: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 360,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
};
