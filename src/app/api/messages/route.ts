'use server';

import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	if (
		!body ||
		typeof body.channelId !== 'string' ||
		typeof body.content !== 'string'
	) {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
	}
	const author: string = typeof body.author === 'string' ? body.author : 'You';

	const db = await getDb();
	const result = await db.collection('messages').insertOne({
		channelId: body.channelId,
		content: body.content,
		author,
		initials: author
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join(''),
		createdAt: new Date(),
	});

	return NextResponse.json({
		id: String(result.insertedId),
		channelId: body.channelId,
		content: body.content,
		author,
		initials: author
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join(''),
		createdAt: new Date().toISOString(),
	});
}
