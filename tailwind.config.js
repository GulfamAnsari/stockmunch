/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0b0f1a',
      },
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}