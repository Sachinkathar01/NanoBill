import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/clients', '/items', '/invoices', '/settings'];

// Routes that logged-in users shouldn't access
const authRoutes = ['/login', '/register'];

export default function proxy(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const { pathname } = request.nextUrl;

        const isProtectedRoute = protectedRoutes.some((route) =>
            pathname.startsWith(route)
        );

        const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route)
        );

        // 🚫 If accessing protected route without token → go to login
        if (isProtectedRoute && !token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 🚫 If already logged in and trying to access login/register → go to dashboard
        if (isAuthRoute && token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // ✅ Allow request
        return NextResponse.next();
    } catch (err) {
        return new NextResponse('Internal middleware error', { status: 500 });
    }
}

// 🎯 IMPORTANT: Restrict middleware only to needed routes
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/clients/:path*',
        '/items/:path*',
        '/invoices/:path*',
        '/settings/:path*',
        '/login',
        '/register',
    ],
};