'use client';

import { AppNavSidebar } from '@/components/AppNavSidebar';
import { ChannelHeader } from '@/components/ChannelHeader';
import { ChannelsSidebar } from '@/components/ChannelsSidebar';
import { Composer } from '@/components/Composer';
import { GlobalTopBar } from '@/components/GlobalTopBar';
import { MessagesList, type Message } from '@/components/MessagesList';
import { useEffect, useOptimistic, useState, useTransition } from 'react';

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
	const [baseMessages, setBaseMessages] = useState<Message[]>(initialMessages);
	const [messages, applyOptimistic] = useOptimistic(
		baseMessages,
		(
			state: Message[],
			action: { type: 'add'; message: Message } | { type: 'remove'; id: string }
		) => {
			if (action.type === 'add') return [...state, action.message];
			if (action.type === 'remove')
				return state.filter((m) => m.id !== action.id);
			return state;
		}
	);
	const [, startTransition] = useTransition();

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`/api/channels/${channelId}/messages`, {
					cache: 'no-store',
				});
				if (!res.ok) return;
				const data = (await res.json()) as Array<{
					id: string;
					author: string;
					initials: string;
					timestamp: string;
					content: string;
				}>;
				if (cancelled) return;
				setBaseMessages(
					data.map((d) => ({
						id: d.id,
						author: d.author,
						initials: d.initials,
						timestamp: new Date(d.timestamp).toLocaleTimeString('en-US', {
							hour: 'numeric',
							minute: '2-digit',
						}),
						content: d.content,
					}))
				);
			} catch {}
		})();
		return () => {
			cancelled = true;
		};
	}, [channelId]);

	async function onSend(content: string) {
		const tempId = `temp-${Date.now()}`;
		startTransition(() =>
			applyOptimistic({
				type: 'add',
				message: {
					id: tempId,
					author: 'You',
					initials: 'Y',
					timestamp: new Date().toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: '2-digit',
					}),
					content,
				},
			})
		);
		try {
			const res = await fetch('/api/messages', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ channelId, content, author: 'You' }),
			});
			if (!res.ok) throw new Error('Failed to send');
		} catch {}
	}

	async function onDelete(id: string) {
		startTransition(() => applyOptimistic({ type: 'remove', id }));
		try {
			const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Failed to delete');
		} catch {}
	}

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
					<MessagesList messages={messages} onDelete={onDelete} />
					<Composer
						onSend={onSend}
						channelId={channelId}
						placeholder={`Message #${channelName}`}
					/>
				</main>
			</div>
		</div>
	);
}
