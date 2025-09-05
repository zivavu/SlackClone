import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	rewrites: async () => {
		return [
			{
				source: '/',
				destination: '/client',
			},
		];
	},
	images: {
		domains: ['avatars.githubusercontent.com'],
	},
};

export default nextConfig;
