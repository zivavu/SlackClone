import { defaultChannels } from '@/data/channels';
import { getDb } from '@/lib/mongodb';

export type Channel = {
	id: string;
	name: string;
	topic?: string;
};

export async function getChannels() {
	const db = await getDb();
	const channels = await db.collection('channels').find().toArray();
	return channels.map((channel) => ({
		id: channel._id.toString(),
		name: channel.name,
		topic: channel.topic,
	}));
}

export async function createChannel({
	name,
	topic,
	id,
}: {
	name: string;
	topic?: string;
	id?: string;
}) {
	const db = await getDb();
	const result = await db.collection('channels').insertOne({
		name,
		topic,
		id,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
	return { id: result.insertedId.toString() };
}

export async function seedDefaultChannels() {
	const db = await getDb();
	const count = await db.collection('channels').countDocuments();
	if (count > 0) return { inserted: 0 };

	const docs = defaultChannels.map((d) => ({ ...d, createdAt: new Date() }));
	const result = await db.collection('channels').insertMany(docs);
	return { inserted: result.insertedCount };
}
