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
	return (
		<aside className="hidden md:flex w-20 flex-col py-3">
			<div className="flex items-center justify-center">
				<button className="size-10 rounded-xl bg-white/10 text-[11px] font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20">
					AC
				</button>
			</div>
			<nav className="mt-3 flex-1">
				<ul className="space-y-4 text-[12px]">
					{navItems.map(({ label, href, icon: Icon, isActive }) => (
						<li key={label}>
							<Link
								href={href}
								className={`group flex flex-col items-center gap-1 rounded ${
									isActive ? 'text-white/90' : 'text-white/80'
								}`}>
								<span className="size-9 rounded-lg grid place-items-center p-2  group-hover:bg-white/20 transition-colors">
									<Icon className="size-5" aria-hidden />
								</span>
								<span className="truncate">{label}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
