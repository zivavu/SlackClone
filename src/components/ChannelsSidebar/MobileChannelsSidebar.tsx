'use client';

import { DirectMessageUser } from '@/types/chat';
import { authClient } from '@/lib/auth-client';
import { Headphones, MessageSquare, Pencil, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	channels: { id: string; name: string }[];
	directMessages: DirectMessageUser[];
};

export function MobileChannelsSidebar({
	isOpen,
	onClose,
	channels,
	directMessages,
}: Props) {
	const { data: session } = authClient.useSession();
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsAnimating(true);
			// Prevent body scroll when menu is open
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable body scroll when menu closes
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleClose = () => {
		setIsAnimating(false);
		setTimeout(() => {
			onClose();
		}, 300); // Match the transition duration
	};

	if (!isOpen && !isAnimating) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
					isOpen && isAnimating ? 'opacity-100' : 'opacity-0'
				}`}
				onClick={handleClose}
			/>

			{/* Sidebar */}
			<aside
				className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-r dark:from-[#180d1a] dark:to-[#1e1022] from-[#4d224f] to-[#4f2550] z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
					isOpen && isAnimating ? 'translate-x-0' : '-translate-x-full'
				}`}>
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
					<h2 className="text-lg font-semibold text-white">Ipsum Corp</h2>
					<button
						onClick={handleClose}
						className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
						<X className="size-5 text-white/70" />
					</button>
				</div>

				{/* Navigation Options */}
				<nav className="px-4 py-4">
					<ul className="space-y-1">
						<li>
							<button className="w-full flex items-center gap-2 rounded px-3 py-2 text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors">
								<MessageSquare className="size-4 text-white/70" />
								<span>Threads</span>
							</button>
						</li>
						<li>
							<button className="w-full flex items-center gap-2 rounded px-3 py-2 text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors">
								<Headphones className="size-4 text-white/70" />
								<span>Huddles</span>
							</button>
						</li>
						<li>
							<button className="w-full flex items-center gap-2 rounded px-3 py-2 text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors">
								<Pencil className="size-4 text-white/70" />
								<span>Drafts & sent</span>
							</button>
						</li>
					</ul>
				</nav>

				{/* Channels & Direct Messages */}
				<div className="flex-1 px-4 overflow-y-auto">
					{/* Channels Section */}
					<div className="border-t border-white/10 pt-4">
						<p className="px-2 text-white/60 uppercase tracking-wide text-[11px] mb-2">
							Channels
						</p>
						<ul className="space-y-1">
							{channels.map((channel) => (
								<li key={channel.id}>
									<Link
										href={`/client/${channel.id}`}
										onClick={handleClose}
										className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors">
										<span className="text-white/50">#</span>
										<span className="truncate">{channel.name}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Direct Messages Section */}
					<div className="mt-6">
						<p className="px-2 text-white/60 uppercase tracking-wide text-[11px] mb-2">
							Direct messages
						</p>
						<ul className="space-y-1">
							{directMessages.map((dm) => {
								const channelId = [session?.user.id, dm.id].sort().join('_');
								return (
									<li key={dm.id}>
										<Link
											href={`/client/${channelId}`}
											onClick={handleClose}
											className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5 active:bg-white/10 transition-colors">
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
															dm.status === 'online' ? '#22c55e' : '#6b7280',
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
				</div>
			</aside>
		</>
	);
}
