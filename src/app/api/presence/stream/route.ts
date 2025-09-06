import { getDb } from '@/lib/mongodb';
import { toSse as toSseShared } from '@/lib/sse';
import type { Status } from '@/types/chat';
import type { ChangeStream, ChangeStreamDocument } from 'mongodb';

type PresenceEvent = {
	userId: string;
	status?: Status;
	lastSeenAt?: string;
};

type PresenceDoc = {
	userId: string;
	status?: Status;
	lastSeenAt?: Date | string;
};

// use shared SSE serializer

export async function GET() {
	const db = await getDb();
	const col = db.collection('presence');

	let closed = false;
	let cs: ChangeStream | null = null;
	let hb: ReturnType<typeof setInterval> | null = null;

	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			const enc = new TextEncoder();
			const cleanup = () => {
				if (closed) return;
				closed = true;
				if (hb) clearInterval(hb);
				cs?.close();
				controller?.close();
			};

			hb = setInterval(() => {
				if (closed) return;
				try {
					controller.enqueue(enc.encode(`: keep-alive\n\n`));
				} catch {
					cleanup();
				}
			}, 20000);

			cs = col.watch<PresenceDoc>(
				[
					{
						$match: { operationType: { $in: ['insert', 'update', 'replace'] } },
					},
				],
				{ fullDocument: 'updateLookup' }
			);

			cs.on('change', (change: ChangeStreamDocument<PresenceDoc>) => {
				if (
					change.operationType === 'insert' ||
					change.operationType === 'update' ||
					change.operationType === 'replace'
				) {
					const doc = change.fullDocument!;
					if (!doc || !doc.userId) return;
					const evt: PresenceEvent = {
						userId: doc.userId,
						status: doc.status,
						lastSeenAt: doc.lastSeenAt
							? new Date(doc.lastSeenAt).toISOString()
							: undefined,
					};
					try {
						controller.enqueue(enc.encode(toSseShared(evt)));
					} catch {
						cleanup();
					}
				}
			});

			cs.on('error', cleanup);
		},
		cancel() {
			closed = true;
			if (hb) clearInterval(hb);
			try {
				cs?.close();
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
