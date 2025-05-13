/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false, // <--- disables dark mode globally
    content: [
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {scrollBehavior: ['smooth'],},
    },
    plugins: [],
  }
  