import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatProps {
  label: string
  value: string | number
  icon: LucideIcon
  className?: string
}

export function Stat({ label, value, icon: Icon, className }: StatProps) {
  return (
    <div className={cn('glass rounded-xl p-5 neo-shadow', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
        <Icon className="w-4 h-4 text-accent/60" />
      </div>
      <p className="text-2xl font-light tracking-tight">{value}</p>
    </div>
  )
}
