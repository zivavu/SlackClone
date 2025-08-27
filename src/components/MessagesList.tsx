import { deleteMessage } from '@/app/client/[channelId]/actions';
import { Trash2 } from 'lucide-react';

export type Message = {
	id: string;
	author: string;
	initials: string;
	timestamp: string;
	content: string;
};

export function MessagesList({
	messages,
	channelId,
}: {
	messages: Message[];
	channelId?: string;
}) {
	return (
		<section className="flex-1 overflow-y-auto px-3 sm:px-4 py-4">
			<ol className="space-y-4">
				{messages.map((message) => (
					<li key={message.id} className="flex items-start gap-3 group">
						<div className="size-9 shrink-0 rounded bg-white/10 grid place-items-center text-xs font-medium">
							{message.initials}
						</div>
						<div className="min-w-0 flex-1 relative">
							<div className="flex items-baseline gap-2">
								<p className="text-sm font-semibold leading-none">
									{message.author}
								</p>
								<span className="text-[11px] text-white/50">
									{message.timestamp}
								</span>
							</div>
							<p className="mt-1 text-[15px] leading-6 whitespace-pre-wrap break-words text-white/90">
								{message.content}
							</p>
							<div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 -translate-y-2 ">
								<div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-1.5 py-1 border border-white/10 shadow hover:bg-white/5">
									<form action={deleteMessage}>
										<input type="hidden" name="channelId" value={channelId} />
										<input type="hidden" name="messageId" value={message.id} />
										<button
											type="submit"
											title="Delete"
											className="p-1 rounded">
											<Trash2 className="size-4" aria-hidden />
										</button>
									</form>
								</div>
							</div>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
