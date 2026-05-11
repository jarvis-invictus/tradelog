// M6.1 — Dashboard (full implementation in M6.1). Responsive shell placeholder.
export default function HomePage() {
  return (
    <div className="py-6 lg:py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-text-secondary text-[13px] mt-1">Your trading overview</p>
      </div>

      {/* Stat cards — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Today's P&L",   value: '—',   color: 'text-text-primary' },
          { label: 'Win rate',       value: '—',   color: 'text-text-primary' },
          { label: 'Trades today',   value: '—',   color: 'text-text-primary' },
          { label: 'Current streak', value: '—',   color: 'text-text-primary' },
        ].map((s) => (
          <div key={s.label} className="card-hover p-4">
            <p className="text-text-tertiary text-[11px] font-medium uppercase tracking-wider mb-2">{s.label}</p>
            <p className="stat-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Two-column on desktop: recent trades + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <p className="text-text-primary font-semibold text-[14px] mb-4">Recent trades</p>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-text-tertiary text-[13px]">No trades yet</p>
            <p className="text-text-tertiary text-[12px] mt-1">Connect MT5 or log a trade manually</p>
          </div>
        </div>
        <div className="card p-5">
          <p className="text-text-primary font-semibold text-[14px] mb-4">Quick actions</p>
          <div className="flex flex-col gap-2">
            {['Log a trade', 'Open calculator', 'View rules'].map((a) => (
              <button key={a} className="w-full text-left px-4 py-3 rounded-xl bg-ink-muted hover:bg-ink-border text-text-secondary text-[13px] transition-colors">
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
