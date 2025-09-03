'use server';

import { getMongoClient } from '@/lib/mongodb';
import { GridFSBucket } from 'mongodb';

let cachedBucket: GridFSBucket | null = null;

export async function getGridFsBucket(): Promise<GridFSBucket> {
	if (cachedBucket) return cachedBucket;
	const client = await getMongoClient();
	const dbName = process.env.MONGODB_DB || 'slack_clone';
	const db = client.db(dbName);
	cachedBucket = new GridFSBucket(db, { bucketName: 'uploads' });
	return cachedBucket;
}
