import type { Message } from '@/components/MessagesList';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

type SendArgs = { content: string; mentions?: string[] };

export function useChannelMessages(params: {
	channelId: string;
	initialMessages: Message[];
	authorId?: string;
	authorName?: string;
}) {
	const { channelId, initialMessages, authorId, authorName } = params;
	const queryClient = useQueryClient();
	const queryKey = useMemo(() => ['messages', channelId] as const, [channelId]);

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
		mutationFn: async ({ content, mentions }: SendArgs) => {
			const res = await fetch('/api/messages', {
				method: 'POST',
				body: JSON.stringify({
					channelId,
					content,
					mentions,
					authorName,
					authorId,
				}),
			});
			if (!res.ok) throw new Error('Failed to send');
			return (await res.json()) as { id: string };
		},
		onMutate: async ({ content, mentions }: SendArgs) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData<Message[]>(queryKey) || [];
			const optimistic: Message = {
				_id: `temp-${Date.now()}`,
				authorName: authorName ?? 'Unknown',
				authorId: authorId ?? 'Unknown',
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
		mutationFn: async ({ id, content }: { id: string; content: string }) => {
			const res = await fetch(`/api/messages/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({ content, authorId }),
			});
			if (!res.ok) throw new Error('Failed to edit');
		},
		onMutate: async ({ id, content }: { id: string; content: string }) => {
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

	return {
		messages,
		sendMessage: (args: SendArgs) => sendMutation.mutate(args),
		deleteMessage: (id: string) => deleteMutation.mutate(id),
		editMessage: (id: string, content: string) =>
			editMutation.mutate({ id, content }),
	};
}
