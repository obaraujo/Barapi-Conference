/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)'],
      }, colors: {
        'orange-barapi': "#ff4f00",
        'yellow-barapi': "#FFB904",
        'green-barapi': "#00CE52",
      },
      keyframes: {
        'bouncedelay': {
          '0%, 80%, 100%': {
            '-webkit-transform': 'scale(0)',
            transform: 'scale(0)',
          }, '40%': {
            '-webkit-transform': 'scale(1.0)',
            transform: 'scale(1.0)'
          }
        },
      }
    },
  },
  plugins: [],
}