/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#030308',
          deep: '#070614',
          accent: '#120f2b',
        },
        gold: {
          light: '#FFF59D',
          DEFAULT: '#FFD700',
          warm: '#FFC107',
          deep: '#FF9800',
          glow: 'rgba(255, 215, 0, 0.5)',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 35px rgba(255,215,0,0.8))' },
        }
      }
    },
  },
  plugins: [],
};
