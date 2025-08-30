'use client';

import type { Message } from '@/components/MessagesList';

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
