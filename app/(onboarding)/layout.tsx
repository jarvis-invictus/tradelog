export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-bg flex flex-col lg:items-center lg:justify-center lg:py-12">
      {/* On desktop: fixed-width card centered on screen */}
      <div className="w-full lg:max-w-md lg:bg-ink-surface lg:border lg:border-ink-border lg:rounded-3xl lg:overflow-hidden flex flex-col flex-1 lg:flex-none">
        {children}
      </div>
    </div>
  )
}
