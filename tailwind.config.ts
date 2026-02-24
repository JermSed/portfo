import type { Config } from "tailwindcss";

function generateScale(name: string) {
  const scale = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    return [
      [id, `var(--${name}-${id})`],
      [`a${id}`, `var(--${name}A-${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      gray: generateScale("gray"),
      accent: "#B3FC03",
    },
    fontSize: {
      sm: "0.75rem",
      base: "0.875rem",
    },
    borderRadius: {
      sm: "1px",
      md: "2px",
      "4": "4px",
      "6": "6px",
      full: "9999px",
    },
  },
};

export default config;
