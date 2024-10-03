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
        brand_red: "var(--primary-red)",
        brand_gold: "var(--primary-gold)",
        brand_black: "var(--black)",
        brand_white: "var(--white)",
        brand_grey: "var(--grey)"
      },
      backgroundColor : {
        brand_red: "var(--primary-red)",
        brand_gold: "var(--primary-gold)",
        brand_black: "var(--black)",
        brand_white: "var(--white)",
        brand_grey: "var(--grey)"
      },
      boxShadow: {
        custom: '0px 1px 10px #999',
        carousel: '12px 12px 8px -4px rgba(30, 30, 30, 0.25)'
      },
      backgroundImage: {
        'default-img': "url('/radio.png')", // Default image for unselected
        'selected-img': "url('/fig.png')", // Image for selected state
      }
    },
  },
  plugins: [],
};
export default config;
