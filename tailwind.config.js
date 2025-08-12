/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Manrope', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        display: ['Geist', 'Manrope', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        ink: {
          900: '#0b1220',
          700: '#202939',
          500: '#3b455a',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
} 