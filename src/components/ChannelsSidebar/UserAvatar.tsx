'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';

type Status = 'online' | 'away' | 'offline';

export function UserAvatar({
	src,
	name,
	className,
	showStatus,
	status,
}: {
	src?: string | null;
	name?: string | null;
	className?: string;
	showStatus?: boolean;
	status?: Status;
}) {
	const color =
		status === 'online' ? '#22c55e' : status === 'away' ? '#f59e0b' : '#6b7280';
	return (
		<span
			className={cn(
				'relative inline-flex items-center justify-center overflow-hidden bg-white/10 text-white/90',
				className
			)}>
			{src ? (
				<Image
					src={src}
					alt={name || 'Avatar'}
					fill
					className="object-cover"
					sizes="40px"
				/>
			) : (
				<span className="text-[11px] font-semibold select-none">
					{(name || 'You').charAt(0).toUpperCase()}
				</span>
			)}
			{showStatus ? (
				<span
					className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-black/60"
					style={{ backgroundColor: color }}
				/>
			) : null}
		</span>
	);
}
