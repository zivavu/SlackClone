import { getChannelMessages } from '@/app/api/channels/[channelId]/messages/actions';
import { getDirectMessages } from '@/app/api/direct-messages/actions';
import { channels } from '@/data/channels';
import { notFound } from 'next/navigation';
import ClientView from './ClientView';

type Params = {
	params: Promise<{ channelId: string }>;
};

export default async function ChannelPage({ params }: Params) {
	const { channelId } = await params;
	const channel = channels.find((c) => c.id === channelId);
	if (!channel) return notFound();

	const channelLinks = channels;
	const directMessages = await getDirectMessages();

	const initialMessages = await getChannelMessages(channelId);

	return (
		<ClientView
			channel={channel}
			channelLinks={channelLinks}
			directMessages={directMessages}
			initialMessages={initialMessages}
		/>
	);
}
