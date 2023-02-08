/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: [
    'src/**/*.{js,jsx,ts,tsx}',
    '../node_modules/react-tailwindcss-datepicker/dist/index.esm.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': colors.teal[600],
        primary: colors.teal[700],
        'primary-dark': colors.teal[900],
        'secondary-light': colors.stone[200],
        secondary: colors.stone[600],
        'secondary-dark': colors.stone[800],
        'error-light': colors.red[100],
        error: colors.red[600],
        'warning-light': colors.amber[200],
        warning: colors.amber[600],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
