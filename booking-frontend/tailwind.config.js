/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
      keyframes: {
        glow: {
          '0%, 100%': {
            textShadow: '0 0 5px #6366F1, 0 0 10px #6366F1, 0 0 20px #6366F1',
            color: '#6366F1',
          },
          '50%': {
            textShadow: '0 0 2px #6366F1, 0 0 4px #6366F1, 0 0 8px #6366F1',
            color: '#6366F1',
          },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
