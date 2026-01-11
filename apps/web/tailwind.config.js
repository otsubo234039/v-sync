/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand-color)", // DEFALUT ではなく DEFAULT が正解
          glow: "rgb(var(--brand-color-rgb) / 0.5)", // ThemeContextに合わせました
          dim: "rgb(var(--brand-color-rgb) / 0.1)",  // 薄い背景用に不透明度を調整
          dark: "var(--brand-dark)",
        },
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        dark: '#1F2937',
        light: '#F9FAFB',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}