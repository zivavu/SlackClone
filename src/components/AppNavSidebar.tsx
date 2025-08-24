export function AppNavSidebar() {
	return (
		<aside className="hidden md:flex w-20 flex-col border-r border-white/10 py-3">
			<div className="flex items-center justify-center">
				<button className="size-10 rounded-xl bg-white/10 text-[11px] font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20">
					AC
				</button>
			</div>
			<nav className="mt-3 flex-1">
				<ul className="space-y-2 text-[12px]">
					<li>
						<a
							href="#"
							className="group flex flex-col items-center gap-1 rounded px-2 py-2 text-white/90 hover:bg-white/10">
							<span className="size-9 rounded-lg bg-white/10 grid place-items-center">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									aria-hidden>
									<path
										d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-8.5Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="truncate">Home</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="group flex flex-col items-center gap-1 rounded px-2 py-2 text-white/80 hover:bg-white/10">
							<span className="size-9 rounded-lg bg-white/10 grid place-items-center">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									aria-hidden>
									<path
										d="M7 10a5 5 0 1 1 10 0v6l3 2H4l3-2Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="truncate">DMs</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="group flex flex-col items-center gap-1 rounded px-2 py-2 text-white/80 hover:bg-white/10">
							<span className="size-9 rounded-lg bg-white/10 grid place-items-center">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									aria-hidden>
									<path
										d="M6 9a6 6 0 1 1 12 0v6l2 2H4l2-2Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="truncate">Activity</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="group flex flex-col items-center gap-1 rounded px-2 py-2 text-white/80 hover:bg-white/10">
							<span className="size-9 rounded-lg bg-white/10 grid place-items-center">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="none"
									aria-hidden>
									<rect
										x="6"
										y="4"
										width="12"
										height="16"
										rx="2"
										stroke="currentColor"
										strokeWidth="2"
									/>
									<path
										d="M9 8h6M9 12h6M9 16h4"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</span>
							<span className="truncate">Files</span>
						</a>
					</li>
					<li>
						<a
							href="#"
							className="group flex flex-col items-center gap-1 rounded px-2 py-2 text-white/80 hover:bg-white/10">
							<span className="size-9 rounded-lg bg-white/10 grid place-items-center">
								<svg
									viewBox="0 0 24 24"
									className="size-5"
									fill="currentColor"
									aria-hidden>
									<circle cx="5" cy="12" r="2" />
									<circle cx="12" cy="12" r="2" />
									<circle cx="19" cy="12" r="2" />
								</svg>
							</span>
							<span className="truncate">More</span>
						</a>
					</li>
				</ul>
			</nav>
		</aside>
	);
}
