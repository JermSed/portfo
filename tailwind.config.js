/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // The system face already ships optical sizing, tracking tables and
        // legibility tuning; it is the default for UI text for that reason.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        // Reading text is the one place worth overriding it.
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
