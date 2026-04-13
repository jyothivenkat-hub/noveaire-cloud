'use client'

import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function UserMenu() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <div className="flex items-center gap-3">
      {session.user.image && (
        <img
          src={session.user.image}
          alt=""
          className="w-7 h-7 rounded-full opacity-60"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 truncate">
          {session.user.name || 'User'}
        </p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
        title="Sign out"
      >
        <LogOut className="w-3.5 h-3.5 text-white/30" />
      </button>
    </div>
  )
}
