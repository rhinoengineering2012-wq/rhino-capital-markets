/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#FFD60A',
        up: '#22C55E',
        down: '#EF4444',
        ink: {
          950: '#000000',
          900: '#050506',
          850: '#0A0A0C',
          800: '#111114',
          700: '#1A1A1F',
          600: '#26262D',
          500: '#3A3A44',
          400: '#6B6B76',
          300: '#9A9AA5',
          200: '#C9C9D1',
          100: '#EDEDF2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 60s linear infinite',
      },
    },
  },
  plugins: [],
};
