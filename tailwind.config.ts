import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        text: {
          900: "#0A0D14",
          500: "#525866",
          400: "#868C98",
          300: "#CDD0D5",
        },
        bg: {
          900: "#0A0D14",
          700: "#20232D",
          200: "#E2E4E9",
          100: "#F6F8FA",
        },
        border: {
          900: "#0A0D14",
          300: "#CDD0D5",
          200: "#E2E4E9",
          100: "#F6F8FA",
        },
        icon: {
          900: "#0A0D14",
          500: "#525866",
          400: "#868C98",
          300: "#CDD0D5",
        },
        main: {
          darker: "#2B1664",
          dark: "#5A36BF",
          base: "#6E3FF3",
          light: "#CAC2FF",
          lighter: "#EEEBFF",
        },
        success: "#38C793",
        warning: "#F17B2B",
        error: "#DF1C41",
        information: "#6E3FF3",
        neutral: "#868C98",
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
