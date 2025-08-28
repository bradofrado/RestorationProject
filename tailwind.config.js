/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bom: '#F1635C',
        primary: {
          light: '#c59478',
          DEFAULT: '#ad643a',
          dark: '#894219',
        },
        secondary: {
          DEFAULT: '#faf8f2',
        },
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

module.exports = config;
