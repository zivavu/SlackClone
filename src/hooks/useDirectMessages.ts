import type { DirectMessageUser } from '@/types/chat';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useDirectMessages(initialData: DirectMessageUser[]) {
	const queryClient = useQueryClient();

	const { data = initialData } = useQuery({
		queryKey: ['direct-messages'],
		queryFn: async () => {
			const res = await fetch('/api/direct-messages');
			if (!res.ok) throw new Error('Failed to load DMs');
			return (await res.json()) as DirectMessageUser[];
		},
		initialData,
		refetchInterval: 20000,
		staleTime: 5000,
	});

	useEffect(() => {
		function computeStatus(lastSeenAt?: string): DirectMessageUser['status'] {
			if (!lastSeenAt) return 'offline';
			const last = new Date(lastSeenAt).getTime();
			if (!last) return 'offline';
			const diff = Date.now() - last;
			if (diff <= 1 * 60 * 1000) return 'online';
			return 'offline';
		}

		const es = new EventSource('/api/presence/stream');
		es.onmessage = (ev) => {
			try {
				const data = JSON.parse(ev.data) as {
					userId: string;
					status?: DirectMessageUser['status'];
					lastSeenAt?: string;
				};
				const nextStatus = data.status || computeStatus(data.lastSeenAt);
				if (!data.userId || !nextStatus) return;
				queryClient.setQueryData<DirectMessageUser[]>(
					['direct-messages'],
					(prev) => {
						if (!Array.isArray(prev)) return prev;
						let changed = false;
						const updated = prev.map((u) => {
							if (u.id === data.userId && u.status !== nextStatus) {
								changed = true;
								return { ...u, status: nextStatus };
							}
							return u;
						});
						return changed ? updated : prev;
					}
				);
			} catch {}
		};
		es.onerror = () => {
			es.close();
		};
		return () => {
			es.close();
		};
	}, [queryClient]);

	return data;
}
