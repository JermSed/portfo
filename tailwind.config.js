/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'ui-serif', 'serif'],
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'ui-serif', 'serif'],
      },
      colors: {
        ink: {
          900: '#0b1220',
          700: '#202939',
          500: '#3b455a',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
} 