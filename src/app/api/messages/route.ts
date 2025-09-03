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

	const db = await getDb();
	const doc = {
		channelId: body.channelId,
		content: body.content,
		authorName: body.authorName,
		authorId: body.authorId,
		image: body.image,
		mentions: Array.isArray(body.mentions) ? body.mentions : undefined,
		createdAt: new Date(),
	};
	await db.collection('messages').insertOne(doc);
}
