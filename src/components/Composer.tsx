'use client';

import type { DirectMessageUser } from '@/app/api/direct-messages/actions';
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerSearch,
} from './ui/emoji-picker';

export function Composer({
	placeholder = 'Message #general',
	onSend,
	mentionables = [],
}: {
	placeholder?: string;
	onSend?: (input: {
		content: string;
		mentions?: string[];
	}) => void | Promise<void>;
	mentionables?: Pick<DirectMessageUser, 'id' | 'name'>[];
}) {
	const formRef = useRef<HTMLFormElement | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const { register, handleSubmit, reset, setValue, getValues, watch } =
		useForm<{ content: string }>({
			defaultValues: { content: '' },
		});

	function submitViaOnSend() {
		if (!onSend) return false;
		handleSubmit(async ({ content }) => {
			const trimmed = String(content || '').trim();
			if (!trimmed) return;
			const contentForStore = selectedMentions.reduce((acc, m) => {
				const re = new RegExp(`@${escapeRegExp(m.name)}`, 'g');
				return acc.replace(re, `<@${m.id}>`);
			}, trimmed);
			const mentions = selectedMentions.map((m) => m.id);
			await onSend({ content: contentForStore, mentions });
			reset({ content: '' });
			setSelectedMentions([]);
		})();
		return true;
	}

	function insertAtCaret(text: string) {
		const el = textareaRef.current;
		if (!el) return;
		const start = el.selectionStart ?? 0;
		const end = el.selectionEnd ?? start;
		const current = getValues('content') || '';
		const next = current.slice(0, start) + text + current.slice(end);
		setValue('content', next, { shouldDirty: true });
		queueMicrotask(() => {
			const pos = start + text.length;
			el.focus();
			el.setSelectionRange(pos, pos);
		});
	}

	// emoji state
	const [emojiOpen, setEmojiOpen] = useState(false);

	// mention state
	const [mentionOpen, setMentionOpen] = useState(false);
	const [mentionQuery, setMentionQuery] = useState('');
	const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
	const [selectedMentions, setSelectedMentions] = useState<
		{ id: string; name: string }[]
	>([]);

	function escapeRegExp(str: string) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	const contentValue = watch('content');

	function updateMentionState() {
		const el = textareaRef.current;
		if (!el) return setMentionOpen(false);
		const value = contentValue || '';
		const caret = el.selectionStart ?? value.length;
		const uptoCaret = value.slice(0, caret);
		let lastAt = -1;
		for (let i = uptoCaret.length - 1; i >= 0; i--) {
			const ch = uptoCaret[i];
			if (ch === '@') {
				if (i === 0 || /\s/.test(uptoCaret[i - 1] || ' ')) {
					lastAt = i;
				}
				break;
			}
			if (/\s/.test(ch)) break;
		}
		if (lastAt >= 0) {
			const query = uptoCaret.slice(lastAt + 1);
			setMentionQuery(query);
			setMentionOpen(true);
			setMentionActiveIndex(0);
		} else {
			setMentionOpen(false);
			setMentionQuery('');
		}
	}

	useEffect(() => {
		updateMentionState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contentValue]);

	const mentionOptions = useMemo(() => {
		const q = mentionQuery.trim().toLowerCase();
		const list = !q
			? mentionables
			: mentionables.filter((m) => m.name.toLowerCase().includes(q));
		return list.slice(0, 8);
	}, [mentionQuery, mentionables]);

	function selectMention(option: { id: string; name: string }) {
		const el = textareaRef.current;
		const value = getValues('content') || '';
		if (!el) return;
		const caret = el.selectionStart ?? value.length;
		const uptoCaret = value.slice(0, caret);
		const tokenStart = uptoCaret.lastIndexOf('@');
		if (tokenStart < 0) return;
		const before = value.slice(0, tokenStart);
		const after = value.slice(caret);
		const insertion = `@${option.name}`;
		const next = before + insertion + after;
		setValue('content', next, { shouldDirty: true });
		queueMicrotask(() => {
			const pos = (before + insertion).length;
			el.focus();
			el.setSelectionRange(pos, pos);
		});
		setMentionOpen(false);
		setMentionQuery('');
		setSelectedMentions((prev) =>
			prev.some((m) => m.id === option.id) ? prev : [...prev, option]
		);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (mentionOpen) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setMentionActiveIndex((i) =>
					Math.min(i + 1, mentionOptions.length - 1)
				);
				return;
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				setMentionActiveIndex((i) => Math.max(i - 1, 0));
				return;
			}
			if (e.key === 'Enter') {
				e.preventDefault();
				const opt = mentionOptions[mentionActiveIndex];
				if (opt) selectMention(opt);
				return;
			}
			if (e.key === 'Escape') {
				setMentionOpen(false);
				return;
			}
		}
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			if (!submitViaOnSend()) {
				formRef.current?.requestSubmit();
			}
		}
	}

	const reg = register('content', { required: true });

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		reg.onChange(e);
		updateMentionState();
		const value = e.target.value || '';
		setSelectedMentions((prev) =>
			prev.filter((m) => value.includes(`@${m.name}`))
		);
	}

	return (
		<footer className="p-2 sm:p-3">
			<form
				ref={formRef}
				className="rounded-xl border border-white/30 bg-[#222529] focus-within:ring-1 focus-within:ring-white/20">
				<div className="px-2 sm:px-3 py-2 relative">
					<label className="sr-only" htmlFor="message">
						Message
					</label>
					<textarea
						id="message"
						placeholder={placeholder}
						className="w-full resize-none bg-transparent outline-none placeholder:text-white/40 text-[15px]"
						name={reg.name}
						onBlur={reg.onBlur}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						ref={(el) => {
							reg.ref(el);
							textareaRef.current = el;
						}}
					/>
					<Popover
						open={mentionOpen}
						onOpenChange={(o) =>
							o ? setMentionOpen(true) : setMentionOpen(false)
						}>
						<PopoverAnchor className="absolute left-2 bottom-[-2px] h-0 w-0" />
						{mentionOptions.length > 0 && (
							<PopoverContent sideOffset={8} className="w-64 p-0">
								<ul className="max-h-60 overflow-y-auto py-1 text-sm">
									{mentionOptions.map((opt, idx) => (
										<li key={opt.id}>
											<button
												onMouseDown={(e) => {
													e.preventDefault();
													selectMention(opt);
												}}
												className={`w-full text-left px-3 py-1.5 hover:bg-white/10 ${
													idx === mentionActiveIndex ? 'bg-white/10' : ''
												}`}>
												@{opt.name}
											</button>
										</li>
									))}
								</ul>
							</PopoverContent>
						)}
					</Popover>
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
							title="Mention"
							onClick={() => {
								insertAtCaret('@');
								setMentionOpen(true);
							}}>
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
						<Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
							<PopoverTrigger asChild>
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
							</PopoverTrigger>
							<PopoverContent sideOffset={8} className="w-64 p-2">
								<EmojiPicker
									className="h-[326px] rounded-lg border shadow-md"
									onEmojiSelect={({ emoji }) => {
										setEmojiOpen(false);
										insertAtCaret(emoji);
									}}>
									<EmojiPickerSearch />
									<EmojiPickerContent />
								</EmojiPicker>
							</PopoverContent>
						</Popover>
					</div>
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
			</form>
		</footer>
	);
}
