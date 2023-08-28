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
        showPopup: {
          "0%": {
            transform: "translateY(100%)"
          }, "100%": { transform: "translateY(0)" }
        },
        hidePopup: {
          "0%": {
            transform: "translateY(0)"
          }, "100%": {
            transform: "translateY(100%)"
          }
        },
        'bouncedelay': {
          '0%, 80%, 100%': {
            '-webkit-transform': 'scale(0)',
            transform: 'scale(0)',
          }, '40%': {
            '-webkit-transform': 'scale(1.0)',
            transform: 'scale(1.0)'
          }
        },
      }, animation: {
        "showpopup": "0.3s cubic-bezier(0, 0.46, 0.58, 1) showPopup",
        "hidepopup": "0.3s cubic-bezier(0, 0.46, 0.58, 1) hidePopup"
      }
    },
  },
  plugins: [],
}