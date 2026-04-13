'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

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

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/20">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent hover:bg-accent/20 transition-colors"
        >
          Try Demo Mode
        </Link>
        <p className="text-xs text-white/20 mt-3">
          Explore the dashboard with sample data — no account needed.
        </p>
      </div>
    </div>
  )
}
