import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'slack_clone';

if (!uri) {
	throw new Error('Missing MONGODB_URI env var');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
	if (cachedClient) return cachedClient;
	const client = new MongoClient(uri!);
	cachedClient = await client.connect();
	return cachedClient;
}

export async function getDb(): Promise<Db> {
	if (cachedDb) return cachedDb;
	const client = await getMongoClient();
	cachedDb = client.db(dbName);
	return cachedDb;
}
