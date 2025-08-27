import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList, type Message } from '@/components/MessagesList';
import { channels } from '@/data/channels';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import { postMessage } from './actions';

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

	const directMessages = [
		{ name: 'Ada Lovelace', status: 'online' as const },
		{ name: 'Linus Torvalds', status: 'away' as const },
		{ name: 'Grace Hopper', status: 'online' as const },
		{ name: 'Margaret Hamilton', status: 'offline' as const },
	];

	const db = await getDb();
	const docs = (await db
		.collection('messages')
		.find({ channelId })
		.sort({ createdAt: 1 })
		.toArray()) as MessageRow[];

	const messages: Message[] = docs.map((d) => ({
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
		<div className="h-svh flex flex-col bg-gradient-to-b from-[#330d38] to-[#230525] text-foreground">
			<GlobalTopBar />
			<div className="flex-1 flex min-h-0 bg-transparent/0">
				<AppNavSidebar />
				<ChannelsSidebar
					channels={channelLinks}
					directMessages={directMessages}
				/>
				<main className="flex-1 flex min-w-0 flex-col bg-[#1a1d21]">
					<ChannelHeader name={channel.name} topic={channel.topic} />
					<MessagesList messages={messages} channelId={channel.id} />
					<Composer
						action={postMessage}
						channelId={channel.id}
						placeholder={`Message #${channel.name}`}
					/>
				</main>
			</div>
		</div>
	);
}
