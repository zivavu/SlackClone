import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (!pathname.startsWith('/client')) {
		return NextResponse.next();
	}

	const sessionToken = request.cookies.get('better-auth.session_token');

	if (!sessionToken) {
		const url = request.nextUrl.clone();
		url.pathname = '/signin';
		url.searchParams.set('redirect', pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
