/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          950: '#172554',
          900: '#2874F0',
          800: '#1E5DC7',
        },
        marigold: {
          400: '#FF9F00',
          500: '#FB641B',
          600: '#E85D0F',
        },
        cream: '#F1F3F6',
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
