/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#17352A",
          50: "#E9F0EC",
          100: "#C9DAD0",
          600: "#1F4A38",
          700: "#17352A",
          900: "#0D211A",
        },
        moss: {
          DEFAULT: "#3B7D53",
          400: "#5B9C70",
          500: "#3B7D53",
          600: "#2E6442",
        },
        leaf: {
          DEFAULT: "#8FC29B",
          100: "#E4F1E6",
          300: "#B7DCC0",
        },
        sand: {
          DEFAULT: "#F3EBDA",
          50: "#FAF6EE",
          100: "#F3EBDA",
          200: "#E9DBC0",
        },
        clay: {
          DEFAULT: "#C9A97E",
          100: "#E4D3B8",
          400: "#C9A97E",
          600: "#A9834F",
        },
        ink: "#1D2119",
        rust: {
          DEFAULT: "#AE4E2E",
          100: "#F3DCD2",
        },
        amber: {
          DEFAULT: "#B9840F",
          100: "#F6E9C9",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(23, 53, 42, 0.18)",
        card: "0 2px 12px -4px rgba(23, 53, 42, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
