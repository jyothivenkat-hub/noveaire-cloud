'use client'

import { NavItem } from './NavItem'
import { UserMenu } from './UserMenu'
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  FlaskConical,
  Lightbulb,
  PenTool,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/analysis', label: 'Analysis', icon: BarChart3 },
  { href: '/experiments', label: 'Experiments', icon: FlaskConical },
  { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
  { href: '/compose', label: 'Compose', icon: PenTool },
]

export function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-white/[0.06] flex flex-col">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-medium tracking-tight">
            <span className="text-accent">Nove</span>aire
          </h1>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent/70">
            Demo
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">
          content intelligence
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <UserMenu />
      </div>
    </aside>
  )
}
