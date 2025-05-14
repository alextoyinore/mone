import { NextResponse } from 'next/server';

const AUTH_ROUTES = ['/auth/login', '/auth/signup'];
const PROTECTED_ROUTES = ['/upload', '/profile', '/settings'];

// Helper to parse secure authentication cookie
function parseSecureAuthCookie(cookieString) {
  try {
    if (!cookieString) return null;
    const decodedCookie = decodeURIComponent(cookieString);
    const parsedUser = JSON.parse(decodedCookie);
    
    // Validate parsed user has essential fields
    if (parsedUser && parsedUser.uid) {
      return parsedUser;
    }
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
  }
  return null;
}

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const authCookie = request.cookies.get('xito_auth')?.value;
  const isAuth = parseSecureAuthCookie(authCookie);

  // If trying to access login/signup while already authenticated, redirect to home
  if (AUTH_ROUTES.includes(path) && isAuth) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access protected routes without authentication, redirect to login
  if (PROTECTED_ROUTES.includes(path) && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/upload', '/profile', '/settings']
}
