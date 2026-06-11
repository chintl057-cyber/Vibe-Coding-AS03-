/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 118, 110, 0.25)',
      },
    },
  },
  plugins: [],
};
