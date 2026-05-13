# TradeLog — UI/UX Design System
## Tier 2 · Dark · Premium · Precise

---

## DESIGN DECISIONS ANSWERED

| # | Question | Answer |
|---|---|---|
| 1 | Vibe | Dark · Premium · Precise |
| 2 | Brand color | #F4A623 (Sharp Amber Gold) |
| 3 | Content type | Data-heavy — trades, P&L, charts, analytics |
| 4 | Primary device | Mobile-first — phone-first, Android traders |
| 5 | User skill | Everyone — intermediate traders, not developers |
| 6 | Corner radius | Subtle (4px) — clean and professional |
| 7 | Elevation | Flat with subtle borders — dark theme |
| 8 | Animation | Smooth — purposeful transitions only |
| 9 | Information density | Compact but readable — data visible at a glance |
| 10 | Special | Dark mode only — no light mode, no toggle |

**Why amber gold:** Financial associations (gold = wealth), visible on dark backgrounds, differentiates from every competitor (Plancana is purple, TraderSync is blue), communicates precision without aggression.

---

## 1. COMPLETE COLOR SYSTEM

### Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
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
    },
  },
}

export default config
```

### CSS Variables (globals.css)

```css
/* app/globals.css */
:root {
  /* Brand */
  --color-brand:        #F4A623;
  --color-brand-dark:   #E8910A;
  --color-brand-dim:    #3D2A07;

  /* Surfaces */
  --color-bg:           #0A0A0F;
  --color-card:         #111118;
  --color-card-raised:  #18181F;
  --color-input:        #1E1E28;
  --color-hover:        #26262F;
  --color-border:       #3A3A46;
  --color-border-subtle:#2E2E38;

  /* Text */
  --color-text-primary:   #F0F0F5;
  --color-text-secondary: #A0A0B0;
  --color-text-tertiary:  #6B6B7A;

  /* Semantic */
  --color-profit:  #22C55E;
  --color-loss:    #EF4444;
  --color-warning: #F59E0B;
  --color-danger:  #DC2626;
  --color-info:    #3B82F6;
}

/* Apply dark theme globally — no toggle, always dark */
html {
  @apply dark bg-surface-900 text-ink-primary;
}
```

---

## 2. TYPOGRAPHY

### Font Stack

```ts
// app/layout.tsx
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

// Primary UI font — geometric, precise, premium
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '700'],
})

// Monospace — P&L numbers, prices, lot sizes
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '600'],
})
```

**Why Space Grotesk:** Geometric but warm. Feels modern and precise without being cold. Numbers are clear and distinct — critical for a financial app. Not Inter (overused). Not Roboto (Android-generic).

**Why JetBrains Mono for numbers:** P&L values, prices, lot sizes need monospace so digits align perfectly in tables and cards. JetBrains Mono is premium-feeling, not developer-geeky.

### Type Scale

```ts
// tailwind.config.ts — fontSize extension
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
}
```

### Typography Rules

```
P&L amounts        → font-mono font-semibold text-3xl (hero) or text-lg (list)
Trade pair names   → font-sans font-semibold text-base tracking-wide uppercase
Prices/lot sizes   → font-mono font-normal text-sm text-ink-secondary
Body copy (AI)     → font-sans font-normal text-base leading-relaxed
Section labels     → font-sans font-medium text-xs uppercase tracking-widest text-ink-tertiary
Button text        → font-sans font-semibold text-sm
Navigation labels  → font-sans font-medium text-xs
```

---

## 3. SPACING SYSTEM (8px grid)

```ts
// tailwind.config.ts — spacing override
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
}
```

**Spacing rules:**
- Between components on a page: `space-y-4` (16px)
- Card inner padding: `p-4` (16px) on mobile, `p-6` (24px) on desktop
- Between label and input: `gap-2` (8px)
- Between sections within a card: `space-y-3` (12px)
- Bottom navigation height: `h-16` (64px) — above system home indicator

---

## 4. COMPONENT SPECIFICATIONS

### 4.1 Buttons

```tsx
// Primary — brand action (Save, Connect, Confirm)
<button className="
  w-full px-4 py-3
  bg-brand-400 hover:bg-brand-500 active:bg-brand-600
  text-ink-inverse font-semibold text-sm
  rounded-[4px]
  transition-all duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60
  disabled:opacity-40 disabled:cursor-not-allowed
  active:scale-[0.98]
">

// Secondary — supporting action (Skip, Cancel)
<button className="
  w-full px-4 py-3
  bg-surface-600 hover:bg-surface-500 active:bg-surface-400
  text-ink-primary font-semibold text-sm
  rounded-[4px] border border-surface-300
  transition-all duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface-300
  disabled:opacity-40 disabled:cursor-not-allowed
">

// Ghost — low-emphasis (text links, minor actions)
<button className="
  px-3 py-2
  text-ink-secondary hover:text-ink-primary
  hover:bg-surface-500
  font-medium text-sm
  rounded-[4px]
  transition-all duration-200
">

// Danger — destructive actions
<button className="
  w-full px-4 py-3
  bg-danger/20 hover:bg-danger/30
  text-danger-text font-semibold text-sm
  rounded-[4px] border border-danger/30
  transition-all duration-200
">

// Sizes
// Small:   px-3 py-1.5 text-xs
// Default: px-4 py-3   text-sm
// Large:   px-6 py-4   text-base
```

### 4.2 Cards

```tsx
// Base card
<div className="
  bg-surface-800
  rounded-[4px]
  border border-surface-300
  p-4
">

// Elevated card (modals, sheets)
<div className="
  bg-surface-700
  rounded-[4px]
  border border-surface-200
  p-4
  shadow-[0_8px_32px_rgba(0,0,0,0.4)]
">

// Trade card — active (glowing border to indicate live)
<div className="
  bg-surface-800
  rounded-[4px]
  border border-brand-400/40
  p-4
  shadow-[0_0_16px_rgba(244,166,35,0.08)]
">

// Trade card — win result
<div className="
  bg-surface-800
  rounded-[4px]
  border-l-2 border-l-profit border-y border-r border-surface-300
  p-4
">

// Trade card — loss result
<div className="
  bg-surface-800
  rounded-[4px]
  border-l-2 border-l-loss border-y border-r border-surface-300
  p-4
">

// Stat card (dashboard blocks)
<div className="
  bg-surface-800
  rounded-[4px]
  border border-surface-300
  p-4
  flex flex-col gap-1
">
  <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
    Today's P&L
  </span>
  <span className="text-3xl font-mono font-semibold text-profit">
    +₹1,247
  </span>
</div>
```

### 4.3 Inputs

```tsx
// Text input
<div className="flex flex-col gap-2">
  <label className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
    MT5 Login ID
  </label>
  <input
    className="
      w-full px-4 py-3
      bg-surface-600
      border border-surface-300
      hover:border-surface-200
      focus:border-brand-400 focus:outline-none
      rounded-[4px]
      text-ink-primary text-base font-sans
      placeholder:text-ink-tertiary
      transition-colors duration-150
    "
    placeholder="12345678"
  />
  <span className="text-xs text-ink-tertiary">
    Find this in your MT5 terminal
  </span>
</div>

// Error state
<input className="
  ... (base classes)
  border-danger/60 focus:border-danger
">
<span className="text-xs text-danger-text">
  Invalid login ID
</span>

// Number input (Risk Calculator)
<input
  type="number"
  className="
    w-full px-4 py-3
    bg-surface-600 border border-surface-300
    focus:border-brand-400 focus:outline-none
    rounded-[4px]
    text-ink-primary text-base font-mono
    transition-colors duration-150
  "
/>

// Textarea (reflection, reasoning fallback)
<textarea
  className="
    w-full px-4 py-3 min-h-[80px]
    bg-surface-600 border border-surface-300
    focus:border-brand-400 focus:outline-none
    rounded-[4px]
    text-ink-primary text-base font-sans leading-relaxed
    placeholder:text-ink-tertiary
    resize-none
    transition-colors duration-150
  "
/>
```

### 4.4 Emotion Tags

```tsx
// Entry emotion — 4 options, single select
const entryEmotions = [
  { key: 'calm',      label: 'Calm',      icon: '😌', color: 'info' },
  { key: 'confident', label: 'Confident', icon: '💪', color: 'profit' },
  { key: 'fomo',      label: 'FOMO',      icon: '😰', color: 'warning' },
  { key: 'revenge',   label: 'Revenge',   icon: '😤', color: 'danger' },
]

// Unselected tag
<button className="
  flex-1 flex flex-col items-center gap-1.5 py-3 px-2
  bg-surface-600 hover:bg-surface-500
  border border-surface-300 hover:border-surface-200
  rounded-[4px]
  transition-all duration-200
  active:scale-[0.97]
">

// Selected — calm (info)
<button className="
  flex-1 flex flex-col items-center gap-1.5 py-3 px-2
  bg-info/15 border border-info/50
  rounded-[4px]
  shadow-[0_0_12px_rgba(59,130,246,0.15)]
">

// Selected — FOMO (warning)
<button className="
  flex-1 flex flex-col items-center gap-1.5 py-3 px-2
  bg-warning/15 border border-warning/50
  rounded-[4px]
  shadow-[0_0_12px_rgba(245,158,11,0.15)]
">
```

### 4.5 Voice Input Button

```tsx
// Idle state
<button className="
  w-full flex items-center gap-3 px-4 py-3
  bg-surface-600 hover:bg-surface-500
  border border-surface-300 hover:border-brand-400/40
  rounded-[4px]
  transition-all duration-200
">
  <span className="text-xl">🎙️</span>
  <span className="text-ink-secondary text-sm">
    Hold to speak — Hindi, Marathi, English
  </span>
</button>

// Recording state — pulsing border
<button className="
  w-full flex items-center gap-3 px-4 py-3
  bg-surface-600
  border border-brand-400
  rounded-[4px]
  animate-pulse-border     // custom animation below
">
  <span className="text-xl animate-ping-slow">🎙️</span>
  <span className="text-brand-400 text-sm font-medium">
    Recording... release to stop
  </span>
</button>

// Processing state
<div className="
  w-full flex items-center gap-3 px-4 py-3
  bg-surface-600
  border border-surface-300
  rounded-[4px]
">
  <Spinner className="text-brand-400" />
  <span className="text-ink-tertiary text-sm">Transcribing...</span>
</div>
```

### 4.6 Navigation (Mobile Bottom Nav)

```tsx
// Bottom navigation shell
<nav className="
  fixed bottom-0 left-0 right-0
  h-16
  bg-surface-800/95 backdrop-blur-md
  border-t border-surface-300
  flex items-center justify-around
  px-2
  pb-safe  // accounts for iPhone home indicator
  z-50
">

// Nav item — inactive
<button className="
  flex flex-col items-center gap-1 px-4 py-2
  text-ink-tertiary hover:text-ink-secondary
  transition-colors duration-150
  min-w-[44px] min-h-[44px]  // 44px touch target minimum
">
  <Icon className="w-5 h-5" />
  <span className="text-[10px] font-medium">Journal</span>
</button>

// Nav item — active
<button className="
  flex flex-col items-center gap-1 px-4 py-2
  text-brand-400
  min-w-[44px] min-h-[44px]
">
  <Icon className="w-5 h-5" />
  <span className="text-[10px] font-semibold">Journal</span>
</button>

// 5 nav items: Home · Journal · Calculator · Analytics · Rules
```

### 4.7 Alerts

```tsx
// Level 1 — Warning banner (amber, non-blocking)
<div className="
  fixed top-0 left-0 right-0 z-40
  px-4 py-3
  bg-warning-dim border-b border-warning/30
  flex items-center gap-3
  animate-slide-down
">
  <span className="text-warning text-base">⚠️</span>
  <span className="text-warning-text text-sm font-medium flex-1">
    2 trades today. 1 remaining before your daily limit.
  </span>
</div>

// Level 2 — Hard stop overlay (non-dismissable)
<div className="
  fixed inset-0 z-50
  bg-black/80 backdrop-blur-sm
  flex items-end justify-center
  p-4
">
  <div className="
    w-full max-w-md
    bg-surface-700
    border border-danger/30
    rounded-t-[4px]
    p-6 pb-8
    space-y-4
  ">
    <div className="flex items-center gap-3">
      <span className="text-2xl">🚫</span>
      <h3 className="text-ink-primary font-semibold text-lg">Daily Loss Limit Reached</h3>
    </div>
    <p className="text-ink-secondary text-sm leading-relaxed">
      You set this limit because you know you spiral after losses.
    </p>
    {/* User's personal note shown here */}
    <div className="
      bg-surface-600 border border-surface-300
      rounded-[4px] p-3
      text-ink-tertiary text-sm italic
    ">
      "Because I always revenge trade after hitting 3% loss"
    </div>
    <button className="w-full ... danger button">Stop for today</button>
    {/* NO "continue anyway" on loss limit */}
  </div>
</div>

// Level 3 — Trade flag badge (on trade card)
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  bg-warning/15 border border-warning/30
  rounded-[4px]
  text-warning-text text-xs font-medium
">
  Rule break flagged
</span>
```

### 4.8 P&L Display (most used component)

```tsx
// Hero P&L (today's total — largest)
<div className="flex flex-col gap-0.5">
  <span className="text-xs font-medium uppercase tracking-widest text-ink-tertiary">
    Today's P&L
  </span>
  <span className={cn(
    "text-3xl font-mono font-semibold",
    pnl > 0 ? "text-profit-text" : pnl < 0 ? "text-loss-text" : "text-neutral"
  )}>
    {pnl > 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN')}
  </span>
</div>

// Compact P&L (trade list row)
<span className={cn(
  "font-mono font-semibold text-sm",
  pnl > 0 ? "text-profit-text" : "text-loss-text"
)}>
  {pnl > 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN')}
</span>

// CRITICAL RULE: Always en-IN locale for Indian number formatting
// ₹1,00,000 not ₹100,000
// Always show + prefix for positive values
// Always show ₹ symbol — never USD
```

### 4.9 Streak Badge

```tsx
// Active streak
<div className="
  inline-flex items-center gap-2
  px-3 py-2
  bg-brand-400/10 border border-brand-400/30
  rounded-[4px]
">
  <span className="text-brand-400 font-mono font-bold text-lg">🔥 14</span>
  <span className="text-ink-secondary text-sm">trade streak</span>
</div>

// Zero streak
<div className="
  inline-flex items-center gap-2
  px-3 py-2
  bg-surface-600 border border-surface-300
  rounded-[4px]
">
  <span className="text-ink-tertiary text-sm">Start your streak</span>
</div>
```

### 4.10 Skeleton Loaders

```tsx
// Base skeleton class
<div className="
  bg-surface-600
  rounded-[4px]
  animate-pulse
" />

// P&L hero skeleton
<div className="space-y-2">
  <div className="h-3 w-16 bg-surface-600 rounded animate-pulse" />
  <div className="h-9 w-32 bg-surface-600 rounded animate-pulse" />
</div>

// Trade card skeleton
<div className="bg-surface-800 border border-surface-300 rounded-[4px] p-4 space-y-3">
  <div className="h-4 w-24 bg-surface-600 rounded animate-pulse" />
  <div className="h-3 w-40 bg-surface-600 rounded animate-pulse" />
  <div className="h-3 w-20 bg-surface-600 rounded animate-pulse" />
</div>
```

### 4.11 Bottom Sheet

```tsx
// Bottom sheet wrapper
<div className={cn(
  "fixed inset-0 z-40 flex flex-col justify-end",
  isOpen ? "pointer-events-auto" : "pointer-events-none"
)}>
  {/* Overlay */}
  <div className={cn(
    "absolute inset-0 bg-black/60 backdrop-blur-sm",
    "transition-opacity duration-300",
    isOpen ? "opacity-100" : "opacity-0"
  )} onClick={onClose} />

  {/* Sheet */}
  <div className={cn(
    "relative bg-surface-700 border-t border-surface-300",
    "rounded-t-[4px]",
    "transition-transform duration-300 ease-out",
    isOpen ? "translate-y-0" : "translate-y-full",
    "max-h-[90dvh] overflow-y-auto",
    "pb-safe"
  )}>
    {/* Handle */}
    <div className="flex justify-center pt-3 pb-4">
      <div className="w-10 h-1 bg-surface-300 rounded-full" />
    </div>
    {children}
  </div>
</div>
```

### 4.12 Charts (Recharts config)

```tsx
// P&L line chart theme
const chartTheme = {
  background: 'transparent',
  gridColor: '#2E2E38',        // surface-400
  axisColor: '#6B6B7A',        // ink-tertiary
  profitLine: '#22C55E',       // profit
  lossLine: '#EF4444',         // loss
  brandLine: '#F4A623',        // brand
  tooltipBg: '#18181F',        // surface-700
  tooltipBorder: '#3A3A46',   // surface-300
}

// RechartsTooltip style
<Tooltip
  contentStyle={{
    background: '#18181F',
    border: '1px solid #3A3A46',
    borderRadius: '4px',
    color: '#F0F0F5',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
  }}
/>
```

---

## 5. ANIMATION PRINCIPLES

**Philosophy:** Every animation must have a purpose. No decorative motion. If removing it doesn't confuse the user, remove it.

```ts
// tailwind.config.ts — custom animations
extend: {
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
}
```

### Animation Usage Map

| Interaction | Animation | Duration |
|---|---|---|
| Page transition | `slide-up` from page below | 300ms |
| Bottom sheet open | `translateY(100%) → 0` | 300ms ease-out |
| Bottom sheet close | `translateY(0) → 100%)` | 250ms ease-in |
| Alert banner appear | `slide-down` | 300ms |
| Button tap | `scale(0.98)` | 100ms |
| Emotion tag select | opacity + border-color | 200ms |
| Skeleton → content | `fade-in` | 200ms |
| Voice recording | `pulse-border` on container | 1.5s loop |
| P&L number update | `fade-in` after number changes | 200ms |
| Card hover | border-color + bg | 150ms |

### What NOT to animate
- Charts (Recharts handles its own)
- P&L number counting up (feels gimmicky for a serious financial tool)
- Anything on low-power mode
- Loading spinners beyond a simple rotate

---

## 6. RESPONSIVE BREAKPOINTS

```ts
// tailwind.config.ts
screens: {
  'xs':  '375px',   // Smallest Android phone
  'sm':  '430px',   // iPhone Pro Max / large Android
  'md':  '768px',   // Tablet — switches to desktop layout
  'lg':  '1024px',  // Desktop
  'xl':  '1280px',  // Wide desktop
}
```

### Layout Breakpoints

```
Mobile (< 768px):
  - Single column
  - Bottom navigation bar (h-16, fixed)
  - Full-width cards (px-4 container padding)
  - Stack everything vertically
  - Touch targets: 44px minimum height

Desktop (≥ 768px):
  - Sidebar navigation (w-60, fixed left)
  - Main content area (ml-60, max-w-2xl centered)
  - Cards can be 2-column grid for analytics
  - Full trade history table replaces card list
  - Hover states enabled
```

---

## 7. ICON STYLE GUIDE

**Icon library:** Lucide React — clean, 2px stroke, rounded caps. Consistent weight.

```tsx
import { TrendingUp, TrendingDown, Flame, Calculator,
         BarChart2, Shield, Settings, Bell, Mic,
         Check, X, AlertTriangle, Info, ChevronRight } from 'lucide-react'

// Standard icon sizes
// xs: w-3 h-3 (12px) — inline text icons
// sm: w-4 h-4 (16px) — list items, badges
// md: w-5 h-5 (20px) — nav icons (default)
// lg: w-6 h-6 (24px) — section headers
// xl: w-8 h-8 (32px) — empty states

// Icon color usage
// Active / brand action → text-brand-400
// Navigation active   → text-brand-400
// Navigation inactive → text-ink-tertiary
// Profit indicator    → text-profit-text
// Loss indicator      → text-loss-text
// Warning             → text-warning-text
// Error               → text-danger-text
// Info                → text-info-text
// Disabled            → text-surface-100
```

---

## 8. ACCESSIBILITY GUIDELINES

**Minimum touch target:** 44×44px for every interactive element — critical for phone use.

**Color contrast requirements:**
```
ink-primary   on surface-800 → 12:1  ✅ AAA
ink-secondary on surface-800 → 5.8:1 ✅ AA
brand-400     on surface-800 → 4.8:1 ✅ AA
profit-text   on surface-800 → 5.2:1 ✅ AA
loss-text     on surface-800 → 5.0:1 ✅ AA
```

**Focus states:** Every interactive element must have a visible focus ring. Never `outline-none` without a replacement.
```tsx
// Standard focus ring
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
```

**Font sizes:** Minimum 13px (text-sm) for any readable text. Never below.

**Error states:** Never rely on color alone — always pair with an icon or text.

---

## 9. PAGE-BY-PAGE LAYOUT SPECS

### Auth / Login Page
```
Full screen, centered vertically
Logo (top 1/3)
Tagline — text-xl ink-secondary
PhoneOTPForm — max-w-sm centered
Email toggle link at bottom
Background: bg-surface-900 (bare — no gradient)
```

### Onboarding Pages
```
Progress indicator at top (dots — current step highlighted in brand-400)
Single purpose per screen
Large tap targets for all choices
"Continue" button always at bottom, full width
Back arrow top-left
```

### Home Dashboard
```
Safe area padding top
Scroll area (main content)
  → TodayPnL (stat card, full width)
  → ActiveTradesList (only when trades exist)
  → StreakBadge (inline compact)
  → WeekSummary (3-column stat row)
  → RecentTradesList (last 5, card list)
  → 80px bottom padding (clears nav bar)
Floating button: RiskCalculator (bottom-right, above nav bar)
  → bg-brand-400, shadow-[0_4px_16px_rgba(244,166,35,0.3)]
  → w-12 h-12 rounded-full
```

### Trade Entry / Exit Card
```
Full-screen modal pushed from bottom
Auto-populated trade data (read-only) at top
VoiceInput — full width
EmotionTag row — 4 equal columns
"Save" button — full width, primary
Built on top of BottomSheet component
```

### Risk Calculator Page
```
Title + subtitle
4 inputs in 2-column grid (entry / SL / balance / risk%)
Divider
Output row: lot size (large, font-mono) + loss ₹ + profit ₹ + RR
"I'm taking this trade" ghost button at bottom
```

### Analytics Page
```
Tab bar at top: Week / Month / All time
PnLChart (full width, h-48)
WinRateRR (2-column stat)
PairPerformanceTable (full width)
SessionPerformanceTable (full width)
EmotionOutcomeTable (full width)
CalendarView (full width month grid)
```

### Weekly Report Page
```
Document-style, full-screen scroll
Headline section (3 big numbers + summary sentence)
BiggestInsight (prose, full width)
PatternStats (3-column grid of stat cards)
RuleComplianceSection (per-rule rows)
RuleSuggestion (conditional, card)
NextWeekFocus (highlighted card — brand border)
```

---

## 10. TAILWIND UTILITY CLASSES — QUICK REFERENCE

```tsx
// Page container
<div className="min-h-screen bg-surface-900 pb-20">

// Scrollable content area (accounts for nav bar)
<main className="px-4 pt-4 pb-24 space-y-4">

// Section label
<p className="text-xs font-medium uppercase tracking-widest text-ink-tertiary mb-2">

// Divider
<hr className="border-surface-300">

// Trade pair display
<span className="font-sans font-semibold text-base uppercase tracking-wide text-ink-primary">
  XAUUSD
</span>

// Session badge
<span className="px-2 py-0.5 bg-surface-600 border border-surface-300 rounded-[4px] text-xs text-ink-secondary font-medium">
  London
</span>

// Win badge
<span className="px-2 py-0.5 bg-profit/15 border border-profit/30 rounded-[4px] text-xs text-profit-text font-medium">
  Win
</span>

// Loss badge
<span className="px-2 py-0.5 bg-loss/15 border border-loss/30 rounded-[4px] text-xs text-loss-text font-medium">
  Loss
</span>

// Unread indicator dot
<div className="w-2 h-2 rounded-full bg-brand-400" />

// Empty state
<div className="flex flex-col items-center gap-3 py-12 text-center">
  <Icon className="w-8 h-8 text-ink-tertiary" />
  <p className="text-ink-secondary text-sm max-w-[200px] leading-relaxed">
    Message here
  </p>
</div>
```

---

## 11. WINDSURF AGENT PROMPT TEMPLATE (UI)

Use this when asking Windsurf to build any screen:

```
Build [COMPONENT NAME] for TradeLog.

Design system:
- Dark theme only: bg-surface-900 (page), bg-surface-800 (card)
- Brand color: #F4A623 (text-brand-400)
- Corner radius: rounded-[4px] everywhere
- Font: Space Grotesk (sans), JetBrains Mono (numbers)
- P&L values: font-mono, en-IN locale (₹1,00,000 format), always show ₹
- Touch targets: 44px minimum height on all interactive elements
- Animation: smooth transitions 200-300ms, ease-out for enter, ease-in for exit
- No decorative animations — only purposeful motion
- Borders: border-surface-300 (default), brand-400/40 (active/focused)
- Text hierarchy: ink-primary (main), ink-secondary (supporting), ink-tertiary (labels)

Component purpose:
[explain what this component does and what data it receives]

Props/data:
[list what the component receives]

Do not use:
- Light backgrounds
- Pure white (#FFFFFF) or pure black (#000000)
- Box shadows (use borders instead, except elevated modals)
- Rounded-full on non-circular elements
- Any color outside the design system above
```

---

*Design system version: 1.0 — Tier 2*
*Vibe: Dark · Premium · Precise*
*Primary: #F4A623 Amber Gold*
*Framework: Tailwind CSS + Next.js 14*
*Tool: Windsurf*
