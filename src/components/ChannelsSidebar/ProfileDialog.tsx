'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function ProfileDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
}) {
	const router = useRouter();
	const queryClient = useQueryClient();
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
					image?: string | null;
				};
				setName(data?.name ?? '');
				setCurrentAvatarUrl(data.image || null);
			}
		})();
	}, [open]);

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

	async function onSave() {
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
							'content-type': selectedFile.type || 'application/octet-stream',
						},
						body: selectedFile,
					})
				);
			}
			await Promise.all(requests);
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
			onOpenChange(false);
		} finally {
			setSaving(false);
		}
	}

	async function onDeleteAccount() {
		if (!confirm('Permanently delete your account? This cannot be undone.'))
			return;
		const res = await fetch('/api/users/delete', { method: 'DELETE' });
		if (res.ok) {
			onOpenChange(false);
			router.push('/signin');
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
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
					<div className="size-20 rounded-full overflow-hidden bg-white/10 grid place-items-center relative">
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
				<div className="flex justify-between gap-2 mt-4">
					<button
						onClick={onDeleteAccount}
						className="rounded px-3 py-2 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-200">
						Delete account
					</button>
					<div className="flex gap-2">
						<button
							onClick={() => onOpenChange(false)}
							className="rounded px-3 py-2 text-sm hover:bg-white/10">
							Cancel
						</button>
						<button
							disabled={saving}
							onClick={onSave}
							className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
							{saving ? 'Saving…' : 'Save'}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
