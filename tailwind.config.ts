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
        eco: {
          green: "#16a34a",
          "green-hover": "#15803d",
          light: "#22c55e",
          lime: "#84cc16",
          gold: "#eab308",
          dark: "#051a11",
          card: "#0a261a",
          surface: "#0f3323",
          border: "#1b4d36",
          muted: "#86efac",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
