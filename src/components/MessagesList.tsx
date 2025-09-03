'use client';

import { authClient } from '@/lib/auth-client';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type Message = {
	_id: string;
	authorName: string;
	authorId: string;
	createdAt: string;
	updatedAt?: string;
	content: string;
	mentions?: string[];
};

export function MessagesList({
	messages,
	onDelete,
	onEdit,
	mentionLookup,
}: {
	messages: Message[];
	onDelete?: (id: string) => void | Promise<void>;
	onEdit?: (id: string, content: string) => void | Promise<void>;
	mentionLookup?: Record<string, string>;
}) {
	const { data: session } = authClient.useSession();
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<string>('');
	const containerRef = useRef<HTMLElement | null>(null);

	function startEdit(id: string, content: string) {
		setEditingId(id);
		setDraft(content);
	}

	async function saveEdit(id: string) {
		if (!onEdit) return setEditingId(null);
		await onEdit(id, draft);
		setEditingId(null);
	}

	function renderWithMentions(text: string) {
		const parts: (string | React.JSX.Element)[] = [];
		const regex = /<@([A-Za-z0-9_\-]+)>/g;
		let lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = regex.exec(text))) {
			if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
			const id = m[1];
			const name = mentionLookup?.[id] || id;
			parts.push(
				<Link
					key={`${id}-${m.index}`}
					href={`/client/${[session?.user.id, id].sort().join('_')}`}
					className="text-blue-200">
					@{name}
				</Link>
			);
			lastIndex = regex.lastIndex;
		}
		if (lastIndex < text.length) parts.push(text.slice(lastIndex));
		return parts;
	}

	useEffect(() => {
		if (
			messages[0] &&
			messages[messages.length - 1].authorId !== session?.user.id
		) {
			return;
		}
		const el = containerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages]);

	return (
		<section ref={containerRef} className="flex-1 overflow-y-auto py-4">
			<ol className="space-y-4">
				{messages.map((message) => {
					const isOwner = message.authorId === session?.user.id;
					return (
						<li
							key={message._id}
							className="flex items-center gap-3 group hover:bg-white/5 px-3 sm:px-4 py-1">
							<div className="size-9 shrink-0 rounded bg-white/10 grid place-items-center text-xs font-medium">
								{message?.authorName?.split(' ')[0]?.[0]}
								{message?.authorName?.split(' ')[1]?.[0]}
							</div>
							<div className="min-w-0 flex-1 relative">
								<div className="flex items-baseline gap-2">
									<p className="text-sm font-semibold leading-none">
										{message.authorName}
									</p>
									<span className="text-[11px] text-white/50">
										{new Date(message.createdAt).toLocaleTimeString('en-US', {
											hour: 'numeric',
											minute: '2-digit',
										})}
									</span>
								</div>
								{editingId === message._id ? (
									<div className="mt-1">
										<textarea
											className="w-full rounded bg-white/5 px-2 py-1 text-[15px] outline-none focus:ring-2 focus:ring-white/20"
											rows={2}
											value={draft}
											onChange={(e) => setDraft(e.target.value)}
										/>
										<div className="mt-1 flex items-center gap-2">
											<button
												onClick={() => saveEdit(message._id)}
												className="px-2 py-1 rounded bg-white text-black text-sm">
												Save
											</button>
											<button
												onClick={() => setEditingId(null)}
												className="px-2 py-1 rounded bg-white/10 text-sm">
												Cancel
											</button>
										</div>
									</div>
								) : (
									<p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap break-words text-white/90">
										{renderWithMentions(message.content)}
									</p>
								)}
								<div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 -translate-y-2 ">
									{isOwner ? (
										<div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-1.5 py-1 border border-white/10 shadow">
											<button
												type="button"
												title="Edit"
												onClick={() => startEdit(message._id, message.content)}
												className="p-1 rounded text-[12px] hover:bg-white/30">
												<Pencil className="size-4" aria-hidden />
											</button>
											<button
												type="button"
												title="Delete"
												onClick={() => onDelete?.(message._id)}
												className="p-1 rounded hover:bg-white/30">
												<Trash2 className="size-4" aria-hidden />
											</button>
										</div>
									) : null}
								</div>
							</div>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
