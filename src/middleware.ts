import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/client'];
const authRoutes = ['/signin', '/signup'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const sessionToken =
		request.cookies.get('better-auth.session_token') ??
		request.cookies.get('__Secure-better-auth.session_token');

	if (protectedRoutes.some((route) => pathname.startsWith(route))) {
		if (!sessionToken) {
			return NextResponse.redirect(new URL('/signin', request.url));
		}
	}

	if (authRoutes.some((route) => pathname.startsWith(route))) {
		if (sessionToken) {
			return NextResponse.redirect(new URL('/client', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
