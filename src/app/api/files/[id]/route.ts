'use server';

import { getGridFsBucket } from '@/lib/gridfs';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(
	_request: Request,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;
	try {
		const bucket = await getGridFsBucket();
		const _id = new ObjectId(id);
		const files = await bucket.find({ _id }).limit(1).toArray();
		if (!files.length) {
			return new NextResponse('Not found', { status: 404 });
		}
		const file = files[0] as unknown as { contentType: string };
		const stream = bucket.openDownloadStream(_id);
		const contentType = file?.contentType || 'application/octet-stream';
		return new NextResponse(stream as unknown as ReadableStream, {
			headers: { 'Content-Type': contentType },
		});
	} catch (_e) {
		return NextResponse.json(
			{ error: 'Failed to fetch file' },
			{ status: 500 }
		);
	}
}
