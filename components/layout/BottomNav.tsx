'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/home',       label: 'Home',       icon: '🏠' },
  { href: '/analytics',  label: 'Analytics',  icon: '📊' },
  { href: '/calculator', label: 'Calc',        icon: '🧮' },
  { href: '/rules',      label: 'Rules',       icon: '📋' },
  { href: '/report',     label: 'Report',      icon: '📄' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 flex">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition ${
              active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
