import type { Metadata } from 'next';
import { Geist_Mono, Lato } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from './ReactQueryProvider';

const lato = Lato({
	variable: '--font-geist-sans',
	subsets: ['latin'],
	weight: ['300', '400', '700', '900'],
	style: ['normal', 'italic'],
	display: 'swap',
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Clone of Slack',
	description: 'Clone of Slack',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(() => { try { const k = 'theme'; const s = localStorage.getItem(k); const m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; const t = s || (m ? 'dark' : 'light'); if (t === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); } catch(_) {} })();`,
					}}
				/>
			</head>
			<body className={`${lato.variable} ${geistMono.variable} antialiased`}>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</body>
		</html>
	);
}
