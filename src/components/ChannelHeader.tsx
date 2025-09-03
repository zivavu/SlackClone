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
		<header className="h-14 flex items-center justify-between border-b border-border px-3 sm:px-4 bg-card backdrop-blur">
			<div className="min-w-0 flex items-center gap-2">
				<h1 className="truncate text-sm sm:text-base font-semibold">
					# {name}
				</h1>
				{topic ? (
					<span className="hidden sm:inline text-xs text-muted-foreground">
						{topic}
					</span>
				) : null}
			</div>
			<div className="flex items-center gap-1.5">
				{canDelete && channelId ? (
					<Dialog>
						<DialogTrigger asChild>
							<button
								className="p-1.5 rounded hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-ring/20"
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
									<button className="rounded px-3 py-2 text-sm hover:bg-foreground/10">
										Cancel
									</button>
								</DialogClose>
								<button
									onClick={handleDelete}
									disabled={deleting}
									className="rounded bg-foreground/10 px-3 py-2 text-sm hover:bg-foreground/15 disabled:opacity-50">
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
