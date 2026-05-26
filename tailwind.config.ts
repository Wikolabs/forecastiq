import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Alfa Slab One'", "sans-serif"],
        body: ["'Mulish'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
