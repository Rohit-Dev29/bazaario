/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#12152B',
          900: '#1B1F3B',
          800: '#262B4D',
        },
        marigold: {
          400: '#F2A93B',
          500: '#E8952A',
          600: '#C97C1C',
        },
        cream: '#FAF8F4',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
