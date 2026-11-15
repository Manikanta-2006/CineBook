/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#06070a',
          900: '#0b0e14',
          850: '#0f131c',
          800: '#141a26',
          750: '#1a2233',
          700: '#232d42',
          border: 'rgba(255, 255, 255, 0.08)',
          card: 'rgba(18, 22, 33, 0.85)',
          gold: '#f59e0b',
          amber: '#fbbf24',
          red: '#e11d48',
          cyan: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.4)',
        'glow-red': '0 0 25px -5px rgba(225, 29, 72, 0.4)',
        'glow-screen': '0 -15px 40px 5px rgba(14, 165, 233, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
