export type Message = {
	id: number;
	author: string;
	initials: string;
	timestamp: string;
	content: string;
};

export function MessagesList({ messages }: { messages: Message[] }) {
	return (
		<section className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
			<ol className="space-y-4">
				{messages.map((m) => (
					<li key={m.id} className="flex items-start gap-3">
						<div className="size-9 shrink-0 rounded bg-white/10 grid place-items-center text-xs font-medium">
							{m.initials}
						</div>
						<div className="min-w-0">
							<div className="flex items-baseline gap-2">
								<p className="text-sm font-semibold leading-none">{m.author}</p>
								<span className="text-[11px] text-white/50">{m.timestamp}</span>
							</div>
							<p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap break-words text-white/90">
								{m.content}
							</p>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
