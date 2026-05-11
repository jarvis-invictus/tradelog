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
