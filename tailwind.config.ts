import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0d",
        surface: "#131316",
        surface2: "#1b1b20",
        surface3: "#232329",
        border: "#26262c",
        text: "#f2f2f5",
        "text-dim": "#8a8a93",
        "text-faint": "#55555e",
        accent: "#7c6cff",
        "accent-2": "#00e6a8",
        warn: "#ffb84d",
        danger: "#ff5c7a",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: { xl2: "14px" },
    },
  },
  plugins: [],
};
export default config;
