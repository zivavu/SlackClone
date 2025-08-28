'use client';

import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList, type Message } from '@/components/MessagesList';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type DirectMessage = { name: string; status: 'online' | 'away' | 'offline' };

async function fetchMessages(channelId: string): Promise<Message[]> {
	const res = await fetch(`/api/channels/${channelId}/messages`, {
		cache: 'no-store',
	});
	if (!res.ok) throw new Error('Failed to load');
	const data = (await res.json()) as Array<{
		id: string;
		author: string;
		initials: string;
		timestamp: string; // ISO
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

export default function ClientView({
	channelId,
	channelName,
	channelTopic,
	channelLinks,
	directMessages,
	initialMessages,
}: {
	channelId: string;
	channelName: string;
	channelTopic?: string;
	channelLinks: { id: string; name: string }[];
	directMessages: DirectMessage[];
	initialMessages: Message[];
}) {
	const queryClient = useQueryClient();
	const queryKey = ['messages', channelId];

	const { data: messages = initialMessages } = useQuery({
		queryKey,
		queryFn: () => fetchMessages(channelId),
		initialData: initialMessages,
		staleTime: 5_000,
	});

	const sendMutation = useMutation({
		mutationFn: async (content: string) => {
			const res = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ channelId, content, author: 'You' }),
			});
			if (!res.ok) throw new Error('Failed to send');
			return (await res.json()) as { id: string };
		},
		onMutate: async (content: string) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			const optimistic: Message = {
				id: `temp-${Date.now()}`,
				author: 'You',
				initials: 'Y',
				timestamp: new Date().toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
				}),
				content,
			};
			queryClient.setQueryData<Message[]>(queryKey, [...previous, optimistic]);
			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous)
				queryClient.setQueryData(queryKey, context.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete');
		},
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			queryClient.setQueryData<Message[]>(
				queryKey,
				previous.filter((m) => m.id !== id)
			);
			return { previous };
		},
		onError: (_err, _vars, context) => {
			if (context?.previous)
				queryClient.setQueryData(queryKey, context.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

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
					<ChannelHeader name={channelName} topic={channelTopic} />
					<MessagesList
						messages={messages}
						onDelete={(id) => deleteMutation.mutate(id)}
					/>
					<Composer
						onSend={(content) => sendMutation.mutate(content)}
						channelId={channelId}
						placeholder={`Message #${channelName}`}
					/>
				</main>
			</div>
		</div>
	);
}
