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
