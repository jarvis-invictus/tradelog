import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Amber Gold
        brand: {
          50:  '#FFF8EB',
          100: '#FEEFC3',
          200: '#FDD98A',
          300: '#FCC04F',
          400: '#F4A623',  // ← Primary brand color
          500: '#E8910A',
          600: '#C47207',
          700: '#9A5506',
          800: '#7A4208',
          900: '#64360A',
        },

        // Surface — Dark backgrounds (not pure black — feels premium)
        surface: {
          900: '#0A0A0F',  // App background — deepest
          800: '#111118',  // Card background
          700: '#18181F',  // Elevated card
          600: '#1E1E28',  // Input background
          500: '#26262F',  // Hover state
          400: '#2E2E38',  // Active / selected
          300: '#3A3A46',  // Border
          200: '#4A4A58',  // Subtle border
          100: '#6B6B7A',  // Disabled text
        },

        // Text
        ink: {
          primary:   '#F0F0F5',  // Main text — off-white (not pure white)
          secondary: '#A0A0B0',  // Secondary text
          tertiary:  '#6B6B7A',  // Placeholder, labels
          inverse:   '#0A0A0F',  // Text on brand color
        },

        // Semantic — P&L critical
        profit: {
          DEFAULT: '#22C55E',  // Green — winning trades
          dim:     '#166534',  // Muted green for backgrounds
          text:    '#4ADE80',  // Slightly brighter for readability on dark
        },
        loss: {
          DEFAULT: '#EF4444',  // Red — losing trades
          dim:     '#7F1D1D',  // Muted red for backgrounds
          text:    '#F87171',  // Slightly brighter for readability on dark
        },
        neutral: {
          DEFAULT: '#94A3B8',  // Breakeven / no change
          dim:     '#1E293B',
        },

        // Alert levels (Rules Engine)
        warning: {
          DEFAULT: '#F59E0B',
          dim:     '#78350F',
          text:    '#FCD34D',
        },
        danger: {
          DEFAULT: '#DC2626',
          dim:     '#7F1D1D',
          text:    '#FCA5A5',
        },
        info: {
          DEFAULT: '#3B82F6',
          dim:     '#1E3A5F',
          text:    '#93C5FD',
        },
      },
      borderRadius: {
        'DEFAULT': '4px', // Subtle (4px) — clean and professional
      },
      spacing: {
        '0':    '0px',
        '0.5':  '2px',
        '1':    '4px',
        '1.5':  '6px',
        '2':    '8px',    // ← Base unit
        '3':    '12px',
        '4':    '16px',
        '5':    '20px',
        '6':    '24px',
        '8':    '32px',
        '10':   '40px',
        '12':   '48px',
        '16':   '64px',
        '20':   '80px',
        '24':   '96px',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      fontSize: {
        // UI Labels
        'xs':   ['0.70rem', { lineHeight: '1rem',    letterSpacing: '0.03em' }],   // 11px — tiny labels
        'sm':   ['0.813rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],  // 13px — captions
        'base': ['0.938rem', { lineHeight: '1.5rem',  letterSpacing: '0' }],       // 15px — body
        'lg':   ['1.063rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em' }], // 17px — emphasis
        'xl':   ['1.25rem',  { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],  // 20px — section headers
        '2xl':  ['1.5rem',   { lineHeight: '2rem',    letterSpacing: '-0.02em' }],  // 24px — screen titles
        '3xl':  ['2rem',     { lineHeight: '2.5rem',  letterSpacing: '-0.03em' }],  // 32px — P&L hero number
        '4xl':  ['2.5rem',   { lineHeight: '3rem',    letterSpacing: '-0.04em' }],  // 40px — onboarding hero
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      screens: {
        'xs':  '375px',   // Smallest Android phone
        'sm':  '430px',   // iPhone Pro Max / large Android
        'md':  '768px',   // Tablet — switches to desktop layout
        'lg':  '1024px',  // Desktop
        'xl':  '1280px',  // Wide desktop
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'out':      'cubic-bezier(0.0, 0, 0.2, 1)',  // ease-out — elements entering
        'in':       'cubic-bezier(0.4, 0, 1, 1)',    // ease-in — elements leaving
        'smooth':   'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out — state changes
      },
      keyframes: {
        'slide-down': {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-border': {
          '0%, 100%': { borderColor: 'rgba(244, 166, 35, 0.4)' },
          '50%':      { borderColor: 'rgba(244, 166, 35, 1.0)' },
        },
        'ping-slow': {
          '0%':    { transform: 'scale(1)',    opacity: '1' },
          '75%, 100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        'slide-down':    'slide-down 300ms ease-out',
        'slide-up':      'slide-up 300ms ease-out',
        'fade-in':       'fade-in 200ms ease-out',
        'pulse-border':  'pulse-border 1.5s ease-in-out infinite',
        'ping-slow':     'ping-slow 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
