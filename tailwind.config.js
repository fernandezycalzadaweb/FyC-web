/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        site: '#FBFBFD',
        ink: '#1D1D1F',
        muted: '#6E6E73',
        line: 'rgba(0,0,0,0.08)',
        brand: '#8CBF3F',
        'brand-deep': '#4A7A34',
        card: '#FFFFFF',
        // Categorías
        'c-cortada': '#E0566E',
        'c-verdes': '#4A7A34',
        'c-plantas': '#8A9A63',
        'c-accesorios': '#C98A1F',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease both',
        'fade-up-2': 'fade-up 0.4s 0.07s ease both',
      },
    },
  },
  plugins: [],
}
