'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/home',       label: 'Home' },
  { href: '/analytics',  label: 'Analytics' },
  { href: '/calculator', label: 'Calc' },
  { href: '/rules',      label: 'Rules' },
  { href: '/report',     label: 'Report' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ink-surface/95 backdrop-blur-md border-t border-ink-border flex pb-safe-bottom">
      {NAV_ITEMS.map(({ href, label }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-3 relative"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />
            )}
            <span
              className={`text-[11px] font-semibold tracking-wide transition-colors ${
                active ? 'text-accent' : 'text-text-tertiary'
              }`}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
