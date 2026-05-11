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
