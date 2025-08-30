import { DirectMessageUser } from '@/app/api/direct-messages/actions';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

type Props = {
	channels: { id: string; name: string }[];
	directMessages: DirectMessageUser[];
};

export function ChannelsSidebar({ channels, directMessages }: Props) {
	const { data: session } = authClient.useSession();

	return (
		<aside className="hidden md:flex w-64 lg:w-72 flex-col bg-gradient-to-b from-[#180d1a] to-[#1e1022]">
			<div className="px-3 py-3 border-b border-white/10">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-semibold">Acme Corp</h2>
					<button
						className="p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="New">
						<svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
							<path
								d="M12 5v14M5 12h14"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
				<div className="mt-3">
					<label className="relative block">
						<span className="sr-only">Search</span>
						<input
							type="text"
							placeholder="Search"
							className="w-full rounded bg-white/5 px-8 py-2 text-sm placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/20"
						/>
						<svg
							viewBox="0 0 24 24"
							className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-white/60"
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
			</div>

			<nav className="flex-1 overflow-y-auto px-3 py-2 text-sm">
				<div>
					<p className="px-2 text-white/60 uppercase tracking-wide text-[11px]">
						Channels
					</p>
					<ul className="mt-1">
						{channels.map((ch) => (
							<li key={ch.id}>
								<Link
									href={`/client/${ch.id}`}
									className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
									<span className="text-white/50">#</span>
									<span className="truncate">{ch.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="mt-4">
					<p className="px-2 text-white/60 uppercase tracking-wide text-[11px]">
						Direct messages
					</p>
					<ul className="mt-1">
						{directMessages.map((dm) => {
							const channnelId = [session?.user.id, dm.id].sort().join('_');
							console.log(dm);
							return (
								<li key={dm.name}>
									<Link
										href={`/client/${channnelId}`}
										className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
										<span className="relative inline-flex items-center justify-center">
											<span className="size-5 rounded bg-white/10 text-[10px] grid place-items-center">
												{dm.name
													.split(' ')
													.map((n) => n[0])
													.slice(0, 2)
													.join('')}
											</span>
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
