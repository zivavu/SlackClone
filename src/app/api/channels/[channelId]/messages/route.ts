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
			timestamp: new Date(d.createdAt ?? Date.now()).toISOString(),
			content: d.content ?? '',
		}))
	);
}
