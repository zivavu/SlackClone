import { NextResponse } from 'next/server';
import { getDirectMessages } from './actions';

export async function GET() {
	const result = await getDirectMessages();
	return NextResponse.json(result);
}
