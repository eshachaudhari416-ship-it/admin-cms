import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surface2: "var(--color-surface-2)",
        surface3: "var(--color-surface-3)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        "text-dim": "var(--color-text-dim)",
        "text-faint": "var(--color-text-faint)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        warn: "var(--color-warn)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: { xl2: "10px" },
    },
  },
  plugins: [],
};
export default config;