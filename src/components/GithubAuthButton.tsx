'use client';

import GithubIcon from '@/assets/svg/github.svg';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useState } from 'react';

type CallbackCtx = { error: { message: string } };

type GithubAuthButtonProps = {
	label?: string;
	className?: string;
};

export default function GithubAuthButton({
	label = 'Continue with GitHub',
	className,
}: GithubAuthButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function handleGithubSignIn() {
		setIsLoading(true);
		setError(null);
		try {
			await authClient.signIn.social(
				{ provider: 'github' },
				{
					onError: (ctx: CallbackCtx) => {
						setError(ctx.error.message);
						setIsLoading(false);
					},
				}
			);
		} catch {
			setError('An unexpected error occurred');
			setIsLoading(false);
		}
	}

	return (
		<div className={className}>
			<button
				type="button"
				onClick={handleGithubSignIn}
				disabled={isLoading}
				className="w-full rounded bg-[#0d1117] text-white py-2 font-medium border border-white/10 hover:bg-[#161b22] disabled:opacity-70">
				{isLoading ? (
					'Redirecting…'
				) : (
					<div className="flex items-center gap-2 justify-center">
						<Image src={GithubIcon} alt="GitHub" width={20} height={20} />
						<span>{label}</span>
					</div>
				)}
			</button>
			{error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
		</div>
	);
}
