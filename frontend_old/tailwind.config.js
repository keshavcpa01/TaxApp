/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",   // ✅ match all your React component files
    "./public/index.html",          // ✅ optional but helpful
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
