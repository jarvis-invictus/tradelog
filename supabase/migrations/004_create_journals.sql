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
