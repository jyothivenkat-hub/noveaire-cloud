'use client'

import { signIn } from 'next-auth/react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-3xl font-light tracking-tight mb-2">
          <span className="text-accent">Nove</span>aire
        </h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">
          content intelligence
        </p>

        <button
          onClick={() => signIn('twitter', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/[0.05] border border-white/10 rounded-lg text-sm text-white/80 hover:bg-white/[0.08] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Sign in with X
        </button>

        <p className="text-xs text-white/20 mt-8">
          Access is currently invite-only.
        </p>
      </div>
    </div>
  )
}
