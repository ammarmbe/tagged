import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-mode="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          950: "var(--color-text-950)",
          600: "var(--color-text-600)",
          400: "var(--color-text-400)",
          300: "var(--color-text-300)",
          0: "var(--color-text-0)",
        },
        bg: {
          950: "var(--color-bg-950)",
          800: "var(--color-bg-800)",
          300: "var(--color-bg-300)",
          200: "var(--color-bg-300)",
          50: "var(--color-bg-50)",
          0: "var(--color-bg-0)",
        },
        border: {
          950: "var(--color-border-950)",
          300: "var(--color-border-300)",
          200: "var(--color-border-200)",
          0: "var(--color-border-0)",
        },
        main: {
          dark: "var(--color-main-dark)",
          base: "var(--color-main-base)",
          light: "var(--color-main-light)",
          lighter: "var(--color-main-lighter)",
        },
        success: "#38C793",
        warning: "#F17B2B",
        error: "#DF1C41",
        information: "#375DFB",
      },
    },
    boxShadow: {
      none: "none",
      xs: "0px 1px 2px 0px #E4E5E73D",
      sm: "0px 2px 4px 0px #1B1C1D0A",
      md: "0px 16px 32px -12px #585C5F1A",
      lg: "0px 16px 40px -8px #585C5F29",
      xl: "0px 24px 56px -4px #585C5F29",
      xxl: "0px 40px 96px -8px #585C5F33",
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
