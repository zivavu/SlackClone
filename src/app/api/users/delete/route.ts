'use server';

import { getUserId } from '@/lib/auth-helpers';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
	const userId = await getUserId(request);
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const db = await getDb();

	await db.collection('user').deleteOne({ _id: new ObjectId(userId) });
	await db.collection('presence').deleteMany({ userId });
	await db
		.collection('message')
		?.deleteMany?.({ authorId: userId })
		.catch(() => {});

	return NextResponse.json({ ok: true });
}
