'use client'

type Report = {
  id?: string
  user_id?: string
  report_text?: string
  week_start?: string
  created_at?: string
  [key: string]: unknown
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ReportClient({
  reports,
  aiEnabled,
}: {
  reports: Report[]
  aiEnabled: boolean
}) {
  if (!aiEnabled) {
    return (
      <div className="card p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-[4px] bg-surface-600 border border-surface-300 flex items-center justify-center mx-auto">
          <span className="text-2xl">🤖</span>
        </div>
        <p className="text-ink-primary font-semibold">AI Reports not configured</p>
        <p className="text-ink-secondary text-sm max-w-xs mx-auto leading-relaxed">
          Add your <code className="bg-surface-600 px-1 rounded text-brand-400">ANTHROPIC_API_KEY</code> to enable weekly AI performance summaries.
        </p>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="card p-8 text-center space-y-2">
        <p className="text-ink-primary font-semibold">No reports yet</p>
        <p className="text-ink-secondary text-sm leading-relaxed">
          Your first weekly report will be generated automatically every Sunday at 6:30 PM IST.
          <br />You need at least 3 closed trades in a week for a report to be generated.
        </p>
      </div>
    )
  }

  const [latest, ...past] = reports

  return (
    <div className="space-y-4">
      {/* Latest report */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
          <p className="text-ink-primary font-semibold text-sm">Latest report</p>
          {latest.created_at && (
            <p className="text-ink-tertiary text-xs">{fmtDate(latest.created_at as string)}</p>
          )}
        </div>
        <div className="px-4 py-4 prose prose-invert prose-sm max-w-none">
          <pre className="text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {(latest.report_text as string) ?? 'No content available.'}
          </pre>
        </div>
      </div>

      {/* Past reports */}
      {past.length > 0 && (
        <div className="space-y-2">
          <p className="section-label">Past reports</p>
          {past.map((r, i) => (
            <details key={i} className="card overflow-hidden group">
              <summary className="px-4 py-3 flex items-center justify-between cursor-pointer list-none">
                <span className="text-ink-primary text-sm font-medium">
                  Week of {r.week_start ? fmtDate(r.week_start as string) : fmtDate(r.created_at as string)}
                </span>
                <span className="text-ink-tertiary text-xs group-open:hidden">Show</span>
                <span className="text-ink-tertiary text-xs hidden group-open:block">Hide</span>
              </summary>
              <div className="border-t border-surface-300 px-4 py-4">
                <pre className="text-ink-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {(r.report_text as string) ?? 'No content available.'}
                </pre>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
