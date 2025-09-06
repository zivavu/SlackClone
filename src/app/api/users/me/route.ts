'use server';

import { getUserId } from '@/lib/auth-helpers';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const userId = await getUserId(request);
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
		image: user?.image,
	});
}
