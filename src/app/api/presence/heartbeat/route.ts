'use server';

import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const db = await getDb();
	const body = await request.json().catch(() => null);
	if (!body || typeof body.userId !== 'string') {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
	}
	await db
		.collection('presence')
		.updateOne(
			{ userId: body.userId },
			{ $set: { userId: body.userId, lastSeenAt: new Date() } },
			{ upsert: true }
		);
	return NextResponse.json({ ok: true });
}
