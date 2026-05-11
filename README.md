# TradeLog

> Your trades are already happening. Now they'll start teaching you.

AI-powered behavior change system for Indian retail forex traders. Voice-first, MT5 auto-sync, built for Hindi/Marathi speaking traders on phone.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark-first) |
| State | Zustand |
| Charts | Recharts |
| PWA | next-pwa |
| Database | Supabase (PostgreSQL — 9 tables + exchange_rates) |
| Auth | Supabase Auth (Phone OTP, +91) |
| Realtime | Supabase Realtime |
| Backend | Next.js API routes (NOT Supabase Edge Functions) |
| MT5 sync | MetaApi (read-only investor token) |
| Voice | OpenAI Whisper API |
| AI | Claude API (claude-3-5-sonnet) |
| Push | Firebase Cloud Messaging (FCM only) |
| Payments | Razorpay (INR + UPI) |
| Hosting | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/jarvis-invictus/tradelog.git
cd tradelog
npm install
```

### 2. Set up environment variables

```bash
cp env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order:
```bash
npx supabase db push
```
3. Generate types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```

### 4. Run locally

```bash
npm run dev
```

---

## Build Plan

**4 Stages · 13 Phases · ~56 Milestones**

| Stage | Phases | What gets built |
|---|---|---|
| 1 — Foundation | 0–2 | Setup, auth, onboarding |
| 2 — Core Trade Loop | 3–6 | MetaApi, trade UI, calculator, dashboard |
| 3 — Intelligence | 7–10 | AI feedback, rules engine, analytics, weekly report |
| 4 — Production | 11–13 | Desktop layout, payments, beta polish |

> **Agent rule:** One milestone = one session. Never hand an agent more than one milestone.

---

## Folder Structure

```
tradelog/
├── app/                  ← Next.js App Router
│   ├── (auth)/           ← Login (no app shell)
│   ├── (onboarding)/     ← 5-step onboarding flow
│   ├── (app)/            ← Main app (home, trade, analytics, rules, report)
│   └── api/              ← All backend logic (metaapi, whisper, ai, razorpay, notifications)
├── components/           ← All UI components (auth, onboarding, dashboard, trade, calculator, feedback, rules, analytics, report, ui)
├── hooks/                ← useAuth, useTrades, useStreak, usePnL, useRules, useNotifications
├── lib/                  ← Service integrations (supabase, metaapi, whisper, ai, razorpay)
├── store/                ← Zustand stores (auth, trade, rules, settings)
├── utils/                ← Pure functions (pnlCalculator, sessionDetector, streakEngine, formatters)
├── constants/            ← emotions, sessions, strings (EN/HI/MR)
├── types/                ← Shared TypeScript types
├── supabase/migrations/  ← 10 SQL migration files (001–010)
└── public/               ← manifest.json, firebase-messaging-sw.js, icons/
```

---

## Key Constraints

- All P&L values in Indian Rupees (₹), never pips
- Voice = speech-to-text only — audio is NEVER stored, only the transcript
- Dark theme as default (`dark` class on `<html>`)
- TypeScript throughout — no `any` types in production code
- Firebase is FCM push notifications ONLY — not Firestore, not Firebase Auth
- All backend logic in Next.js API routes — NOT Supabase Edge Functions

---

## Beta Launch Checklist

- [ ] Phases 0–6 complete and tested on a real Android phone
- [ ] MetaApi connected to a real Dupoin account — at least 5 trades auto-synced
- [ ] Whisper tested: speak in Hindi → transcript is accurate
- [ ] AI feedback prompt tested on 20 manually constructed trades
- [ ] Rules engine: all alert levels trigger correctly
- [ ] Daily loss limit hard stop confirmed: no "continue" option
- [ ] Push notifications working on Android (background + foreground)
- [ ] RLS verified: two test accounts cannot read each other's data
- [ ] Supabase Realtime: close a trade on MT5 → dashboard updates without refresh
