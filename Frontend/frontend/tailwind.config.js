/** @type {import('tailwindcss').Config} */
export default  {
  // Use the 'important' strategy to beat MUI specificity
  important: '#root',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}