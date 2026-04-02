import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that logged-in users shouldn't access
const authRoutes = ['/login', '/register'];

export default function proxy(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        const { pathname } = request.nextUrl;

        const isAuthRoute = authRoutes.some((route) =>
            pathname.startsWith(route)
        );

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
        '/login',
        '/register',
    ],
};