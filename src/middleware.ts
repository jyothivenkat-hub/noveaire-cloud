import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Dev mode: bypass auth — all routes accessible
export default function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
