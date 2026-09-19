/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20262b",
        paper: "#f6f4ee",
        card: "#ffffff",
        line: "#e2ded2",
        primary: {
          DEFAULT: "#2f5f66",
          dark: "#22484e",
          light: "#e7eeee",
        },
        low: "#b0503b",
        moderate: "#b8873a",
        high: "#3f7a56",
        muted: "#6b6558",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(32,38,43,0.06), 0 1px 12px rgba(32,38,43,0.05)",
        glow: "0 0 0 1px rgba(47,95,102,0.15), 0 8px 30px rgba(47,95,102,0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        "fill-bar": {
          "0%": { width: "0%" },
        },
        "spin-slow": {
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3.2s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
      },
    },
  },
  plugins: [],
};
