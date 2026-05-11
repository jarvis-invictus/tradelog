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
        brand: {
          primary: '#6366F1',   // indigo-500 — main CTA, active states
          accent: '#8B5CF6',    // violet-500 — highlights, badges
        },
        success: '#22C55E',     // green-500
        danger: '#EF4444',      // red-500
        warning: '#F59E0B',     // amber-500
        surface: {
          DEFAULT: '#111827',   // gray-900 — page bg
          card: '#1F2937',      // gray-800 — card bg
          elevated: '#374151',  // gray-700 — elevated elements
        },
        muted: '#6B7280',       // gray-500 — secondary text
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
