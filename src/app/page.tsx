import { AppNavSidebar } from '../components/AppNavSidebar';
import { ChannelHeader } from '../components/ChannelHeader';
import { ChannelsSidebar } from '../components/ChannelsSidebar';
import { Composer } from '../components/Composer';
import { GlobalTopBar } from '../components/GlobalTopBar';
import { MessagesList } from '../components/MessagesList';

export default function ClientPage() {
	const channels = [
		'general',
		'random',
		'announcements',
		'design',
		'engineering',
	];
	type DirectMessageStatus = 'online' | 'away' | 'offline';
	const directMessages: { name: string; status: DirectMessageStatus }[] = [
		{ name: 'Ada Lovelace', status: 'online' },
		{ name: 'Linus Torvalds', status: 'away' },
		{ name: 'Grace Hopper', status: 'online' },
		{ name: 'Margaret Hamilton', status: 'offline' },
	];
	const messages = [
		{
			id: 1,
			author: 'Ada Lovelace',
			initials: 'AL',
			timestamp: '9:12 AM',
			content:
				'Morning! Shipping the redesign today. Check #announcements for the rollout plan.',
		},
		{
			id: 2,
			author: 'Linus Torvalds',
			initials: 'LT',
			timestamp: '9:18 AM',
			content:
				'Reviewed the PR. Left a couple of comments about error handling and tests.',
		},
		{
			id: 3,
			author: 'Grace Hopper',
			initials: 'GH',
			timestamp: '9:26 AM',
			content: "Compiler is green. Let's go. 🚀",
		},
	];

	return (
		<div className="h-svh flex flex-col bg-gradient-to-b from-[#330d38] to-[#230525] text-foreground">
			<GlobalTopBar />

			<div className="flex-1 flex min-h-0 bg-transparent/0">
				<AppNavSidebar />

				<ChannelsSidebar channels={channels} directMessages={directMessages} />

				<main className="flex-1 flex min-w-0 flex-col bg-[#1a1d21]">
					<ChannelHeader />

					<MessagesList messages={messages} />

					<Composer placeholder="Message #general" />
				</main>
			</div>
		</div>
	);
}
