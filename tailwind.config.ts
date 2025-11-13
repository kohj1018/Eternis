import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Pretendard", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#6366F1",
          dark: "#4F46E5",
          soft: "#EEF2FF",
          accent: "#A5B4FC",
        },
        canvas: "#050816",
        surface: "#0F172A",
        card: "#FFFFFF",
        outline: "rgba(99, 102, 241, 0.2)",
      },
      boxShadow: {
        glow: "0 25px 65px rgba(99, 102, 241, 0.35)",
        card: "0 20px 60px rgba(15, 23, 42, 0.15)",
        soft: "0 6px 24px rgba(15, 23, 42, 0.12)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.45), transparent 55%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.35), transparent 45%)",
        "grid-pattern":
          "linear-gradient(rgba(226, 232, 240, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(226, 232, 240, 0.08) 1px, transparent 1px)",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
