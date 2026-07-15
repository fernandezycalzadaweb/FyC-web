/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14261E',
        'ink-deep': '#0E1C15',
        paper: '#F1ECDD',
        leaf: '#4C7A5E',
        'leaf-dark': '#375A44',
        rust: '#B5502D',
        gold: '#C9A227',
        'gold-light': '#DCB43A',
        mist: '#DCE3D8',
        card: '#FBF9F2',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs: ['11.5px', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        stamp: '0.1em',
        wide: '0.06em',
      },
      backgroundImage: {
        hatch: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 34px)',
        'hatch-light': 'repeating-linear-gradient(45deg, rgba(20,38,30,0.04) 0 2px, transparent 2px 12px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s ease both',
        'fade-up-2': 'fade-up 0.55s 0.1s ease both',
        'fade-up-3': 'fade-up 0.55s 0.2s ease both',
        'spin-slow': 'spin-slow 22s linear infinite',
      },
    },
  },
  plugins: [],
}
