/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF3E7',
        latte: '#F0E1CC',
        espresso: '#3A2318',
        coffee: '#5C3A28',
        caramel: '#B87333',
        terracotta: '#C97C5D',
        gold: '#D9A441',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(58, 35, 24, 0.35)',
      },
    },
  },
  plugins: [],
}
