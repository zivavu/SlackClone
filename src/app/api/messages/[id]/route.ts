'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(
	_request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const db = await getDb();
	await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
	return NextResponse.json({ ok: true });
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const body = await request.json().catch(() => null);
	if (!body || typeof body.content !== 'string') {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
	}
	const db = await getDb();
	await db
		.collection('messages')
		.updateOne({ _id: new ObjectId(id) }, { $set: { content: body.content } });
	return NextResponse.json({ ok: true });
}
