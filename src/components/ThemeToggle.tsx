'use client';

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	function handleToggle() {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	}

	return (
		<button
			onClick={handleToggle}
			className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
			title="Toggle theme"
			aria-label="Toggle theme">
			<svg
				viewBox="0 0 24 24"
				className="size-5 block dark:hidden"
				fill="none"
				aria-hidden>
				<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
				<path
					d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
			<svg
				viewBox="0 0 24 24"
				className="size-5 hidden dark:block"
				fill="none"
				aria-hidden>
				<path
					d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
}
