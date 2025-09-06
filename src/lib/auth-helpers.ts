'use server';

import { auth } from '@/lib/auth';

export async function getUserId(request: Request): Promise<string | null> {
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const userId = session?.user?.id as string | undefined;
	return userId ?? null;
}
