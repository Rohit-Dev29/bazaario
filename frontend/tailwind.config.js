/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#0A1628',
          900: '#0F3460',
          800: '#16528C',
        },
        marigold: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        cream: '#F8FAFC',
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
