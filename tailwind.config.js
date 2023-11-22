/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark1': '#202020',
        'dark2': '#181324',
        'dark3': '#1C1F37',
        'dark4': '#171322',
        'primary1': '#B897E6',
        'primary2': '#7B44C7',
        'secondary': '#9B9A9F',
        'highlight': '#E69797',
      }
    },
  },
  plugins: [],
}