'use server';

import { Message } from '@/components/MessagesList';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export type PostMessageInput = {
	channelId: string;
	content: string;
	author?: string;
};

export async function postMessage({
	channelId,
	content,
	author,
}: PostMessageInput) {
	const resolvedAuthor = author ?? 'You';
	if (!channelId || !content) {
		throw new Error('Invalid input');
	}

	const db = await getDb();
	const messages = db.collection('messages');
	await messages.insertOne({
		channelId,
		content,
		author: resolvedAuthor,
		initials: resolvedAuthor
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join(''),
		createdAt: new Date(),
	});

	revalidatePath(`/client/${channelId}`);
}

export type DeleteMessageInput = { channelId: string; messageId: string };

export async function deleteMessage({
	channelId,
	messageId,
}: DeleteMessageInput) {
	if (!channelId || !messageId) {
		throw new Error('Invalid input');
	}

	const db = await getDb();
	await db
		.collection('messages')
		.deleteOne({ _id: new ObjectId(messageId), channelId });
	revalidatePath(`/client/${channelId}`);
}

export async function fetchMessages(channelId: string): Promise<Message[]> {
	const res = await fetch(`/api/channels/${channelId}/messages`, {
		cache: 'no-store',
	});
	if (!res.ok) throw new Error('Failed to load');
	const data = (await res.json()) as Array<{
		id: string;
		author: string;
		initials: string;
		timestamp: string;
		content: string;
	}>;
	return data.map((d) => ({
		id: d.id,
		author: d.author,
		initials: d.initials,
		timestamp: new Date(d.timestamp).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		}),
		content: d.content,
	}));
}
