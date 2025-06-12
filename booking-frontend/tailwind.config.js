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

    theme: {
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s infinite',
      },
    },
  },
  }
  