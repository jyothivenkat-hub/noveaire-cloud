import Link from 'next/link'
import { Upload, BarChart3, FlaskConical, Lightbulb, PenTool } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload your data',
    description: 'Export your analytics CSV from any platform and upload it to Noveaire.',
  },
  {
    icon: BarChart3,
    title: 'Get deep analysis',
    description: 'See what works — feature impact, best posting days, top content patterns.',
  },
  {
    icon: FlaskConical,
    title: 'Run AI experiments',
    description: 'Test content strategies with 7 pre-built experiments or write your own.',
  },
  {
    icon: Lightbulb,
    title: 'Get daily suggestions',
    description: 'AI-generated post ideas tailored to your voice and audience.',
  },
  {
    icon: PenTool,
    title: 'Compose with AI',
    description: 'Create threads, replies, and breaking news posts using AI.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-20">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-light tracking-tight mb-2">
          <span className="text-accent">Nove</span>aire
        </h1>
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/30 mb-8">
          content intelligence
        </p>

        <h2 className="text-xl font-light text-white/80 mb-4">
          Turn your social media analytics into actionable content strategy
        </h2>
        <p className="text-white/40 text-sm leading-relaxed mb-12 max-w-lg mx-auto">
          Noveaire analyzes your performance data from X, LinkedIn, Instagram, Threads,
          and more — identifies what makes your content work, and uses AI to
          generate high performing posts matched to your voice and audience.
          Upload a CSV or connect your accounts, get insights in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors"
          >
            Try Demo
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] text-white/60 rounded-lg text-sm hover:bg-white/[0.08] transition-colors"
          >
            Sign in with X
          </Link>
        </div>

        <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8">
          How it works
        </h3>

        <div className="grid gap-6 text-left max-w-lg mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/[0.07] border border-accent/10 flex items-center justify-center">
                <step.icon className="w-4.5 h-4.5 text-accent/60" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-accent/40">{String(i + 1).padStart(2, '0')}</span>
                  <h4 className="text-sm font-medium text-white/80">{step.title}</h4>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <p className="text-xs text-white/20">
            Built with Next.js, Tailwind CSS, and the Anthropic Claude API
          </p>
        </div>
      </div>
    </div>
  )
}
