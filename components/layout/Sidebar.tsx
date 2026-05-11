'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/home',       label: 'Home' },
  { href: '/analytics',  label: 'Analytics' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/rules',      label: 'Rules' },
  { href: '/report',     label: 'Reports' },
  { href: '/settings',   label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-ink-surface border-r border-ink-border z-40" style={{boxShadow:'4px 0 24px rgba(0,0,0,0.4)'}}>
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6 border-b border-ink-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center shrink-0" style={{boxShadow:'0 0 10px rgba(76,110,245,0.4)'}}>
            <span className="text-white text-[11px] font-black tracking-tighter">TL</span>
          </div>
          <span className="text-text-primary font-bold text-[15px] tracking-tight">TradeLog</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-ink-muted'
              }`}
              style={active ? {
                background: 'linear-gradient(90deg, rgba(76,110,245,0.12) 0%, rgba(76,110,245,0.04) 100%)',
                boxShadow: 'inset 2px 0 0 #4C6EF5',
              } : undefined}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-ink-border">
        <p className="text-text-tertiary text-[11px]">TradeLog &copy; 2025</p>
      </div>
    </aside>
  )
}
