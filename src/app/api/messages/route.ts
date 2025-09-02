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
		mentions: Array.isArray(body.mentions) ? body.mentions : undefined,
		createdAt: new Date(),
	};
	const result = await db.collection('messages').insertOne(doc);

	return NextResponse.json({
		id: String(result.insertedId),
		channelId: body.channelId,
		content: body.content,
		authorName: body.authorName,
		authorId: body.authorId,
		mentions: doc.mentions,
		createdAt: new Date().toISOString(),
	});
}
