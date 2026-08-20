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
        megamart: {
          red: {
            50: "#FEF2F2",
            100: "#FEE2E2",
            200: "#FECACA",
            500: "#E31E24",
            600: "#CC181E",
            700: "#A81318",
            DEFAULT: "#E31E24",
          },
          blue: {
            50: "#EFF6FF",
            100: "#DBEAFE",
            500: "#1B4DA1",
            600: "#153E85",
            700: "#0F2C61",
            DEFAULT: "#1B4DA1",
          },
          gold: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            400: "#F5C518",
            500: "#E5A800",
            600: "#C68A00",
            DEFAULT: "#F5C518",
          },
          green: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            500: "#3A9E3A",
            600: "#2E822E",
            DEFAULT: "#3A9E3A",
          },
          cream: {
            50: "#FDFBF7",
            100: "#F7F2E7",
            200: "#EDE4D0",
            DEFAULT: "#FDFBF7",
          },
          dark: {
            DEFAULT: "#1A1A1A",
            secondary: "#404040",
            muted: "#737373",
            border: "#E5E5E5",
          }
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem", // 12px unified standard
        sm: "0.5rem",       // 8px
        md: "0.75rem",      // 12px
        lg: "1rem",         // 16px
        xl: "1.25rem",      // 20px
        "2xl": "1.5rem",    // 24px
        full: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 24px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        dropdown: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.05)",
        floating: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
