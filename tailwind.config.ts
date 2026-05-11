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
        ink: {
          bg:      '#0C0C0F',   // page background
          surface: '#131318',   // card / sheet background
          border:  '#1C1C24',   // card borders
          muted:   '#2A2A36',   // input fills, dividers
        },
        text: {
          primary:   '#F4F4F5', // headings
          secondary: '#71717A', // body / labels
          tertiary:  '#3F3F46', // disabled / hints
        },
        accent: '#4C6EF5',      // primary CTA
        up:     '#10B981',      // profit / positive
        down:   '#F43F5E',      // loss / negative
        warn:   '#F59E0B',      // warning
      },
      borderRadius: {
        card: '1rem',
        sheet: '1.5rem',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
