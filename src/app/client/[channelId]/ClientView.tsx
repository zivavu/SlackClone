'use client';

import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar/ChannelsSidebar';
import { MobileChannelsSidebar } from '@/components/ChannelsSidebar/MobileChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList } from '@/components/MessagesList';
import { defaultChannels } from '@/data/channels';
import { useChannelMessages } from '@/hooks/useChannelMessages';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { usePresenceHeartbeat } from '@/hooks/usePresenceHeartbeat';
import { authClient } from '@/lib/auth-client';
import type { DirectMessageUser, Message } from '@/types/chat';
import { useMemo, useState } from 'react';

export default function ClientView({
	channel,
	channelLinks,
	directMessages,
	initialMessages,
}: {
	channel: { id: string; name: string; topic?: string };
	channelLinks: { id: string; name: string }[];
	directMessages: DirectMessageUser[];
	initialMessages: Message[];
}) {
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const { id: channelId, name: channelName, topic: channelTopic } = channel;
	const { data: session } = authClient.useSession();

	const user = session?.user as
		| { id?: string; email?: string; name?: string }
		| undefined;
	const heartbeatUserId = user?.id || user?.email || user?.name;
	usePresenceHeartbeat(heartbeatUserId);

	const dmList = useDirectMessages(directMessages) || directMessages;

	const resolvedName = useMemo(() => {
		if (channelName) return channelName;
		const selfId = session?.user.id;
		if (!selfId) return '';
		const parts = channelId.split('_');
		if (parts.length !== 2) return '';
		const peerId = parts.find((p) => p !== selfId)
			? parts.find((p) => p !== selfId)
			: selfId;
		const peer = dmList.find((u) => u.id === peerId);
		return peer?.name || '';
	}, [channelName, channelId, dmList, session]);

	const { messages, sendMessage, deleteMessage, editMessage } =
		useChannelMessages({
			channelId,
			initialMessages,
			authorId: session?.user.id,
			authorName: session?.user.name,
		});

	const isDm = !channelName;
	const firstChannel =
		channelLinks.find((c) => c.id !== channelId) || channelLinks[0];
	const firstChannelHref = firstChannel
		? `/client/${firstChannel.id}`
		: '/client';

	return (
		<div className="h-svh flex flex-col bg-gradient-to-b dark:from-[#330d38] dark:to-[#230525] from-[#390b3a] to-[#370838] text-foreground">
			<GlobalTopBar
				onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
			/>
			<MobileChannelsSidebar
				isOpen={mobileSidebarOpen}
				onClose={() => setMobileSidebarOpen(false)}
				channels={channelLinks}
				directMessages={dmList}
			/>
			<div className="flex-1 flex min-h-0 mb-1">
				<AppNavSidebar />
				<div className="flex-1 flex dark:border border-border rounded-sm overflow-hidden">
					<ChannelsSidebar channels={channelLinks} directMessages={dmList} />
					<main className="flex-1 flex min-w-0 flex-col bg-card mr-1">
						<ChannelHeader
							name={resolvedName || channelName}
							topic={channelTopic}
							channelId={isDm ? undefined : channelId}
							canDelete={
								!isDm && !defaultChannels.some((c) => c.name === channelName)
							}
							firstChannelHref={firstChannelHref}
						/>
						<MessagesList
							messages={messages}
							onDeleteAction={(id) => deleteMessage(id)}
							onEditAction={(id, content) => editMessage(id, content)}
							mentionLookup={Object.fromEntries(
								dmList.map((u) => [u.id, u.name])
							)}
							avatarLookup={Object.fromEntries(
								dmList.map((u) => [u.id, u.image])
							)}
						/>
						<Composer
							onSend={(input) => sendMessage(input)}
							placeholder={`Message #${resolvedName || channelName}`}
							mentionables={dmList.map((u) => ({ id: u.id, name: u.name }))}
						/>
					</main>
				</div>
			</div>
		</div>
	);
}
