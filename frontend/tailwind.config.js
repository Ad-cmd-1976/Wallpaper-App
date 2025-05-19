/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto':'repeat(auto-fill,minmax(450px,1fr))'
      }
    },
  },
  plugins: [],
}