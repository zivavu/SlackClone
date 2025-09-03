'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ThemeToggle from './ThemeToggle';

export function GlobalTopBar() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [name, setName] = useState('');
	const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	useEffect(() => {
		if (!open) return;
		void (async () => {
			const res = await fetch('/api/users/me');
			if (res.ok) {
				const data = (await res.json()) as {
					name?: string;
					avatarUrl: string | null;
				};
				setName(data?.name ?? '');
				setCurrentAvatarUrl(data.avatarUrl || null);
			}
		})();
	}, [open]);

	async function handleSignOut() {
		await authClient.signOut();
		router.push('/signin');
	}

	const {
		getRootProps,
		getInputProps,
		open: openFileDialog,
		isDragActive,
	} = useDropzone({
		multiple: false,
		accept: { 'image/*': [] },
		noClick: true,
		onDrop: (accepted) => {
			const f = accepted[0];
			if (f) {
				const url = URL.createObjectURL(f);
				setPreviewUrl(url);
				setSelectedFile(f);
			}
		},
	});
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

				<div className="flex items-center gap-1.5">
					<ThemeToggle />

					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
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
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Profile</DialogTitle>
							</DialogHeader>
							<label className="block text-sm">Display name</label>
							<input
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								className="w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20 mb-3"
							/>
							<label className="block text-sm">Profile picture</label>
							<div className="mb-3">
								<div className="size-20 rounded-full overflow-hidden bg-white/10 grid place-items-center">
									{previewUrl || currentAvatarUrl ? (
										<Image
											src={previewUrl || currentAvatarUrl || ''}
											alt="Avatar preview"
											width={80}
											height={80}
											className="object-cover size-20"
										/>
									) : (
										<span className="text-xs text-white/60">No picture</span>
									)}
								</div>
							</div>
							<div
								{...getRootProps()}
								className={`mt-1 border border-dashed rounded p-4 text-sm cursor-pointer ${
									isDragActive ? 'bg-white/10' : 'bg-white/5'
								}`}>
								<input {...getInputProps()} />
								<p className="text-white/80">
									Drag & drop an image here, or
									<button
										type="button"
										onClick={openFileDialog}
										className="underline pl-1">
										browse
									</button>
								</p>
							</div>
							{selectedFile ? (
								<p className="text-xs text-white/60 mt-1">
									Ready to upload: {selectedFile.name}
								</p>
							) : null}
							<div className="flex justify-end gap-2 mt-4">
								<button
									disabled={saving}
									onClick={async () => {
										if (!name.trim()) return;
										setSaving(true);
										try {
											const requests: Promise<unknown>[] = [];
											requests.push(
												fetch('/api/users/name', {
													method: 'PATCH',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({ name: name.trim() }),
												})
											);
											if (selectedFile) {
												requests.push(
													fetch('/api/users/avatar', {
														method: 'POST',
														headers: {
															'content-type':
																selectedFile.type || 'application/octet-stream',
														},
														body: selectedFile,
													})
												);
											}
											await Promise.all(requests);
											router.refresh();
											queryClient.invalidateQueries({
												queryKey: ['direct-messages'],
											});
											setOpen(false);
										} finally {
											setSaving(false);
										}
									}}
									className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
									{saving ? 'Saving…' : 'Save'}
								</button>
							</div>
						</DialogContent>
					</Dialog>
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
