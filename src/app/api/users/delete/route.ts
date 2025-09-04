'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const userId = session?.user?.id as string | undefined;
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
