import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import PAGE_URL from './constants/page.constant';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const session = await getToken({ req });
  if (!session && !path.includes('/auth')) {
    return NextResponse.redirect(new URL(PAGE_URL.SIGN_IN, req.url));
  } else if (session && path === PAGE_URL.SIGN_IN) {
    return NextResponse.redirect(new URL(PAGE_URL.HOME, req.url));
  }

  if (session && path === PAGE_URL.HOME) {
    return NextResponse.redirect(new URL(PAGE_URL.WORKOUTS, req.url));
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json).*)',
  ],
};
