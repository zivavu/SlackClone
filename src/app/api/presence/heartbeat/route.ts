'use server';

import { getUserId } from '@/lib/auth-helpers';
import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const db = await getDb();
	const userId = await getUserId(request);
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}
	await db
		.collection('presence')
		.updateOne(
			{ userId },
			{ $set: { userId, lastSeenAt: new Date() } },
			{ upsert: true }
		);
	return NextResponse.json({ ok: true });
}
