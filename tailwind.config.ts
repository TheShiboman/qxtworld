import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "#041d21", // Dark Teal base
        foreground: "#ffffff",
        card: {
          DEFAULT: "#051e23", // Dark Slate Teal
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#051e23",
          foreground: "#ffffff",
        },
        primary: {
          DEFAULT: "#041c20", // Dark Cyan-Teal
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#062128", // Deep Navy Teal
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#051d21", // Accent Teal
          foreground: "#a1a1aa",
        },
        accent: {
          DEFAULT: "#062128", // Deep Navy Teal
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "#051d21", // Accent Teal
        input: "#051d21",
        ring: "#041c20",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "#062128", // Deep Navy Teal
          foreground: "#ffffff",
          primary: "#041c20",
          "primary-foreground": "#ffffff",
          accent: "#051e23",
          "accent-foreground": "#ffffff",
          border: "#051d21",
          ring: "#041c20",
        },
      },
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
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;