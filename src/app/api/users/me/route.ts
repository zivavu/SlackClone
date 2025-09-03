'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const userId = session?.user?.id as string | undefined;
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const db = await getDb();
	const user = await db
		.collection('user')
		.findOne<{ _id: ObjectId; name?: string; image?: string }>(
			{ _id: new ObjectId(userId) },
			{ projection: { name: 1, image: 1 } }
		);

	return NextResponse.json({
		id: userId,
		name: user?.name || '',
		image: `/api/files/${user?.image}`,
	});
}
