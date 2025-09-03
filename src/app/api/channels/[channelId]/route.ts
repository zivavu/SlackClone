'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(
	_request: Request,
	context: { params: Promise<{ channelId: string }> }
) {
	const { channelId } = await context.params;
	if (!channelId)
		return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });
	const db = await getDb();
	await db.collection('channels').deleteOne({ _id: new ObjectId(channelId) });
	await db.collection('messages').deleteMany({ channelId });
	return NextResponse.json({ ok: true });
}
