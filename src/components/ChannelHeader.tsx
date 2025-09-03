'use client';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ChannelHeader({
	name,
	topic,
	channelId,
	canDelete = false,
	firstChannelHref,
}: {
	name: string;
	topic?: string;
	channelId?: string;
	canDelete?: boolean;
	firstChannelHref?: string;
}) {
	const router = useRouter();
	const [deleting, setDeleting] = useState(false);

	async function handleDelete() {
		if (!canDelete || !channelId || deleting) return;
		setDeleting(true);
		const res = await fetch(`/api/channels/${channelId}`, { method: 'DELETE' });
		if (!res.ok) {
			setDeleting(false);
			return alert('Failed to delete channel');
		}
		router.replace(firstChannelHref || '/client');
	}

	return (
		<header className="h-14 flex items-center justify-between border-b border-white/10 px-3 sm:px-4 bg-black/30 backdrop-blur">
			<div className="min-w-0 flex items-center gap-2">
				<h1 className="truncate text-sm sm:text-base font-semibold">
					# {name}
				</h1>
				{topic ? (
					<span className="hidden sm:inline text-xs text-white/60">
						{topic}
					</span>
				) : null}
			</div>
			<div className="flex items-center gap-1.5">
				<button
					className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
					title="Search in channel">
					<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
						<circle
							cx="11"
							cy="11"
							r="7"
							stroke="currentColor"
							strokeWidth="2"
						/>
						<path
							d="m20 20-3-3"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
				</button>
				<button
					className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
					title="Members">
					<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
						<path
							d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6Z"
							fill="currentColor"
						/>
					</svg>
				</button>
				{canDelete && channelId ? (
					<Dialog>
						<DialogTrigger asChild>
							<button
								className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
								title="Delete channel">
								<Trash2 className="size-5" aria-hidden />
							</button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete #{name}?</DialogTitle>
								<DialogDescription>
									This action will remove the channel and all of its messages.
									This cannot be undone.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<button className="rounded px-3 py-2 text-sm hover:bg-white/10">
										Cancel
									</button>
								</DialogClose>
								<button
									onClick={handleDelete}
									disabled={deleting}
									className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
									{deleting ? 'Deleting…' : 'Delete channel'}
								</button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				) : null}
			</div>
		</header>
	);
}
