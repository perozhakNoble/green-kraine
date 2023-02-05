/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['src/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary_light: '#e6f3f9',
        primary: colors.sky[600],
        primary_dark: colors.sky[700],
        dark_blue: colors.sky[800],
        light_green: '#02C7BB',
        secondary_light: colors.stone[200],
        secondary: colors.stone[600],
        secondary_dark: colors.stone[800],
        sky: colors.sky,
        paragraph: '#7C7975',
        error_light: colors.red[100],
        error: colors.red[600],
        warning_light: colors.amber[200],
        warning: colors.amber[600],
      },
    },
  },
}
