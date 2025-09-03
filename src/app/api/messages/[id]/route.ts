'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const db = await getDb();
	const msg = await db
		.collection('messages')
		.findOne<{ authorId?: string }>({ _id: new ObjectId(id) });
	if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	const requesterId = request.headers.get('x-user-id') || '';

	if (!requesterId || requesterId !== msg.authorId) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
	return NextResponse.json({ ok: true });
}

export async function PATCH(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const body = await request.json().catch(() => null);
	if (!body || typeof body.content !== 'string') {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
	}
	const db = await getDb();
	const msg = await db
		.collection('messages')
		.findOne<{ authorId?: string }>({ _id: new ObjectId(id) });
	if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	const requesterId = request.headers.get('x-user-id') || '';
	if (!requesterId || requesterId !== msg.authorId) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	await db
		.collection('messages')
		.updateOne({ _id: new ObjectId(id) }, { $set: { content: body.content } });
	return NextResponse.json({ ok: true });
}
