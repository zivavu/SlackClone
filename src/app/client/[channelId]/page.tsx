import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList } from '@/components/MessagesList';
import { channels } from '@/data/channels';
import { notFound } from 'next/navigation';

type Params = {
	params: Promise<{ channelId: string }>;
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

	const messages = [
		{
			id: 1,
			author: 'Ada Lovelace',
			initials: 'AL',
			timestamp: '9:12 AM',
			content: `Welcome to #${channel.name}! This is now routed by UUID: ${channel.id}`,
		},
	];

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
					<MessagesList messages={messages} />
					<Composer placeholder={`Message #${channel.name}`} />
				</main>
			</div>
		</div>
	);
}
