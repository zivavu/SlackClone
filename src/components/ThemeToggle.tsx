'use client';

import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		if (typeof document === 'undefined') return;
		const hasDark = document.documentElement.classList.contains('dark');
		setIsDark(hasDark);
	}, []);

	function setTheme(next: 'light' | 'dark') {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', next === 'dark');
		}
		try {
			localStorage.setItem(THEME_KEY, next);
		} catch {}
		setIsDark(next === 'dark');
	}

	function handleToggle() {
		setTheme(isDark ? 'light' : 'dark');
	}

	return (
		<button
			onClick={handleToggle}
			className="p-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
			title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
			{isDark ? (
				<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
					<path
						d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			) : (
				<svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
					<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
					<path
						d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</svg>
			)}
		</button>
	);
}
