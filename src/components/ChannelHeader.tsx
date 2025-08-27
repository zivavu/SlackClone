export function ChannelHeader({
	name,
	topic,
}: {
	name: string;
	topic?: string;
}) {
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
	);
}
