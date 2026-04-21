/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C63FF",
          light: "#A5A6F6",
          dark: "#4B45B2",
        },
        secondary: {
          DEFAULT: "#FFB84C",
          light: "#FFD68A",
        },
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: {
          main: "#2D3748",
          muted: "#718096",
        },
        success: "#48BB78",
        error: "#F56565",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
      },
    },
  },
  plugins: [],
};
