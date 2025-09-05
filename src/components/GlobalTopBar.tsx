'use client';

import { authClient } from '@/lib/auth-client';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

type Props = {
	onToggleSidebar?: () => void;
};

export function GlobalTopBar({ onToggleSidebar }: Props) {
	const router = useRouter();
	const [busy, setBusy] = useState(false);

	async function handleSignOut() {
		if (busy) return;
		setBusy(true);
		await authClient.signOut();
		router.push('/signin');
	}

	return (
		<header className="h-12 shrink-0 text-white">
			<div className="h-full px-3 sm:px-4 flex items-center gap-2">
				<button
					onClick={onToggleSidebar}
					className="md:hidden p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
					title="Open channels menu">
					<MessageSquare className="size-5" />
				</button>

				<div className="flex-1 flex justify-center">
					<label className="relative w-full max-w-xl">
						<span className="sr-only">Search</span>
						<input
							type="text"
							placeholder="Search"
							className="w-full rounded bg-white/10 pl-8 pr-3 py-1.5 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/30"
						/>
						<svg
							viewBox="0 0 24 24"
							className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-white/70"
							fill="none"
							aria-hidden>
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
					</label>
				</div>

				<div className="flex items-center gap-1.5">
					<ThemeToggle />
					<button
						onClick={handleSignOut}
						className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="Log out">
						<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
							<path
								d="M10 6H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<path
								d="m14 16 4-4-4-4"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<path
								d="M8 12h10"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
			</div>
		</header>
	);
}
