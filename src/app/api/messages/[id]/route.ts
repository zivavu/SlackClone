'use server';

import { auth } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(
	request: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const requesterId = session?.user?.id as string | undefined;
	if (!requesterId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const db = await getDb();
	const msg = await db
		.collection('messages')
		.findOne<{ authorId?: string }>({ _id: new ObjectId(id) });
	if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	if (requesterId !== msg.authorId) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	await db.collection('messages').deleteOne({ _id: new ObjectId(id) });
	return NextResponse.json({ ok: true });
}

export async function PATCH(
	request: Request,
	context: { params: Promise<{ id: string; authorId: string }> }
) {
	const { id } = await context.params;
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
	const body = await request.json().catch(() => null);
	if (!body || typeof body.content !== 'string') {
		return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
	}
	const session = await auth.api
		.getSession({ headers: request.headers })
		.catch(() => null);
	const requesterId = session?.user?.id as string | undefined;
	if (!requesterId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	if (requesterId !== body.authorId) {
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
	}
	const db = await getDb();
	await db
		.collection('messages')
		.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { content: body.content, updatedAt: new Date() } }
		);
	return NextResponse.json({ ok: true });
}
