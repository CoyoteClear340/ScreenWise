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
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
