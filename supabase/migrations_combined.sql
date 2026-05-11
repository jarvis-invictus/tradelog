create table users (
  id uuid references auth.users primary key,
  name text,
  language text default 'en',
  metaapi_account_id text,
  mt5_connected boolean default false,
  onboarding_complete boolean default false,
  plan text default 'free',
  plan_expires_at timestamptz,
  fcm_token text,
  created_at timestamptz default now()
);

alter table users enable row level security;

create policy "users can only access own data"
  on users for all
  using (auth.uid() = id);
create table user_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text,
  definition jsonb,
  personal_note text,
  compliance_rate numeric default 100,
  last_broken timestamptz,
  created_at timestamptz default now()
);

alter table user_rules enable row level security;

create policy "users can only access own rules"
  on user_rules for all
  using (auth.uid() = user_id);
create table trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  metaapi_id text unique,
  pair text,
  direction text,
  entry_price numeric,
  sl_price numeric,
  tp_price numeric,
  lot_size numeric,
  session text,
  open_time timestamptz,
  close_time timestamptz,
  exit_price numeric,
  pnl_rupees numeric,
  status text default 'active',
  source text default 'mt5',
  lot_size_deviation boolean default false,
  created_at timestamptz default now()
);

alter table trades enable row level security;

create policy "users can only access own trades"
  on trades for all
  using (auth.uid() = user_id);

create index on trades(user_id, status);
create index on trades(user_id, close_time desc);
create table trade_journals (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid references trades(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  reasoning_text text,
  entry_emotion text,
  exit_emotion text,
  reflection_note text,
  streak_counted boolean default false,
  reasoning_added_at timestamptz,
  created_at timestamptz default now()
);

alter table trade_journals enable row level security;

create policy "users can only access own journals"
  on trade_journals for all
  using (auth.uid() = user_id);

create index on trade_journals(user_id, streak_counted);
create table ai_feedback (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid references trades(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  feedback_text text,
  actionable_line text,
  patterns_referenced jsonb,
  read boolean default false,
  generated_at timestamptz default now()
);

alter table ai_feedback enable row level security;

create policy "users can only access own feedback"
  on ai_feedback for all
  using (auth.uid() = user_id);
create table rule_breaks (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid references user_rules(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  trade_id uuid references trades(id),
  cost_rupees numeric,
  broken_at timestamptz default now()
);

alter table rule_breaks enable row level security;

create policy "users can only access own rule breaks"
  on rule_breaks for all
  using (auth.uid() = user_id);

create index on rule_breaks(user_id, broken_at desc);
create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  week_start date,
  headline_text text,
  biggest_insight text,
  pattern_stats jsonb,
  rule_compliance jsonb,
  next_week_focus text,
  report_type text default 'full',
  total_trades integer default 0,
  rule_compliance_rate numeric default 0,
  generated_at timestamptz default now()
);

alter table weekly_reports enable row level security;

create policy "users can only access own reports"
  on weekly_reports for all
  using (auth.uid() = user_id);
create table ai_rule_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  pattern_data jsonb,
  suggested_rule jsonb,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table ai_rule_suggestions enable row level security;

create policy "users can only access own suggestions"
  on ai_rule_suggestions for all
  using (auth.uid() = user_id);
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  razorpay_subscription_id text unique,
  plan text,
  status text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

alter table subscriptions enable row level security;

create policy "users can only access own subscriptions"
  on subscriptions for all
  using (auth.uid() = user_id);
-- USD→INR daily rate cache
-- Required for all ₹ P&L calculations
-- Fetch daily and upsert — no RLS needed (read-only public data)
create table exchange_rates (
  date date primary key,
  usd_inr numeric not null,
  fetched_at timestamptz default now()
);

-- Seed with a safe fallback rate
insert into exchange_rates (date, usd_inr) values (current_date, 83.5)
  on conflict (date) do nothing;
