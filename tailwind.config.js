/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        salmon: {
          50:  '#fff5f2',
          100: '#ffe6df',
          200: '#fec9b8',
          300: '#fda68e',
          400: '#f88060',
          500: '#f4694a',
          600: '#e05030',
          700: '#bb3d22',
          800: '#99321e',
          900: '#7d2d1e',
        },
        navy: {
          50:  '#eef0f9',
          100: '#d5d9f0',
          200: '#a9b2e0',
          300: '#7a88ce',
          400: '#5a67bc',
          500: '#3d4eaa',
          600: '#333f93',
          700: '#283277',
          800: '#1e265c',
          900: '#161c44',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: []
}
