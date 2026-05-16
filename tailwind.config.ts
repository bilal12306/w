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
        void: "#06060A",
        "void-2": "#0D0D14",
        "void-3": "#13131E",
        accent: "#5E4BF0",
        "accent-light": "#7C6BF5",
        "accent-glow": "rgba(94,75,240,0.25)",
        coral: "#FF3D6B",
        "text-primary": "#ECEAFF",
        "text-secondary": "#8B89A8",
        "text-muted": "#4A4866",
        "border-subtle": "rgba(255,255,255,0.06)",
        "border-accent": "rgba(94,75,240,0.3)",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "orb": "orbMove 12s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(94,75,240,0.3)" },
          "50%": { boxShadow: "0 0 60px rgba(94,75,240,0.6)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        orbMove: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-20px,10px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
