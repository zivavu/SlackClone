'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export function GlobalTopBar() {
	const router = useRouter();
	async function handleSignOut() {
		await authClient.signOut();
		router.push('/signin');
	}
	return (
		<header className="h-12 shrink-0 text-white">
			<div className="h-full px-3 sm:px-4 flex items-center gap-2">
				<button
					className="md:hidden p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
					title="Toggle sidebar">
					<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
						<path
							d="M4 7h16M4 12h10M4 17h16"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
						/>
					</svg>
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

				{/* Right cluster */}
				<div className="flex items-center gap-1.5">
					<ThemeToggle />
					<button
						className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="Help">
						<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
							<circle
								cx="12"
								cy="12"
								r="9"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<path
								d="M12 16v-1a3 3 0 1 1 3-3"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<circle cx="12" cy="18" r="1" fill="currentColor" />
						</svg>
					</button>
					<button
						className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="Notifications">
						<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
							<path
								d="M6 9a6 6 0 1 1 12 0v5l2 2H4l2-2Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
							<path
								d="M10 19a2 2 0 0 0 4 0"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					</button>
					<button
						className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="Profile">
						<svg
							viewBox="0 0 24 24"
							className="size-5"
							fill="currentColor"
							aria-hidden>
							<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.5 0-7 1.75-7 5v1h14v-1c0-3.25-3.5-5-7-5Z" />
						</svg>
					</button>
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
