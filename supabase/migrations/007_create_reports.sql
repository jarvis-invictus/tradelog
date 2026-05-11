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
