/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#05070F',
        graphite: '#1A1D29',
        steel: '#272B38',
        neon: '#3B82F6',
        neonSoft: '#60A5FA',
        accent: '#0EA5E9',
        glass: 'rgba(21, 24, 34, 0.65)',
        surface: 'rgba(255, 255, 255, 0.04)',
        outline: 'rgba(94, 109, 140, 0.35)',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
        pill: '9999px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(59, 130, 246, 0.35)',
        card: '0 24px 60px rgba(5, 7, 15, 0.6)',
      },
      backdropBlur: {
        xl: '28px',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(.9)', opacity: '0.85' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        sweep: {
          '0%': { strokeDashoffset: 100 },
          '100%': { strokeDashoffset: 0 },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        sweep: 'sweep 45s linear infinite',
      },
      fontFamily: {
        display: ['"SF Pro Display"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.18), transparent 42%), radial-gradient(circle at 50% 100%, rgba(96,165,250,0.25), transparent 55%)',
      },
    },
  },
  plugins: [],
};
