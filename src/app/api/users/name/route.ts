'use server';

import { getUserId } from '@/lib/auth-helpers';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
	const userId = await getUserId(request);
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
