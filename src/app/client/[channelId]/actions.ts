'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export async function postMessage(formData: FormData) {
	const channelId = formData.get('channelId');
	const content = formData.get('content');
	const author = formData.get('author') || 'You';
	if (typeof channelId !== 'string' || typeof content !== 'string') {
		throw new Error('Invalid form data');
	}
	console.log('channelId', channelId);
	console.log('content', content);
	console.log('author', author);

	const db = await getDb();
	const messages = db.collection('messages');
	await messages.insertOne({
		channelId,
		content,
		author,
		initials: (author as string)
			.split(' ')
			.map((s) => s[0])
			.slice(0, 2)
			.join(''),
		createdAt: new Date(),
	});

	revalidatePath(`/client/${channelId}`);
}

export async function deleteMessage(formData: FormData) {
	const channelId = formData.get('channelId');
	const messageId = formData.get('messageId');
	if (typeof channelId !== 'string' || typeof messageId !== 'string') {
		throw new Error('Invalid form data');
	}

	const db = await getDb();
	await db
		.collection('messages')
		.deleteOne({ _id: new ObjectId(messageId), channelId });
	revalidatePath(`/client/${channelId}`);
}
