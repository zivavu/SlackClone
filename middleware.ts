import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (!pathname.startsWith('/client')) {
		return NextResponse.next();
	}

	const hasAuthCookie = request.cookies
		.getAll()
		.some((c) => c.name.startsWith('better-auth'));

	if (!hasAuthCookie) {
		const url = request.nextUrl.clone();
		url.pathname = '/login';
		url.searchParams.set('redirect', pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/client/:path*'],
};
