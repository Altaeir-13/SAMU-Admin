import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET || 'samu-admin-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const isAuthPage = request.nextUrl.pathname === '/login';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
