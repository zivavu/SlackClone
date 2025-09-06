'use server';

import { getDb } from '@/lib/mongodb';
import type { Message } from '@/types/chat';

export async function getChannelMessages(
	channelId: string
): Promise<Message[]> {
	const db = await getDb();
	const docs = (await db
		.collection('messages')
		.find({ channelId })
		.sort({ createdAt: 1 })
		.toArray()) as unknown as Message[];
	const messages = docs.map((d) => ({
		...d,
		_id: d._id.toString(),
	}));
	return messages;
}
