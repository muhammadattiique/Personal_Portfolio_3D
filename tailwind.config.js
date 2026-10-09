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
        // Logan-inspired editorial dark palette
        background: '#0A0A0C',
        surface: '#111114',
        'surface-elevated': '#17171B',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-strong': 'rgba(255, 255, 255, 0.16)',
        foreground: '#EDEDED',
        muted: '#8A8A8E',
        faint: '#4A4A50',
        // ONE subtle accent — signature Logan electric lime
        accent: '#C6FF3D',
        'accent-soft': 'rgba(198, 255, 61, 0.12)',
        'accent-glow': 'rgba(198, 255, 61, 0.3)',
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