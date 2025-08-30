'use client';

import GithubAuthButton from '@/components/GithubAuthButton';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type CallbackCtx = { error: { message: string } };
type FormValues = { email: string; password: string };

export default function LoginPage() {
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: { email: '', password: '' },
	});

	const redirectTo = searchParams.get('redirect') || '/client';

	async function onSubmit({ email, password }: FormValues) {
		setIsLoading(true);
		setError(null);
		const { error } = await authClient.signIn.email(
			{ email, password, callbackURL: redirectTo, rememberMe: true },
			{
				onError: (ctx: CallbackCtx) => setError(ctx.error.message),
			}
		);
		if (error) setError(error?.message ?? null);
		setIsLoading(false);
	}

	return (
		<main className="min-h-svh grid place-items-center bg-[#121317] text-foreground px-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-sm space-y-4 bg-white/5 rounded-xl p-6 border border-white/10">
				<h1 className="text-lg font-semibold">Sign in</h1>
				<label className="block">
					<span className="text-sm text-white/70">Email</span>
					<input
						type="email"
						{...register('email', { required: true })}
						className="mt-1 w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
					/>
				</label>
				<label className="block">
					<span className="text-sm text-white/70">Password</span>
					<input
						type="password"
						{...register('password', { required: true })}
						className="mt-1 w-full rounded bg-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
					/>
				</label>
				{error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded bg-white text-black py-2 font-medium hover:bg-white/90 disabled:opacity-70">
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
				<div className="relative">
					<div
						className="absolute inset-0 flex items-center"
						aria-hidden="true">
						<div className="w-full border-t border-white/10"></div>
					</div>
					<div className="relative flex justify-center text-xs">
						<span className="text-white/60">or</span>
					</div>
				</div>
				<GithubAuthButton />

				<div className="text-sm text-white/70">
					No account?{' '}
					<Link href="/signup" className="underline">
						Sign up
					</Link>
				</div>
			</form>
		</main>
	);
}
