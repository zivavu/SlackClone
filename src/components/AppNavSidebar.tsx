'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { authClient } from '@/lib/auth-client';
import {
	Bell,
	Bookmark,
	FileText,
	Home,
	MessageSquare,
	MoreHorizontal,
	type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProfileDialog } from './ChannelsSidebar/ProfileDialog';
import { UserAvatar } from './ChannelsSidebar/UserAvatar';

type NavItem = {
	label: string;
	href: string;
	icon: LucideIcon;
	isActive?: boolean;
};

const navItems: NavItem[] = [
	{ label: 'Home', href: '#', icon: Home, isActive: true },
	{ label: 'DMs', href: '#', icon: MessageSquare },
	{ label: 'Activity', href: '#', icon: Bell },
	{ label: 'Files', href: '#', icon: FileText },
	{ label: 'Later', href: '#', icon: Bookmark },
	{ label: 'More', href: '#', icon: MoreHorizontal },
];

export function AppNavSidebar() {
	const { data: session } = authClient.useSession();
	const router = useRouter();
	const [profileOpen, setProfileOpen] = useState(false);

	async function handleSignOut() {
		await authClient.signOut();
		router.push('/signin');
	}

	return (
		<aside className="hidden md:flex w-20 flex-col py-3">
			<div className="flex items-center justify-center">
				<button className="size-10 rounded-md bg-white/30 text-xl font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-ring/20 text-[#26172b]">
					LM
				</button>
			</div>
			<nav className="mt-3 flex-1">
				<ul className="space-y-2 text-[12px]">
					{navItems.map(({ label, href, icon: Icon, isActive }) => (
						<li key={label}>
							<Link
								href={href}
								className={`group flex flex-col items-center gap-1 rounded ${
									isActive ? 'text-white/90' : 'text-white/80'
								}`}>
								<span className="size-9 rounded-lg grid place-items-center p-2  group-hover:bg-foreground/20 transition-colors">
									<Icon className="size-5" aria-hidden />
								</span>
								<span className="truncate">{label}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<div className="mt-3 flex items-center justify-center">
				<Popover>
					<PopoverTrigger asChild>
						<button className="size-10 rounded-md overflow-hidden bg-white/10 text-white/90 grid place-items-center focus:outline-none focus:ring-2 focus:ring-ring/20">
							<UserAvatar
								src={session?.user?.image}
								name={session?.user?.name || 'You'}
								className="size-10 rounded-md"
							/>
						</button>
					</PopoverTrigger>
					<PopoverContent
						sideOffset={8}
						align="start"
						className="w-64 p-0 overflow-hidden">
						<div className="p-3 border-b border-white/10 flex items-center gap-3">
							<UserAvatar
								src={session?.user?.image}
								name={session?.user?.name || 'You'}
								className="size-8 rounded"
							/>
							<div className="min-w-0">
								<p className="text-sm font-semibold truncate">
									{session?.user?.name || 'You'}
								</p>
								<p className="text-xs text-white/60">Online</p>
							</div>
						</div>
						<button
							onClick={() => setProfileOpen(true)}
							className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
							Profile
						</button>
						<button
							onClick={handleSignOut}
							className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
							Sign out
						</button>
					</PopoverContent>
				</Popover>
			</div>
			<ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
		</aside>
	);
}
