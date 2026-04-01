import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require standard JWT authentication
const protectedRoutes = ['/dashboard', '/clients', '/items', '/invoices', '/settings'];

// Routes that logged-in users shouldn't access (like re-logging in)
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const { pathname } = request.nextUrl;

        // Debug logging (remove in production)
        // console.log('[Proxy] Path:', pathname, '| Token:', token ? 'present' : 'absent');

        const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
        const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

        // If trying to access protected route without token, bounce to login
        if (isProtectedRoute && !token) {
            // console.warn('[Proxy] Protected route, no token. Redirecting to /login');
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // If trying to hit login/register but already authenticated, bounce to dashboard
        if (isAuthRoute && token) {
            // console.warn('[Proxy] Auth route, but token present. Redirecting to /dashboard');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Otherwise, proceed neutrally
        return NextResponse.next();
    } catch (err) {
        // console.error('[Proxy] Error:', err);
        return new NextResponse('Internal proxy error', { status: 500 });
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
