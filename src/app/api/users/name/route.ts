'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const userId = session?.user?.id as string | undefined;
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = (await request.json().catch(() => null)) as {
		name?: string;
	} | null;
	if (!body || typeof body.name !== 'string' || !body.name.trim()) {
		return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
	}

	const db = await getDb();
	await db
		.collection('user')
		.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { name: body.name.trim() } }
		);

	return NextResponse.json({ ok: true });
}
