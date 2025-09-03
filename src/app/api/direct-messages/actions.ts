'use server';

import { getDb } from '@/lib/mongodb';

export type DirectMessageUser = {
	id: string;
	name: string;
	status: 'online' | 'away' | 'offline';
	avatarUrl?: string;
};

type UserRow = { _id: string; name?: string; avatarFileId?: string };
type PresenceRow = {
	userId: string;
	status?: 'online' | 'away' | 'offline';
	lastSeenAt?: Date;
};

export async function getDirectMessages(): Promise<DirectMessageUser[]> {
	const db = await getDb();
	const usersCol = db.collection('user');
	const presenceCol = db.collection('presence');

	const [users, presenceDocs] = await Promise.all([
		usersCol
			.aggregate<UserRow>([{ $project: { id: 1, name: 1, avatarFileId: 1 } }])
			.toArray(),
		presenceCol
			.aggregate<PresenceRow>([
				{ $project: { userId: 1, status: 1, lastSeenAt: 1 } },
			])
			.toArray(),
	]);

	const now = Date.now();
	const userIdToPresence = new Map<string, 'online' | 'away' | 'offline'>();
	for (const docs of presenceDocs) {
		const last = docs.lastSeenAt ? new Date(docs.lastSeenAt).getTime() : 0;
		const diff = now - last;
		let status: 'online' | 'away' | 'offline' = 'offline';
		if (last > 0) {
			if (diff <= 35000) status = 'online';
			else if (diff <= 5 * 60000) status = 'away';
			else status = 'offline';
		}
		userIdToPresence.set(docs.userId, status);
	}

	return users
		.filter((user) => user.name)
		.map((user) => ({
			id: user._id.toString(),
			name: user.name!,
			avatarUrl: user.avatarFileId
				? `/api/files/${user.avatarFileId}`
				: undefined,
			status:
				(userIdToPresence.get(user._id) as DirectMessageUser['status']) ||
				'offline',
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}
