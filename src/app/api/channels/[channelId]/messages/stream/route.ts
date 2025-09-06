'use server';

import { getDb } from '@/lib/mongodb';
import { toSse } from '@/lib/sse';
import type { Message } from '@/types/chat';
import type { ChangeStream } from 'mongodb';
import { ObjectId } from 'mongodb';

type SseEvent =
	| { type: 'insert'; message: Message }
	| { type: 'update'; message: Message }
	| { type: 'delete'; id: string };

export async function GET(
	_req: Request,
	context: { params: Promise<{ channelId: string }> }
) {
	const { channelId } = await context.params;
	if (!channelId) {
		return new Response(JSON.stringify({ error: 'Missing channelId' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const db = await getDb();
	const collection = db.collection('messages');

	let heartbeat: ReturnType<typeof setInterval> | null = null;
	let changeStream: ChangeStream | null = null;
	let isClosed = false;

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			const encoder = new TextEncoder();

			const cleanup = () => {
				if (isClosed) return;
				isClosed = true;
				if (heartbeat) {
					clearInterval(heartbeat);
					heartbeat = null;
				}
				changeStream?.close();

				controller?.close();
			};

			heartbeat = setInterval(() => {
				if (isClosed) return;
				try {
					controller.enqueue(encoder.encode(`: keep-alive\n\n`));
				} catch {
					cleanup();
				}
			}, 20000);

			const pipeline = [
				{
					$match: {
						operationType: { $in: ['insert', 'update', 'replace', 'delete'] },
					},
				},
				{
					$match: {
						$or: [
							{ operationType: 'delete' },
							{ 'fullDocument.channelId': channelId },
						],
					},
				},
			];

			changeStream = collection.watch(pipeline, {
				fullDocument: 'updateLookup',
			});

			const send = (evt: SseEvent) => {
				if (isClosed) return;
				try {
					controller.enqueue(encoder.encode(toSse(evt)));
				} catch {
					cleanup();
				}
			};

			changeStream.on('change', (change) => {
				try {
					if (
						change.operationType === 'insert' ||
						change.operationType === 'replace'
					) {
						const doc = change.fullDocument as unknown as {
							_id: ObjectId;
							authorName: string;
							authorId: string;
							content: string;
							mentions?: string[];
							createdAt: Date | string;
							updatedAt?: Date | string;
							channelId: string;
						};
						if (!doc || doc.channelId !== channelId) return;
						const message: Message = {
							_id: String(doc._id),
							authorName: doc.authorName,
							authorId: doc.authorId,
							content: doc.content,
							mentions: Array.isArray(doc.mentions) ? doc.mentions : undefined,
							createdAt: new Date(doc.createdAt).toISOString(),
							updatedAt: doc.updatedAt
								? new Date(doc.updatedAt).toISOString()
								: undefined,
						};
						send({ type: 'insert', message });
					} else if (change.operationType === 'update') {
						const doc = change.fullDocument as unknown as {
							_id: ObjectId;
							authorName: string;
							authorId: string;
							content: string;
							mentions?: string[];
							createdAt: Date | string;
							updatedAt?: Date | string;
							channelId: string;
						};
						if (!doc || doc.channelId !== channelId) return;
						const message: Message = {
							_id: String(doc._id),
							authorName: doc.authorName,
							authorId: doc.authorId,
							content: doc.content,
							mentions: Array.isArray(doc.mentions) ? doc.mentions : undefined,
							createdAt: new Date(doc.createdAt).toISOString(),
							updatedAt: doc.updatedAt
								? new Date(doc.updatedAt).toISOString()
								: undefined,
						};
						send({ type: 'update', message });
					} else if (change.operationType === 'delete') {
						const id = String((change.documentKey as { _id: ObjectId })._id);
						send({ type: 'delete', id });
					}
				} catch {
					// ignore individual event errors
				}
			});

			changeStream.on('error', cleanup);
		},
		cancel() {
			// Called when the consumer cancels the stream
			// Ensure we cleanup to avoid heartbeats after closure
			isClosed = true;
			if (heartbeat) {
				clearInterval(heartbeat);
				heartbeat = null;
			}
			try {
				changeStream?.close();
			} catch {}
		},
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache, no-transform',
			Connection: 'keep-alive',
		},
	});
}
