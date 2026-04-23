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
        primary: "#fdf8f3",
        accent: "#f59e0b",
        secondary: "#0d9488",
        surface: "#fef3e2",
        textPrimary: "#1c1917",
        textMuted: "#78716c",
        success: "#10b981",
        error: "#ef4444"
      },
    },
  },
  plugins: [],
};
