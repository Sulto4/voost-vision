import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdecef',
          100: '#fbd7de',
          200: '#f6afb9',
          300: '#ef8394',
          400: '#e45b73',
          500: '#c41e3a',
          600: '#a31a31',
          700: '#7f1427',
          800: '#5c0e1c',
          900: '#3e0811',
          950: '#220307',
        },
        accent: {
          100: '#ffd5dc',
          300: '#ff8ca0',
          500: '#ff4d6d',
          700: '#d3304f',
        },
        surface: {
          50: '#f7f7f8',
          100: '#ececef',
          200: '#d6d7dc',
          300: '#afb1ba',
          400: '#808490',
          500: '#5f6470',
          600: '#444954',
          700: '#2f333d',
          800: '#1e2028',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
      },
      boxShadow: {
        card: '0 30px 60px -35px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.05) inset',
        'card-hover': '0 45px 85px -40px rgba(0,0,0,0.9), 0 0 0 1px rgba(228,91,115,0.28)',
        glow: '0 0 0 1px rgba(196,30,58,0.3), 0 0 40px rgba(196,30,58,0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'fade-in-up': 'fadeInUp 0.65s ease-out',
        'soft-pulse': 'softPulse 3.8s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
