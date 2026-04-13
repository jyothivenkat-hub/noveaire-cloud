import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Demo mode: no auth, redirect login to dashboard
export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
