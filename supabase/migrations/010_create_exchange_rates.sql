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
