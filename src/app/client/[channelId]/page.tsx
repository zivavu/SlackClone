import { type Message } from '@/components/MessagesList';
import { channels } from '@/data/channels';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import ClientView from './ClientView';

type Params = {
	params: Promise<{ channelId: string }>;
};

type MessageRow = {
	_id: ObjectId;
	author?: string;
	initials?: string;
	createdAt?: Date | string | number;
	content?: string;
};

export default async function ChannelPage({ params }: Params) {
	const { channelId } = await params;
	const channel = channels.find((c) => c.id === channelId);
	if (!channel) return notFound();

	const channelLinks = channels.map((c) => ({ id: c.id, name: c.name }));
	let directMessages: {
		name: string;
		status: 'online' | 'away' | 'offline';
	}[] = [];
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/direct-messages`,
			{
				next: { revalidate: 0 },
				cache: 'no-store',
			}
		);
		if (res.ok) {
			directMessages = (await res.json()) as typeof directMessages;
		}
	} catch {}

	const db = await getDb();
	const docs = (await db
		.collection('messages')
		.find({ channelId })
		.sort({ createdAt: 1 })
		.toArray()) as MessageRow[];

	const initialMessages: Message[] = docs.map((d) => ({
		id: String(d._id),
		author: d.author ?? 'Unknown',
		initials:
			d.initials && d.initials.length > 0
				? d.initials
				: String(d.author ?? 'U')
						.split(' ')
						.map((n: string) => n[0])
						.slice(0, 2)
						.join(''),
		timestamp: new Date(d.createdAt ?? Date.now()).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
		}),
		content: d.content ?? '',
	}));

	return (
		<ClientView
			channelId={channel.id}
			channelName={channel.name}
			channelTopic={channel.topic}
			channelLinks={channelLinks}
			directMessages={directMessages}
			initialMessages={initialMessages}
		/>
	);
}
