import type { Metadata } from 'next';
import { Geist_Mono, Lato } from 'next/font/google';
import './globals.css';

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
		<html lang="en">
			<body className={`${lato.variable} ${geistMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
