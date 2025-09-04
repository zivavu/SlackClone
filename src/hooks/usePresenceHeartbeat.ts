import { useEffect } from 'react';

export function usePresenceHeartbeat(userId?: string) {
	useEffect(() => {
		if (!userId) return;
		let interval: ReturnType<typeof setInterval> | null = null;
		const beat = async () => {
			try {
				await fetch('/api/presence/heartbeat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userId }),
				});
			} catch {}
		};
		beat();
		interval = setInterval(beat, 20000);
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [userId]);
}
