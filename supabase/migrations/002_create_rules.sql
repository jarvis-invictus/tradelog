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
