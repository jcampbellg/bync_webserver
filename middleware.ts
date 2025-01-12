import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log('Request:', request.url)
  const auhorization = request.headers.get('Authorization')?.replace('Bearer ', '')

  console.log('Authorization:', auhorization)

  if (auhorization !== process.env.TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}