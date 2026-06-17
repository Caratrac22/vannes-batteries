import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: "#DC2626", // Red-600
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        yellow: {
          DEFAULT: "#FFD700",
        },
        dark: {
          950: "#0B132B", // Deep Navy Blue
          900: "#1C2541", // Medium Navy Blue
          800: "#22305C", // Light Navy Blue
          700: "#1E293B", // Dark Slate (Footer background)
          600: "#334155",
          500: "#475569",
        },
        light: {
          50: "#F8FAFC",  // Light Slate
          100: "#F1F5F9", // Slate-100
          200: "#E2E8F0", // Slate-200
        },
        muted: "#94A3B8", // Slate-400
      },
      fontFamily: {
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
      },
      letterSpacing: {
        tight: "-0.02em",
      },
      lineHeight: {
        relaxed: "1.7",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        "orange-glow": "0 8px 30px rgba(220, 38, 38, 0.4)",
        "orange-hover": "0 0 30px rgba(220, 38, 38, 0.15)",
        "orange-cta": "0 0 40px rgba(220, 38, 38, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-y": "bounce-y 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(220, 38, 38, 0.6)",
          },
        },
        "bounce-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(1deg)" },
          "66%": { transform: "translateY(5px) rotate(-1deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(30, 64, 175, 0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
