import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Ensure trailing slashes are removed (Next.js default behavior usually handles this,
  // but just to be safe for SEO juice)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    return NextResponse.redirect(url, 301) // 301 is crucial for SEO
  }

  // Old Wix URLs with accented characters → new clean URLs
  const redirects: Record<string, string> = {
    "/mentions-légales": "/mentions-legales",
    "/politique-de-confidentialité": "/politique-de-confidentialite",
  }

  if (redirects[url.pathname]) {
    url.pathname = redirects[url.pathname]
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
