'use client';

import { useRef } from 'react';
import { useForm } from 'react-hook-form';

export function Composer({
	placeholder = 'Message #general',
	onSend,
}: {
	placeholder?: string;
	onSend?: (input: { content: string }) => void | Promise<void>;
}) {
	const formRef = useRef<HTMLFormElement | null>(null);

	const { register, handleSubmit, reset } = useForm<{ content: string }>({
		defaultValues: { content: '' },
	});

	function submitViaOnSend() {
		if (!onSend) return false;
		handleSubmit(async ({ content }) => {
			const trimmed = String(content || '').trim();
			if (!trimmed) return;
			await onSend({ content: trimmed });
			reset({ content: '' });
		})();
		return true;
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!submitViaOnSend()) {
				formRef.current?.requestSubmit();
			}
		}
	}

	return (
		<footer className="border-t border-white/10 p-2 sm:p-3">
			<form
				ref={formRef}
				className="rounded-xl bg-[#222529] focus-within:ring-2 focus-within:ring-white/20">
				<div className="px-2 sm:px-3 py-2">
					<label className="sr-only" htmlFor="message">
						Message
					</label>
					<textarea
						id="message"
						placeholder={placeholder}
						className="w-full resize-none bg-transparent outline-none placeholder:text-white/40 text-[15px]"
						{...register('content', { required: true })}
						onKeyDown={handleKeyDown}
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
							type={onSend ? 'button' : 'submit'}
							className="inline-flex items-center gap-1 rounded bg-white text-black px-3 py-1.5 text-sm font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
							title="Send"
							onClick={() => {
								if (!submitViaOnSend()) {
									formRef.current?.requestSubmit();
								}
							}}>
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
	);
}
