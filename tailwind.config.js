/** @type {import('tailwindcss').Config} */
module.exports = {
  // Вкажи шляхи до всіх своїх файлів
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C63FF", // Основний фіолетовий (довіра, навчання)
          light: "#A5A6F6",
          dark: "#4B45B2",
        },
        secondary: {
          DEFAULT: "#FFB84C", // Помаранчевий (акцент, гра, мотивація)
          light: "#FFD68A",
        },
        background: "#F8F9FA", // Світло-сірий фон (не ріже очі як чистий білий)
        surface: "#FFFFFF", // Колір карток
        text: {
          main: "#2D3748", // Темно-сірий для основного тексту
          muted: "#718096", // Для підписів
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
