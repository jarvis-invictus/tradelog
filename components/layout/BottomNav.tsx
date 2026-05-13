'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, Calculator, Shield, BookOpen } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/home',       label: 'Home',        icon: Home },
  { href: '/journal',    label: 'Journal',     icon: BookOpen },
  { href: '/calculator', label: 'Calculator',  icon: Calculator },
  { href: '/analytics',  label: 'Analytics',   icon: BarChart2 },
  { href: '/rules',      label: 'Rules',       icon: Shield },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface-800/95 backdrop-blur-md border-t border-surface-300 flex items-center justify-around px-2 pb-safe">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-4 py-2 text-ink-tertiary hover:text-ink-secondary transition-colors duration-150 min-w-[44px] min-h-[44px]"
          >
            <Icon className={`w-5 h-5 ${active ? 'text-brand-400' : ''}`} />
            <span className={`text-[10px] font-medium ${active ? 'text-brand-400' : ''}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
