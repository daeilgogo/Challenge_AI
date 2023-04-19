/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens:{
        xs:"480px",
        sm:'768px',
        md:'1060px',
      }
    }
  },
  plugins: [],
}