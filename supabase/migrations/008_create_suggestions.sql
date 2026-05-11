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
