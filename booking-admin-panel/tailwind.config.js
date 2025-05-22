/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media", 
    content: [
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {scrollBehavior: ['smooth'],},
    },
    plugins: [],
  }
  