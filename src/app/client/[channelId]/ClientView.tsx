'use client';

import { DirectMessageUser } from '@/app/api/direct-messages/actions';
import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList, type Message } from '@/components/MessagesList';
import { defaultChannels } from '@/data/channels';
import { authClient } from '@/lib/auth-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

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
	const { id: channelId, name: channelName, topic: channelTopic } = channel;
	const queryClient = useQueryClient();
	const queryKey = useMemo(() => ['messages', channelId] as const, [channelId]);
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
			return (await res.json()) as DirectMessageUser[];
		},
		initialData: directMessages,
		refetchInterval: 20000,
		staleTime: 5000,
	});

	useEffect(() => {
		function computeStatus(lastSeenAt?: string): DirectMessageUser['status'] {
			if (!lastSeenAt) return 'offline';
			const last = new Date(lastSeenAt).getTime();
			if (!last) return 'offline';
			const diff = Date.now() - last;
			if (diff <= 35000) return 'online';
			if (diff <= 5 * 60000) return 'away';
			return 'offline';
		}
		const es = new EventSource('/api/presence/stream');
		es.onmessage = (ev) => {
			try {
				const data = JSON.parse(ev.data) as {
					userId: string;
					status?: DirectMessageUser['status'];
					lastSeenAt?: string;
				};
				const nextStatus = data.status || computeStatus(data.lastSeenAt);
				if (!data.userId || !nextStatus) return;
				queryClient.setQueryData<DirectMessageUser[]>(
					['direct-messages'],
					(prev) => {
						if (!Array.isArray(prev)) return prev;
						let changed = false;
						const updated = prev.map((u) => {
							if (u.id === data.userId && u.status !== nextStatus) {
								changed = true;
								return { ...u, status: nextStatus };
							}
							return u;
						});
						return changed ? updated : prev;
					}
				);
			} catch {}
		};
		es.onerror = () => {
			es.close();
		};
		return () => {
			es.close();
		};
	}, [queryClient]);

	const resolvedName = useMemo(() => {
		if (channelName) return channelName;
		const selfId =
			session?.user.id || session?.user.email || session?.user.name;
		if (!selfId) return '';
		const parts = channelId.split('_');
		if (parts.length !== 2) return '';
		const peerId = parts.find((p) => p !== selfId)
			? parts.find((p) => p !== selfId)
			: selfId;
		const peer = dmList.find((u) => u.id === peerId);
		return peer?.name || '';
	}, [channelName, channelId, dmList, session]);

	const { data: messages = initialMessages } = useQuery({
		queryKey,
		queryFn: async () => {
			const res = await fetch(`/api/channels/${channelId}/messages`);
			if (!res.ok) throw new Error('Failed to load messages');
			return (await res.json()) as Message[];
		},
		initialData: initialMessages,
		staleTime: 5000,
	});

	useEffect(() => {
		const es = new EventSource(`/api/channels/${channelId}/messages/stream`);
		es.onmessage = (ev) => {
			try {
				const data = JSON.parse(ev.data) as {
					type: 'insert' | 'update' | 'delete';
					message?: Message;
					id?: string;
				};
				queryClient.setQueryData<Message[]>(queryKey, (prev) => {
					const current = Array.isArray(prev) ? prev.slice() : [];
					if (data.type === 'insert' && data.message) {
						if (current.some((m) => m._id === data.message!._id))
							return current;
						const tempIndex = current.findIndex(
							(m) =>
								m._id.startsWith('temp-') &&
								m.content === data.message!.content &&
								m.authorId === data.message!.authorId
						);
						if (tempIndex !== -1) current.splice(tempIndex, 1);
						current.push(data.message!);
						return current;
					}
					if (data.type === 'update' && data.message) {
						return current.map((m) =>
							m._id === data.message!._id ? { ...m, ...data.message } : m
						);
					}

					return current;
				});
			} catch {}
		};
		es.onerror = () => {
			es.close();
		};
		return () => {
			es.close();
		};
	}, [channelId, queryClient, queryKey]);

	const sendMutation = useMutation({
		mutationFn: async ({
			content,
			mentions,
		}: {
			content: string;
			mentions?: string[];
		}) => {
			const res = await fetch('/api/messages', {
				method: 'POST',
				body: JSON.stringify({
					channelId,
					content,
					mentions,
					authorName: session?.user.name,
					authorId: session?.user.id,
				}),
			});
			if (!res.ok) throw new Error('Failed to send');
			return (await res.json()) as { id: string };
		},
		onMutate: async ({
			content,
			mentions,
		}: {
			content: string;
			mentions?: string[];
		}) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			const optimistic: Message = {
				_id: `temp-${Date.now()}`,
				authorName: session?.user.name ?? 'Unknown',
				authorId: session?.user.id ?? 'Unknown',
				createdAt: new Date().toISOString(),
				content,
				mentions,
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
				previous.filter((m) => m._id !== id)
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
		mutationFn: async ({
			id,
			content,
			authorId,
		}: {
			id: string;
			content: string;
			authorId: string;
		}) => {
			const res = await fetch(`/api/messages/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ content, authorId }),
			});
			if (!res.ok) throw new Error('Failed to edit');
		},
		onMutate: async ({ id, content }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			queryClient.setQueryData<Message[]>(
				queryKey,
				previous.map((m) => (m._id === id ? { ...m, content } : m))
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

	const isDm = !channelName;
	const firstChannel =
		channelLinks.find((c) => c.id !== channelId) || channelLinks[0];
	const firstChannelHref = firstChannel
		? `/client/${firstChannel.id}`
		: '/client';

	return (
		<div className="h-svh flex flex-col bg-gradient-to-b dark:from-[#330d38] dark:to-[#230525] from-[#390b3a] to-[#370838] text-foreground">
			<GlobalTopBar />
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
							onDelete={(id) => deleteMutation.mutate(id)}
							onEdit={(id, content) =>
								editMutation.mutate({
									id,
									content,
									authorId: session?.user.id ?? '',
								})
							}
							mentionLookup={Object.fromEntries(
								dmList.map((u) => [u.id, u.name])
							)}
							avatarLookup={Object.fromEntries(
								dmList.map((u) => [u.id, u.image])
							)}
						/>
						<Composer
							onSend={(input) => sendMutation.mutate(input)}
							placeholder={`Message #${resolvedName || channelName}`}
							mentionables={dmList.map((u) => ({ id: u.id, name: u.name }))}
						/>
					</main>
				</div>
			</div>
		</div>
	);
}
