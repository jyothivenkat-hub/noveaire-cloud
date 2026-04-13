import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-light tracking-tight mb-2">
          <span className="text-accent">Nove</span>aire
        </h1>
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/30 mb-8">
          content intelligence
        </p>
        <p className="text-white/50 text-sm leading-relaxed mb-10">
          Analyze your Twitter data, run AI experiments on your content, and generate
          high-performing posts with Claude.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors"
        >
          Sign in with X
        </Link>
      </div>
    </div>
  )
}
