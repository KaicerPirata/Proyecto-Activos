import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const isPublic = PUBLIC_PATHS.includes(pathname);
    const authCookie = request.cookies.get('itam_auth');

    // Unauthenticated user try private route

    if (!isPublic && !authCookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Authenticated user
    if(authCookie) {
        try {
            const parsed = JSON.parse(decodeURIComponent(authCookie.value));
            const rol = parsed.rol

            // Personal
            if(rol === 'PER' && pathname !== '/assets') {
                return NextResponse.redirect(new URL('/assets', request.url));
            }

            // Technician
            if (rol === 'TEC' && !['/assets', '/users'].includes(pathname)) {
                return NextResponse.redirect(new URL('/assets', request.url));
            }

            // Admin all

        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    // if (isPublic && authCookie) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/:path*'],
};