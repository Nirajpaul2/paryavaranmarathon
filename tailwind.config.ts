import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        athletic: {
          orange: "#FF5500",
          "orange-hover": "#E04B00",
          volt: "#CCFF00",
          navy: "#0A1128",
          dark: "#0F172A",
          card: "#1E293B",
          border: "#334155",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Impact", "Oswald", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
