/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep-indigo / midnight editorial palette
        background: '#0B1020',
        surface: '#121832',
        'surface-elevated': '#1A2142',
        border: 'rgba(255, 255, 255, 0.09)',
        'border-strong': 'rgba(255, 255, 255, 0.18)',
        foreground: '#F2F4FF',
        muted: '#9AA3C7',
        faint: '#5A6291',
        // Refined blue accent + violet secondary accent
        accent: '#4F8CFF',
        'accent-soft': 'rgba(79, 140, 255, 0.14)',
        'accent-glow': 'rgba(79, 140, 255, 0.35)',
        'accent-2': '#A855F7',
        'accent-2-soft': 'rgba(168, 85, 247, 0.14)',
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', '"Inter Tight"', '"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid typography via clamp()
        'display-2xl': ['clamp(3.25rem, 11vw, 9rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(2.5rem, 7.5vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2rem, 5vw, 4.25rem)', { lineHeight: '0.96', letterSpacing: '-0.03em' }],
        'h1': ['clamp(1.75rem, 3.8vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'h2': ['clamp(1.4rem, 2.8vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h3': ['clamp(1.15rem, 2vw, 1.6rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'lead': ['clamp(1.05rem, 1.4vw, 1.3rem)', { lineHeight: '1.6' }],
        'eyebrow': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.22em' }],
      },
      maxWidth: {
        'editorial': '1240px',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.96)' },
        },
      },
    },
  },
  plugins: [],
}