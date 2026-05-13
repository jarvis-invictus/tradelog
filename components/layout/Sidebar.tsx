'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, Calculator, Shield, BookOpen, Settings } from 'lucide-react'

const NAV = [
  { href: '/home',       label: 'Home',        icon: Home },
  { href: '/journal',    label: 'Journal',     icon: BookOpen },
  { href: '/calculator', label: 'Calculator',  icon: Calculator },
  { href: '/analytics',  label: 'Analytics',   icon: BarChart2 },
  { href: '/rules',      label: 'Rules',       icon: Shield },
  { href: '/settings',   label: 'Settings',    icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-surface-800 border-r border-surface-300 z-40">
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6 border-b border-surface-300">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-brand-400 flex items-center justify-center shrink-0">
            <span className="text-ink-inverse text-[11px] font-black tracking-tighter">TL</span>
          </div>
          <span className="text-ink-primary font-bold text-[15px] tracking-tight">TradeLog</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[4px] text-sm font-medium transition-all duration-150 ${
                active
                  ? 'text-brand-400 bg-brand-400/10'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-surface-300">
        <p className="text-ink-tertiary text-[11px]">TradeLog &copy; 2025</p>
      </div>
    </aside>
  )
}
