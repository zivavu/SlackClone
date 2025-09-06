export function toSse(data: unknown): string {
	return `data: ${JSON.stringify(data)}\n\n`;
}

export function startHeartbeat(
	controller: ReadableStreamDefaultController<Uint8Array>,
	intervalMs = 20000
) {
	const encoder = new TextEncoder();
	let closed = false;
	const id = setInterval(() => {
		if (closed) return;
		try {
			controller.enqueue(encoder.encode(`: keep-alive\n\n`));
		} catch {
			closed = true;
			clearInterval(id);
		}
	}, intervalMs);
	return () => {
		closed = true;
		clearInterval(id);
	};
}

export function createSseStream(
	onStart: (
		controller: ReadableStreamDefaultController<Uint8Array>
	) => void | Promise<void>
) {
	let cleanupFns: Array<() => void> = [];
	let isClosed = false;
	const stream = new ReadableStream<Uint8Array>({
		async start(controller) {
			await onStart(controller);
		},
		cancel() {
			isClosed = true;
			for (const fn of cleanupFns) {
				try {
					fn();
				} catch {}
			}
			cleanupFns = [];
		},
	});
	return {
		stream,
		pushCleanup(fn: () => void) {
			if (isClosed) return;
			cleanupFns.push(fn);
		},
	};
}
