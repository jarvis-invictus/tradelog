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
