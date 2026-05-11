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
