'use client';

import { authClient } from '@/lib/auth-client';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';

function isSameCalendarDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function getOrdinalSuffix(n: number) {
	const j = n % 10;
	const k = n % 100;
	if (j === 1 && k !== 11) return 'st';
	if (j === 2 && k !== 12) return 'nd';
	if (j === 3 && k !== 13) return 'rd';
	return 'th';
}

function getDateLabel(date: Date) {
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	if (isSameCalendarDay(date, today)) return 'Today';
	if (isSameCalendarDay(date, yesterday)) return 'Yesterday';

	const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
	const month = date.toLocaleDateString('en-US', { month: 'long' });
	const day = date.getDate();
	return `${weekday}, ${month} ${day}${getOrdinalSuffix(day)}`;
}

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
	avatarLookup,
}: {
	messages: Message[];
	onDelete?: (id: string) => void | Promise<void>;
	onEdit?: (id: string, content: string) => void | Promise<void>;
	mentionLookup?: Record<string, string>;
	avatarLookup?: Record<string, string | undefined>;
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
			<ol>
				{messages.map((message, idx) => {
					const isOwner = message.authorId === session?.user.id;
					const prev = messages[idx - 1];
					const createdAtMs = new Date(message.createdAt).getTime();
					const prevCreatedAtMs = prev ? new Date(prev.createdAt).getTime() : 0;
					const fiveMinutesMs = 10 * 60 * 1000;
					const showAvatar =
						!prev ||
						prev.authorId !== message.authorId ||
						createdAtMs - prevCreatedAtMs >= fiveMinutesMs;

					const currentDate = new Date(message.createdAt);
					const prevDate = prev ? new Date(prev.createdAt) : null;
					const showDaySeparator =
						!prev || (prevDate && !isSameCalendarDay(currentDate, prevDate));

					return (
						<Fragment key={message._id}>
							{showDaySeparator ? (
								<li className="my-4 flex items-center">
									<div className="h-px bg-border flex-1" />
									<span className="shrink-0 rounded-full border border-border px-3 py-1 text-sm font-bold text-muted-foreground">
										{getDateLabel(currentDate)}
									</span>
									<div className="h-px bg-border flex-1" />
								</li>
							) : null}
							<li
								key={message._id}
								className="flex gap-3 group hover:bg-foreground/5 px-3 sm:px-4 py-1">
								{showAvatar ? (
									avatarLookup?.[message.authorId] ? (
										<Image
											src={avatarLookup[message.authorId] as string}
											alt={message.authorName}
											className="size-9 shrink-0 rounded object-cover"
											width={36}
											height={36}
										/>
									) : (
										<div className="size-9 shrink-0 rounded bg-foreground/10 grid place-items-center text-xs font-medium">
											{message?.authorName?.split(' ')[0]?.[0]}
											{message?.authorName?.split(' ')[1]?.[0]}
										</div>
									)
								) : (
									<div className="w-9 shrink-0" />
								)}
								<div className="min-w-0 flex-1 relative">
									{showAvatar && (
										<div className="flex items-baseline gap-2">
											<p className="text-[15px] font-semibold leading-none">
												{message.authorName}
											</p>
											<span className="text-[11px] text-muted-foreground">
												{new Date(message.createdAt).toLocaleTimeString(
													'en-US',
													{
														hour: 'numeric',
														minute: '2-digit',
													}
												)}
											</span>
										</div>
									)}
									{editingId === message._id ? (
										<div className="mt-1">
											<textarea
												className="w-full rounded bg-input px-2 py-1 text-[15px] outline-none focus:ring-2 focus:ring-ring/20"
												rows={2}
												value={draft}
												onChange={(e) => setDraft(e.target.value)}
											/>
											<div className="mt-1 flex items-center gap-2">
												<button
													onClick={() => saveEdit(message._id)}
													className="px-2 py-1 rounded bg-primary text-primary-foreground text-sm">
													Save
												</button>
												<button
													onClick={() => setEditingId(null)}
													className="px-2 py-1 rounded bg-foreground/10 text-sm">
													Cancel
												</button>
											</div>
										</div>
									) : (
										<p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap break-words">
											{renderWithMentions(message.content)}
										</p>
									)}
									<div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 -translate-y-2 ">
										{isOwner ? (
											<div className="flex items-center gap-1 rounded-full bg-background/80 backdrop-blur px-1.5 py-1 border border-border shadow">
												<button
													type="button"
													title="Edit"
													onClick={() =>
														startEdit(message._id, message.content)
													}
													className="p-1 rounded text-[12px] hover:bg-foreground/30">
													<Pencil className="size-4" aria-hidden />
												</button>
												<button
													type="button"
													title="Delete"
													onClick={() => onDelete?.(message._id)}
													className="p-1 rounded hover:bg-foreground/30">
													<Trash2 className="size-4" aria-hidden />
												</button>
											</div>
										) : null}
									</div>
								</div>
							</li>
						</Fragment>
					);
				})}
			</ol>
		</section>
	);
}
