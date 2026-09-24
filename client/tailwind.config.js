/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trauma: {
          bg: '#0a0f1d',
          surface: '#111827',
          surfaceLight: '#1f2937',
          border: '#374151',
          accent: '#0d9488',
          accentLight: '#14b8a6',
          calm: '#38bdf8',
          violet: '#818cf8',
          text: '#f3f4f6',
          textMuted: '#9ca3af',
        },
        risk: {
          green: '#10b981',
          yellow: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 8s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.35)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
