/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#007AFF',
        'brand-green': '#34C759',
        'brand-neon-blue': '#4D9FFF',
        'brand-neon-green': '#5EFF8A',
        'dark-bg': '#000000',
        'dark-surface': '#121212',
        'dark-card': '#1C1C1E',
        'dark-border': 'rgba(128, 128, 128, 0.2)',
        'dark-text': '#E5E5E7',
        'dark-text-secondary': '#8E8E93',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      backdropBlur: {
        'xl': '24px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
