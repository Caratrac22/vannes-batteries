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
          DEFAULT: "#DC2626",
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
        blue: {
          DEFAULT: "#1E40AF",
          50: "#EFF6FF",
          100: "#DBEAFE",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A5F",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        yellow: {
          DEFAULT: "#FFD700",
        },
        dark: {
          950: "#0B132B",
          925: "#111D42",
          900: "#1C2541",
          800: "#22305C",
          700: "#1E293B",
          600: "#334155",
        },
        muted: "#64748B",
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
        "orange-glow": "0 4px 15px rgba(220, 38, 38, 0.2)",
        "orange-hover": "0 0 20px rgba(220, 38, 38, 0.1)",
        "orange-cta": "0 0 25px rgba(220, 38, 38, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "bounce-y": "bounce-y 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
        "neon-pulse": "neon-pulse 4s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(220, 38, 38, 0.15)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.25)",
          },
        },
        "bounce-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-5px) rotate(0.5deg)" },
          "66%": { transform: "translateY(3px) rotate(-0.5deg)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "neon-pulse": {
          "0%, 100%": { textShadow: "0 0 3px rgba(0,210,255,0.3), 0 0 6px rgba(0,210,255,0.15)" },
          "50%": { textShadow: "0 0 5px rgba(0,210,255,0.4), 0 0 10px rgba(0,210,255,0.2)" },
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
