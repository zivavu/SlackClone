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
