import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Noveaire — Content Intelligence',
  description: 'AI-powered social media content analysis and generation platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
