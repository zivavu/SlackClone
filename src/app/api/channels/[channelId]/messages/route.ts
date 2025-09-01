import { NextResponse } from 'next/server';
import { getChannelMessages } from './actions';

export async function GET(
	_req: Request,
	context: { params: Promise<{ channelId: string }> }
) {
	const { channelId } = await context.params;
	if (!channelId)
		return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });
	const result = await getChannelMessages(channelId);
	return NextResponse.json(result);
}
