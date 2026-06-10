import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium emerald + gold palette.
        // Token names are kept (blue/orange) so existing classes re-skin cleanly.
        brand: {
          blue: "#1C6B53", // primary emerald
          "blue-dark": "#14513F",
          "blue-deep": "#0B2C22", // deepest forest — headings & dark sections
          orange: "#C5A253", // gold accent
          "orange-dark": "#A8853A",
        },
        ink: "#0A211A", // near-black green — header / footer / hero base
        paper: "#F5F1E8", // warm ivory
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 28px rgba(11, 44, 34, 0.10)",
        lift: "0 18px 48px rgba(11, 44, 34, 0.20)",
      },
      letterSpacing: {
        luxe: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
