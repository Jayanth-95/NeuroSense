/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        neural: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          400: '#6b8cff',
          500: '#4f6ef7',
          600: '#3a57e8',
          700: '#2b44d4',
          900: '#0d1a6b',
        },
        slate: {
          750: '#253047',
          850: '#141e2e',
          950: '#0a0f1e',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(79, 110, 247, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(79, 110, 247, 0.7)' },
        }
      },
      boxShadow: {
        'neural': '0 0 30px rgba(79, 110, 247, 0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'voxel': '6px 6px 0px #020617',
      }
    },
  },
  plugins: [],
}
