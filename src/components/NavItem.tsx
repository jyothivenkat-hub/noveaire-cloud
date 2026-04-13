'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200',
        isActive
          ? 'bg-white/[0.08] text-accent'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  )
}
