import { getDirectMessages } from '@/app/api/direct-messages/actions';
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
	author: string;
	createdAt?: Date;
	content?: string;
};

export default async function ChannelPage({ params }: Params) {
	const { channelId } = await params;
	const channel = channels.find((c) => c.id === channelId);
	if (!channel) return notFound();

	const channelLinks = channels;
	const directMessages = await getDirectMessages();

	const db = await getDb();
	const docs = (await db
		.collection('messages')
		.find({ channelId })
		.sort({ createdAt: 1 })
		.toArray()) as MessageRow[];

	const initialMessages: Message[] = docs.map((d) => ({
		id: String(d._id),
		author: d.author,
		timestamp: d.createdAt?.toISOString() ?? '',
		content: d.content ?? '',
	}));

	return (
		<ClientView
			channel={channel}
			channelLinks={channelLinks}
			directMessages={directMessages}
			initialMessages={initialMessages}
		/>
	);
}
