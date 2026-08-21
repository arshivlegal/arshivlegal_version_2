import { NextResponse } from 'next/server';

export function middleware(req) {
  // Check if the user has the secure auth cookie
  const isAuthenticated = req.cookies.get('admin_auth')?.value === 'true';
  const path = req.nextUrl.pathname;

  // If they try to access the dashboard without being authenticated, kick them to login
  if (path.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If they are already logged in and try to go to the login page, send them to the dashboard
  if (path === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// Only run middleware on dashboard routes and the login page
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};