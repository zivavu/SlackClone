'use server';

import { getDb } from '@/lib/mongodb';

export type Status = 'online' | 'offline';

export type DirectMessageUser = {
	id: string;
	name: string;
	status: Status;
	image?: string;
};

type PresenceRow = {
	userId: string;
	status?: Status;
	lastSeenAt?: Date;
};

export async function getDirectMessages(): Promise<DirectMessageUser[]> {
	const db = await getDb();
	const usersCol = db.collection('user');
	const presenceCol = db.collection('presence');

	const [users, presenceDocs] = await Promise.all([
		usersCol.aggregate([{ $project: { id: 1, name: 1, image: 1 } }]).toArray(),
		presenceCol
			.aggregate<PresenceRow>([
				{ $project: { userId: 1, status: 1, lastSeenAt: 1 } },
			])
			.toArray(),
	]);

	const now = Date.now();
	const userIdToPresence = new Map<string, Status>();
	for (const docs of presenceDocs) {
		const last = docs.lastSeenAt ? new Date(docs.lastSeenAt).getTime() : 0;
		const diff = now - last;
		let status: Status = 'offline';
		if (last > 0) {
			if (diff <= 1 * 60 * 1000) status = 'online';
			else status = 'offline';
		}
		userIdToPresence.set(docs.userId, status);
	}

	return users
		.filter((user) => user.name)
		.map((user) => ({
			id: user._id.toString(),
			name: user.name!,
			image: user.image,
			status:
				(userIdToPresence.get(
					user._id.toString()
				) as DirectMessageUser['status']) || 'offline',
		}))
		.sort((a, b) => a.name.localeCompare(b.name)) as DirectMessageUser[];
}
