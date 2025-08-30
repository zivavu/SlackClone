'use server';

import { getDb } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

type DirectMessageUser = {
	name: string;
	status: 'online' | 'away' | 'offline';
};

type UserRow = { id: string; name?: string };
type PresenceRow = {
	userId: string;
	status?: 'online' | 'away' | 'offline';
	lastSeenAt?: Date;
};

export async function GET() {
	const db = await getDb();
	const usersCol = db.collection('users');
	const presenceCol = db.collection('presence');

	const [users, presenceDocs] = await Promise.all([
		usersCol
			.aggregate<UserRow>([{ $project: { _id: 0, id: 1, name: 1 } }])
			.toArray(),
		presenceCol
			.aggregate<PresenceRow>([
				{ $project: { _id: 0, userId: 1, status: 1, lastSeenAt: 1 } },
			])
			.toArray(),
	]);
	console.log(users);
	console.log(presenceDocs);

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

	const result: DirectMessageUser[] = users
		.map((u) => ({
			name: u.name || 'Unknown',
			status:
				(userIdToPresence.get(u.id) as DirectMessageUser['status']) ||
				'offline',
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	console.log(result);

	return NextResponse.json(result);
}
