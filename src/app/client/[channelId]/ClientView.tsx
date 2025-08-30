'use client';

import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList, type Message } from '@/components/MessagesList';
import { authClient } from '@/lib/auth-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type DirectMessage = { name: string; status: 'online' | 'away' | 'offline' };

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
	const { data: session } = authClient.useSession();

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | null = null;
		const user = session?.user as
			| { id?: string; email?: string; name?: string }
			| undefined;
		const userId = user?.id || user?.email || user?.name;
		if (!userId) return;
		const beat = async () => {
			try {
				await fetch('/api/presence/heartbeat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId }),
				});
			} catch {}
		};
		beat();
		interval = setInterval(beat, 20000);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [session]);

	const { data: dmList = directMessages } = useQuery({
		queryKey: ['direct-messages'],
		queryFn: async () => {
			const res = await fetch('/api/direct-messages');
			if (!res.ok) throw new Error('Failed to load DMs');
			return (await res.json()) as DirectMessage[];
		},
		initialData: directMessages,
		refetchInterval: 20000,
		staleTime: 5000,
	});

	const sendMutation = useMutation({
		mutationFn: async ({ content }: { content: string }) => {
			const res = await fetch('/api/messages', {
				method: 'POST',
				body: JSON.stringify({
					channelId,
					content,
					author: session?.user.name,
				}),
			});
			if (!res.ok) throw new Error('Failed to send');
			return (await res.json()) as { id: string };
		},
		onMutate: async ({ content }: { content: string }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			const optimistic: Message = {
				id: `temp-${Date.now()}`,
				author: session?.user.name ?? 'Unknown',
				initials:
					session?.user.name
						?.split(' ')
						.map((n) => n[0])
						.join('') ?? 'U',
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

	const editMutation = useMutation({
		mutationFn: async ({ id, content }: { id: string; content: string }) => {
			const res = await fetch(`/api/messages/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ content }),
			});
			if (!res.ok) throw new Error('Failed to edit');
		},
		onMutate: async ({ id, content }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			queryClient.setQueryData<Message[]>(
				queryKey,
				previous.map((m) => (m.id === id ? { ...m, content } : m))
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
				<ChannelsSidebar channels={channelLinks} directMessages={dmList} />
				<main className="flex-1 flex min-w-0 flex-col bg-[#1a1d21]">
					<ChannelHeader name={channelName} topic={channelTopic} />
					<MessagesList
						messages={[]}
						onDelete={(id) => deleteMutation.mutate(id)}
						onEdit={(id, content) => editMutation.mutate({ id, content })}
					/>
					<Composer
						onSend={(input) => sendMutation.mutate(input)}
						placeholder={`Message #${channelName}`}
					/>
				</main>
			</div>
		</div>
	);
}
