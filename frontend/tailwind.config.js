export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8c876",
          pale: "rgba(201,168,76,0.12)",
          50: "rgba(201,168,76,0.05)",
          100: "rgba(201,168,76,0.1)",
          200: "rgba(201,168,76,0.15)",
          300: "rgba(201,168,76,0.2)",
          600: "rgba(201,168,76,0.35)",
        },
        navy: {
          DEFAULT: "#14213d",
          mid: "#1e3160",
          light: "#2a4480",
          dark: "#0f1724",
        },
        cream: {
          DEFAULT: "#f7f4ee",
          dark: "#ede9e0",
        },
      },
      animation: {
        "in": "fadeIn 0.2s ease-in-out",
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-in-out",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.4,0,0.2,1) forwards",
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        "gold": "0 4px 20px rgba(201,168,76,0.35)",
        "gold-hover": "0 8px 30px rgba(201,168,76,0.45)",
      },
      backdropFilter: {
        glass: "blur(4px)",
      },
    },
  },
  plugins: [],
}