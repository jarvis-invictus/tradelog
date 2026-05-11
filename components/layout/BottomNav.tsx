'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, Calculator, BookMarked, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const NAV_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: '/home',       label: 'Home',      Icon: Home },
  { href: '/analytics',  label: 'Analytics', Icon: BarChart2 },
  { href: '/calculator', label: 'Calc',      Icon: Calculator },
  { href: '/rules',      label: 'Rules',     Icon: BookMarked },
  { href: '/report',     label: 'Report',    Icon: FileText },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur border-t border-gray-800 flex">
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition ${
              active ? 'text-blue-400' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            <span className={`text-[10px] font-medium ${active ? 'text-blue-400' : 'text-gray-600'}`}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
