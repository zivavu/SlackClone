export default function ClientPage() {
	const workspaces = ['A', 'B', 'C', 'D'];
	const channels = [
		'general',
		'random',
		'announcements',
		'design',
		'engineering',
	];
	const directMessages = [
		{ name: 'Ada Lovelace', status: 'online' },
		{ name: 'Linus Torvalds', status: 'away' },
		{ name: 'Grace Hopper', status: 'online' },
		{ name: 'Margaret Hamilton', status: 'offline' },
	];
	const messages = [
		{
			id: 1,
			author: 'Ada Lovelace',
			initials: 'AL',
			timestamp: '9:12 AM',
			content:
				'Morning! Shipping the redesign today. Check #announcements for the rollout plan.',
		},
		{
			id: 2,
			author: 'Linus Torvalds',
			initials: 'LT',
			timestamp: '9:18 AM',
			content:
				'Reviewed the PR. Left a couple of comments about error handling and tests.',
		},
		{
			id: 3,
			author: 'Grace Hopper',
			initials: 'GH',
			timestamp: '9:26 AM',
			content: "Compiler is green. Let's go. 🚀",
		},
	];

	return (
		<div className="h-svh flex flex-col bg-gradient-to-b from-[#330d38] to-[#230525] text-foreground">
			{/* Global top bar */}
			<header className="h-12 shrink-0 text-white">
				<div className="h-full px-3 sm:px-4 flex items-center gap-2">
					{/* Left cluster */}
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
					<div className="hidden sm:flex items-center gap-1 rounded px-2 py-1 bg-white/10">
						<span className="text-xs font-medium">Acme co</span>
						<svg
							viewBox="0 0 24 24"
							className="size-4 text-white/70"
							fill="currentColor"
							aria-hidden>
							<path d="M7 10l5 5 5-5H7z" />
						</svg>
					</div>

					{/* Search */}
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
						<button
							className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
							title="Help">
							<svg
								viewBox="0 0 24 24"
								className="size-5"
								fill="none"
								aria-hidden>
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
							<svg
								viewBox="0 0 24 24"
								className="size-5"
								fill="none"
								aria-hidden>
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
					</div>
				</div>
			</header>

			{/* Row below the global top bar */}
			<div className="flex-1 flex min-h-0 bg-transparent/0">
				{/* Workspace rail */}
				<aside className="hidden md:flex w-14 flex-col items-center justify-between bg-black/80/0 py-3">
					<div className="flex flex-col items-center gap-2">
						{workspaces.map((w) => (
							<button
								key={w}
								className="size-10 rounded-xl bg-white/10 text-xs font-medium hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
								title={`Workspace ${w}`}>
								{w}
							</button>
						))}
					</div>
					<button
						className="size-10 rounded-xl bg-white/10 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
						title="Profile">
						<span className="sr-only">Open profile</span>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className="size-5 m-auto"
							aria-hidden>
							<path
								d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6Z"
								fill="currentColor"
							/>
						</svg>
					</button>
				</aside>

				{/* Channels sidebar */}
				<aside className="hidden md:flex w-64 lg:w-72 flex-col bg-gradient-to-b from-[#180d1a] to-[#1e1022]">
					<div className="px-3 py-3 border-b border-white/10">
						<div className="flex items-center justify-between">
							<h2 className="text-sm font-semibold">Acme Corp</h2>
							<button
								className="p-1 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
								title="New">
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
									<li key={ch}>
										<a
											href="#"
											className="flex items-center gap-2 rounded px-2 py-1.5 text-white/90 hover:bg-white/5">
											<span className="text-white/50">#</span>
											<span className="truncate">{ch}</span>
										</a>
									</li>
								))}
							</ul>
						</div>

						<div className="mt-4">
							<p className="px-2 text-white/60 uppercase tracking-wide text-[11px]">
								Direct messages
							</p>
							<ul className="mt-1">
								{directMessages.map((dm) => (
									<li key={dm.name}>
										<a
											href="#"
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
										</a>
									</li>
								))}
							</ul>
						</div>
					</nav>
				</aside>

				{/* Main content */}
				<main className="flex-1 flex min-w-0 flex-col bg-[#1a1d21]">
					{/* Channel header */}
					<header className="h-14 flex items-center justify-between border-b border-white/10 px-3 sm:px-4 bg-black/30 backdrop-blur">
						<div className="min-w-0 flex items-center gap-2">
							<h1 className="truncate text-sm sm:text-base font-semibold">
								# general
							</h1>
							<span className="hidden sm:inline text-xs text-white/60">
								Company-wide announcements and work-based matters
							</span>
						</div>
						<div className="flex items-center gap-1.5">
							<button
								className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
								title="Search in channel">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
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
							</button>
							<button
								className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
								title="Members">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									aria-hidden>
									<path
										d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6Z"
										fill="currentColor"
									/>
								</svg>
							</button>
							<button
								className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
								title="More">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="currentColor"
									aria-hidden>
									<circle cx="5" cy="12" r="2" />
									<circle cx="12" cy="12" r="2" />
									<circle cx="19" cy="12" r="2" />
								</svg>
							</button>
						</div>
					</header>

					{/* Messages */}
					<section className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
						<ol className="space-y-4">
							{messages.map((m) => (
								<li key={m.id} className="flex items-start gap-3">
									<div className="size-9 shrink-0 rounded bg-white/10 grid place-items-center text-xs font-medium">
										{m.initials}
									</div>
									<div className="min-w-0">
										<div className="flex items-baseline gap-2">
											<p className="text-sm font-semibold leading-none">
												{m.author}
											</p>
											<span className="text-[11px] text-white/50">
												{m.timestamp}
											</span>
										</div>
										<p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap break-words text-white/90">
											{m.content}
										</p>
									</div>
								</li>
							))}
						</ol>
					</section>

					{/* Composer */}
					<footer className="border-t border-white/10 p-2 sm:p-3">
						<form className="rounded-xl bg-[#222529] focus-within:ring-2 focus-within:ring-white/20">
							<div className="px-2 sm:px-3 py-2">
								<label className="sr-only" htmlFor="message">
									Message
								</label>
								<textarea
									id="message"
									rows={1}
									placeholder="Message #general"
									className="w-full resize-none bg-transparent outline-none placeholder:text-white/40 text-[15px]"
								/>
							</div>
							<div className="flex items-center justify-between px-2 sm:px-3 pb-2 gap-1">
								<div className="flex items-center gap-1.5">
									<button
										type="button"
										className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
										title="Upload file">
										<svg
											viewBox="0 0 24 24"
											className="size-5"
											fill="none"
											aria-hidden>
											<path
												d="M12 16V4m0 0 4 4m-4-4-4 4"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
											<path
												d="M6 20h12a2 2 0 0 0 2-2v-3"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
										</svg>
									</button>
									<button
										type="button"
										className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
										title="Mention">
										<svg
											viewBox="0 0 24 24"
											className="size-5"
											fill="none"
											aria-hidden>
											<path
												d="M12 20a8 8 0 1 0-8-8"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
											<path
												d="M16 12v2a2 2 0 1 0 4 0v-2a8 8 0 1 0-2.34 5.66"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
										</svg>
									</button>
									<button
										type="button"
										className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
										title="Emoji">
										<svg
											viewBox="0 0 24 24"
											className="size-5"
											fill="none"
											aria-hidden>
											<circle
												cx="12"
												cy="12"
												r="9"
												stroke="currentColor"
												strokeWidth="2"
											/>
											<path
												d="M9 10h.01M15 10h.01M8 14c1.5 1.5 6.5 1.5 8 0"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
										</svg>
									</button>
								</div>
								<div className="flex items-center gap-1.5">
									<button
										type="button"
										className="hidden sm:inline p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
										title="Format">
										<svg
											viewBox="0 0 24 24"
											className="size-5"
											fill="none"
											aria-hidden>
											<path
												d="M4 7h16M4 12h10M4 17h16"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
											/>
										</svg>
									</button>
									<button
										type="submit"
										className="inline-flex items-center gap-1 rounded bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
										title="Send">
										<svg
											viewBox="0 0 24 24"
											className="size-4"
											fill="currentColor"
											aria-hidden>
											<path d="m3 11 18-8-8 18-2-7-8-3Z" />
										</svg>
										<span>Send</span>
									</button>
								</div>
							</div>
						</form>
					</footer>
				</main>
			</div>
		</div>
	);
}
