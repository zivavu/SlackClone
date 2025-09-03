import { getChannelMessages } from '@/app/api/channels/[channelId]/messages/actions';
import { getChannels } from '@/app/api/channels/actions';
import { getDirectMessages } from '@/app/api/direct-messages/actions';
import ClientView from './ClientView';

type Params = {
	params: Promise<{ channelId: string }>;
};

export default async function ChannelPage({ params }: Params) {
	const { channelId } = await params;
	const channelLinks = await getChannels();
	const channel =
		channelLinks.find((c) => c.id === channelId) ||
		({ id: channelId, name: '' } as {
			id: string;
			name: string;
			topic?: string;
		});

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
