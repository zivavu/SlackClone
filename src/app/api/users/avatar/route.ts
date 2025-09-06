'use server';

import { getUserId } from '@/lib/auth-helpers';
import { getGridFsBucket } from '@/lib/gridfs';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
	const userId = await getUserId(request);
	if (!userId)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const fileName = `avatar-${userId}-${Date.now()}.webp`;

	try {
		const reader = request.body?.getReader();
		if (!reader)
			return NextResponse.json({ error: 'No body' }, { status: 400 });

		const chunks: Uint8Array[] = [];
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			if (value) chunks.push(value);
		}
		const inputBuffer = Buffer.concat(chunks);

		const processed = await sharp(inputBuffer)
			.rotate()
			.resize(300, 300, { fit: 'cover' })
			.webp({ quality: 90 })
			.toBuffer();

		const bucket = await getGridFsBucket();
		const uploadStream = bucket.openUploadStream(fileName, {
			contentType: 'image/webp',
		});
		uploadStream.end(processed);

		const fileId = uploadStream.id?.toString();
		if (!fileId)
			return NextResponse.json({ error: 'Upload failed' }, { status: 500 });

		const db = await getDb();
		await db
			.collection('user')
			.updateOne(
				{ _id: new ObjectId(userId) },
				{ $set: { image: `/api/files/${fileId}` } }
			);

		return NextResponse.json({ fileId, url: `/api/files/${fileId}` });
	} catch {
		return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
	}
}
