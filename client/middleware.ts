import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require standard JWT authentication
const protectedRoutes = ['/dashboard', '/clients', '/items', '/invoices', '/settings'];

// Routes that logged-in users shouldn't access (like re-logging in)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  try {
    // Your backend sends an HTTP-only cookie named "token".
    // The middleware intercepts this to determine access.
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Debug logging (remove in production)
    console.log('[Middleware] Path:', pathname, '| Token:', token ? 'present' : 'absent');

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // If trying to access protected route without token, bounce to login
    if (isProtectedRoute && !token) {
      console.warn('[Middleware] Protected route, no token. Redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If trying to hit login/register but already authenticated, bounce to dashboard
    if (isAuthRoute && token) {
      console.warn('[Middleware] Auth route, but token present. Redirecting to /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Otherwise, proceed neutrally
    return NextResponse.next();
  } catch (err) {
    // Log the error for debugging
    console.error('[Middleware] Error:', err);
    // Optionally, redirect to a generic error page or return a response
    return new NextResponse('Internal middleware error', { status: 500 });
  }
}

// Config matcher ensures we don't accidentally intercept APIs or Static Files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
