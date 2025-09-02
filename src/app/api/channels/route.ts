import { NextResponse } from 'next/server';
import { createChannel, getChannels } from './actions';

export async function GET() {
	const result = await getChannels();
	return NextResponse.json(result);
}

export async function POST(req: Request) {
	try {
		const { name, topic } = await req.json();
		if (!name || typeof name !== 'string') {
			return NextResponse.json({ error: 'name is required' }, { status: 400 });
		}
		const result = await createChannel({ name, topic });
		return NextResponse.json(result, { status: 201 });
	} catch {
		return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
	}
}
