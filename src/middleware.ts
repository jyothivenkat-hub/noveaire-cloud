import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dev mode: bypass auth — all routes accessible
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Redirect landing page to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
