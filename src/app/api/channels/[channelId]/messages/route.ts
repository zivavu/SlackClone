'use server';

import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(
	_req: Request,
	context: { params: Promise<{ channelId: string }> }
) {
	const { channelId } = await context.params;
	if (!channelId)
		return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });
	const db = await getDb();
	const docs = await db
		.collection('messages')
		.find({ channelId })
		.sort({ createdAt: 1 })
		.toArray();
	return NextResponse.json(
		docs.map((d) => ({
			id: String(d._id),
			author: d.author ?? 'Unknown',
			initials:
				typeof d.initials === 'string' && d.initials.length > 0
					? d.initials
					: String(d.author ?? 'U')
							.split(' ')
							.map((n: string) => n[0])
							.slice(0, 2)
							.join(''),
			timestamp: new Date(d.createdAt ?? Date.now()).toISOString(),
			content: d.content ?? '',
		}))
	);
}
