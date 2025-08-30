'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export type Message = {
	id: string;
	author: string;
	timestamp: string;
	content: string;
};

export function MessagesList({
	messages,
	onDelete,
	onEdit,
}: {
	messages: Message[];
	onDelete?: (id: string) => void | Promise<void>;
	onEdit?: (id: string, content: string) => void | Promise<void>;
}) {
	const [editingId, setEditingId] = useState<string | null>(null);
	const [draft, setDraft] = useState<string>('');

	function startEdit(id: string, content: string) {
		setEditingId(id);
		setDraft(content);
	}

	async function saveEdit(id: string) {
		if (!onEdit) return setEditingId(null);
		await onEdit(id, draft);
		setEditingId(null);
	}

	console.log(messages);
	return (
		<section className="flex-1 overflow-y-auto py-4">
			<ol className="space-y-4">
				{messages.map((message) => (
					<li
						key={message.id}
						className="flex items-center gap-3 group hover:bg-white/5 px-3 sm:px-4 py-1">
						<div className="size-9 shrink-0 rounded bg-white/10 grid place-items-center text-xs font-medium">
							{message.author.split(' ')[0][0]}
							{message.author.split(' ')[1]?.[0]}
						</div>
						<div className="min-w-0 flex-1 relative">
							<div className="flex items-baseline gap-2">
								<p className="text-sm font-semibold leading-none">
									{message.author}
								</p>
								<span className="text-[11px] text-white/50">
									{new Date(message.timestamp).toLocaleTimeString('en-PL', {
										hour: 'numeric',
										minute: '2-digit',
									})}
								</span>
							</div>
							{editingId === message.id ? (
								<div className="mt-1">
									<textarea
										className="w-full rounded bg-white/5 px-2 py-1 text-[15px] outline-none focus:ring-2 focus:ring-white/20"
										rows={2}
										value={draft}
										onChange={(e) => setDraft(e.target.value)}
									/>
									<div className="mt-1 flex items-center gap-2">
										<button
											onClick={() => saveEdit(message.id)}
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
									{message.content}
								</p>
							)}
							<div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 -translate-y-2 ">
								<div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-1.5 py-1 border border-white/10 shadow">
									<button
										type="button"
										title="Edit"
										onClick={() => startEdit(message.id, message.content)}
										className="p-1 rounded text-[12px] hover:bg-white/30">
										<Pencil className="size-4" aria-hidden />
									</button>
									<button
										type="button"
										title="Delete"
										onClick={() => onDelete?.(message.id)}
										className="p-1 rounded hover:bg-white/30">
										<Trash2 className="size-4" aria-hidden />
									</button>
								</div>
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
