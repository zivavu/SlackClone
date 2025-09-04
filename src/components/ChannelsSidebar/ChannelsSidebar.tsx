'use client';

import { DirectMessageUser } from '@/app/api/direct-messages/actions';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
import { Headphones, MessageSquare, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
	channels: { id: string; name: string }[];
	directMessages: DirectMessageUser[];
};

export function ChannelsSidebar({ channels, directMessages }: Props) {
	const { data: session } = authClient.useSession();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState('');
	const [topic, setTopic] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const onCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;
		setSubmitting(true);
		try {
			const res = await fetch('/api/channels', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name.trim(),
					topic: topic.trim() || undefined,
				}),
			});
			if (!res.ok) throw new Error('Failed to create channel');
			const { id } = (await res.json()) as { id: string };
			setOpen(false);
			setName('');
			setTopic('');
			router.push(`/client/${id}`);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<aside className="hidden md:flex lg:w-92 flex-col bg-gradient-to-r dark:from-[#180d1a] dark:to-[#1e1022]  from-[#4d224f] to-[#4f2550] dark:border-r dark:border-white/20">
			<div className="px-3 py-3 border-b border-white/10">
				<div className="flex items-center justify-between">
					<h2 className="text-sm text-white font-semibold">Ipsum Corp</h2>
					{false && (
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<button
									className="p-1 rounded hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-ring/20"
									title="New channel">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										className="size-5"
										aria-hidden>
										<path
											d="M12 5v14M5 12h14"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</PopoverTrigger>
							<PopoverContent sideOffset={8} className="w-96 p-0">
								<form onSubmit={onCreate} className="p-4 space-y-4">
									<h3 className="text-sm font-semibold">Create channel</h3>
									<label className="block">
										<span className="block text-xs mb-1">Channel name</span>
										<div className="flex items-center gap-2 rounded bg-input px-3 py-2">
											<span className="text-muted-foreground">#</span>
											<input
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="e.g. plan-budget"
												className="flex-1 bg-transparent outline-none text-sm"
												maxLength={80}
												required
											/>
										</div>
									</label>
									<label className="block">
										<span className="block text-xs mb-1">Topic (optional)</span>
										<input
											value={topic}
											onChange={(e) => setTopic(e.target.value)}
											placeholder="What is this channel about?"
											className="w-full rounded bg-white/5 px-3 py-2 outline-none text-sm"
										/>
									</label>
									<div className="flex justify-end gap-2 pt-2">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="rounded px-3 py-2 text-sm hover:bg-white/10">
											Cancel
										</button>
										<button
											type="submit"
											disabled={submitting}
											className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
											{submitting ? 'Creating…' : 'Create'}
										</button>
									</div>
								</form>
							</PopoverContent>
						</Popover>
					)}
				</div>
			</div>

			<nav className="flex-1 overflow-y-auto px-3 py-2 text-[15px]">
				<ul className="space-y-1 mb-3">
					<li>
						<button className="w-full flex items-center justify-between rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
							<span className="flex items-center gap-2">
								<MessageSquare className="size-4 text-white/70" aria-hidden />
								<span>Threads</span>
							</span>
						</button>
					</li>
					<li>
						<button className="w-full flex items-center justify-between rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
							<span className="flex items-center gap-2">
								<Headphones className="size-4 text-white/70" aria-hidden />
								<span>Huddles</span>
							</span>
						</button>
					</li>
					<li>
						<button className="w-full flex items-center justify-between rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
							<span className="flex items-center gap-2">
								<Pencil className="size-4 text-white/70" aria-hidden />
								<span>Drafts & sent</span>
							</span>
						</button>
					</li>
				</ul>
				<div>
					<p className="px-2 text-white/60 uppercase tracking-wide text-[11px]">
						Channels
					</p>
					<ul className="mt-1">
						{channels.map((ch) => (
							<li key={ch.id}>
								<Link
									href={`/client/${ch.id}`}
									className="flex items-center gap-2 rounded  px-2 py-1.5 text-white/90 hover:bg-white/5">
									<span className="text-white/50">#</span>
									<span className="truncate">{ch.name}</span>
								</Link>
							</li>
						))}
					</ul>
					<div className="mt-2 px-2">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<button className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
									<span className="text-white/50">+</span>
									<span className="truncate">Add channel</span>
								</button>
							</PopoverTrigger>
							<PopoverContent sideOffset={8} className="w-96 p-0">
								<form onSubmit={onCreate} className="p-4 space-y-4">
									<h3 className="text-sm font-semibold">Create channel</h3>
									<label className="block">
										<span className="block text-xs mb-1">Channel name</span>
										<div className="flex items-center gap-2 rounded bg-white/5 px-3 py-2">
											<span className="text-white/50">#</span>
											<input
												value={name}
												onChange={(e) => setName(e.target.value)}
												placeholder="e.g. plan-budget"
												className="flex-1 bg-transparent outline-none text-sm"
												maxLength={80}
												required
											/>
										</div>
									</label>
									<label className="block">
										<span className="block text-xs mb-1">Topic (optional)</span>
										<input
											value={topic}
											onChange={(e) => setTopic(e.target.value)}
											placeholder="What is this channel about?"
											className="w-full rounded bg-white/5 px-3 py-2 outline-none text-sm"
										/>
									</label>
									<div className="flex justify-end gap-2 pt-2">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="rounded px-3 py-2 text-sm hover:bg-white/10">
											Cancel
										</button>
										<button
											type="submit"
											disabled={submitting}
											className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
											{submitting ? 'Creating…' : 'Create'}
										</button>
									</div>
								</form>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<div className="mt-4">
					<p className="px-2 text-white/60 uppercase tracking-wide text-[11px]">
						Direct messages
					</p>
					<ul className="mt-1">
						{directMessages.map((dm) => {
							const channnelId = [session?.user.id, dm.id].sort().join('_');
							return (
								<li key={dm.name}>
									<Link
										href={`/client/${channnelId}`}
										className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
										<span className="relative inline-flex items-center justify-center">
											{dm.image ? (
												<Image
													src={dm.image}
													alt={dm.name}
													className="size-5 rounded object-cover"
													width={20}
													height={20}
												/>
											) : (
												<span className="size-5 rounded bg-white/10 text-[10px] grid place-items-center">
													{dm.name
														.split(' ')
														.map((n) => n[0])
														.slice(0, 2)
														.join('')}
												</span>
											)}
											<span
												className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-black/60"
												style={{
													backgroundColor:
														dm.status === 'online'
															? '#22c55e'
															: dm.status === 'away'
															? '#f59e0b'
															: '#6b7280',
												}}
											/>
										</span>
										<span className="truncate">{dm.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>
		</aside>
	);
}
