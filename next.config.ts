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
};

export default nextConfig;
