'use client'

import { User } from 'lucide-react'

export function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
        <User className="w-3.5 h-3.5 text-accent/50" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 truncate">Demo User</p>
      </div>
    </div>
  )
}
