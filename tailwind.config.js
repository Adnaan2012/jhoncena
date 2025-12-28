/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          dark: '#1a1a1a',
          neon: '#00ff00',
          accent: '#7c3aed',
        }
      }
    },
  },
  plugins: [],
}
