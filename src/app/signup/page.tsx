'use client';

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CallbackCtx = { error: { message: string } };

export default function SignUpPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		const { error } = await authClient.signUp.email(
			{ email, password, name, callbackURL: '/client' },
			{
				onError: (ctx: CallbackCtx) => setError(ctx.error.message),
				onSuccess: () => router.push('/client'),
			}
		);
		if (error) setError(error?.message ?? null);
		setIsLoading(false);
	}

	return (
		<main className="min-h-svh grid place-items-center bg-[#121317] text-foreground px-4">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
				<h1 className="text-lg font-semibold">Sign up</h1>
				{error ? <p className="text-sm text-red-400">{error}</p> : null}
				<label className="block">
					<span className="text-sm text-white/70">Name</span>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						className="mt-1 w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
					/>
				</label>
				<label className="block">
					<span className="text-sm text-white/70">Email</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="mt-1 w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
					/>
				</label>
				<label className="block">
					<span className="text-sm text-white/70">Password</span>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mt-1 w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
					/>
				</label>
				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded bg-white text-black py-2 font-medium hover:bg-white/90 disabled:opacity-70">
					{isLoading ? 'Creating account...' : 'Create account'}
				</button>
				<div className="text-sm text-white/70">
					Already have an account?{' '}
					<Link href="/login" className="underline">
						Login
					</Link>
				</div>
			</form>
		</main>
	);
}
